import { ASSISTANT_COUNTRY_LEAD_ROLE, COUNTRY_LEAD_ROLE, PrismaCustomResponse } from "@/types/Common";
import { sendMail } from "@/utils/Nodemailer";
import { review } from "@/emails/cowDispersalRequests/review";
import { VIEW_FAMILY_COW_DISPERSALS, CREATE_FAMILY_COW_DISPERSALS } from "@/permissions/Permissions";
import { getToken } from "next-auth/jwt";
import { createOrUpdateCounter } from "@/helpers/Counter";
import { cowDispersalsQuery } from "@/helpers/Query/cowDispersals";
import prismaPaginator from "@/helpers/Paginator/PrismaPaginator";
import { Prisma } from "@prisma/client";
import { COW_DISPERSAL_ID } from "@/types/Counter";
import { handlePrismaErrors } from "prisma/prismaErrorHandling";
import { prismaClient } from "@/utils/Prisma";
import { createLogHelper } from "@/helpers/LogHelper";

const secret = process.env.NEXTAUTH_SECRET;
const prisma = prismaClient;

interface queryProps {
  req: any,
  cursor?: string,
  search?: string,
  sort?: string;
  pageSize?: number;
  limit?: number;
  paginate?: boolean;
  filterFamily?: boolean;
  filterCountry?: boolean;
  status?: string;
  statuses?: string[] | string;
}

export default async function handler(req: any, res: any) {
  //API Middleware components
  const token = await getToken({ req, secret });
  const user: any = token?.user;
  const permissions: string[] = user?.permissions;

  // switch the methods
  switch (req.method) {
    case "GET": 
      if(permissions.includes(VIEW_FAMILY_COW_DISPERSALS)){
        return index(req, res);
      }
      return res.status(422).json({ data: "FamilyCowDispersalAPI: Access Denied" });
    
    case 'POST':
      if(permissions.includes(CREATE_FAMILY_COW_DISPERSALS)){
        return create(req, res, user);
      }
      return res.status(422).json({ data: "FamilyCowDispersalAPI: Access Denied" });
    
    default:
      res.status(400).json('Invalid request');
  }
}

export const getData = async ({
  req,
  cursor = '',
  search = '',
  sort = '',
  limit = 10,
  paginate = false,
  filterFamily = true,
  filterCountry = true,
  status = '',
  statuses = ''
}: queryProps) => {
  await prisma.$connect();
  
  const searchQuery = await cowDispersalsQuery(req, prisma, {
    search: search,
    statuses: statuses,
    filterFamily: filterFamily,
    filterCountry: filterCountry,
    deletedAt: true,
    status: status
  });

  const relations = {
    include: {
      family: true,
      cows: true
    }
  }

  if(!paginate) {
    return await prisma.cowDispersal.findMany({
      where: searchQuery,
      ...relations
    })
  }


  return await prismaPaginator({
    model: {name: 'cowDispersal'},
    cursor: cursor,
    size: parseInt(limit.toString()),
    buttonNum: 5,
    orderBy: 'secondaryId',
    where: searchQuery,
    ...relations,
    orderDirection: 'desc',
    prisma: prisma
  });
}

const index = async (req: any, res: any) => {
  const { cursor, limit, search, sort, paginate, filterFamily, status, statuses } = req.query;

  const transformedStatuses = statuses?.split(",");

  const result = await getData({
    req: req, 
    cursor: cursor,
    limit: limit, 
    sort: sort,
    search: search,
    paginate: paginate,
    filterFamily: filterFamily,
    status: status,
    statuses: transformedStatuses?.length > 0 ? transformedStatuses : "",
  });

  if(result) {
    res.status(200).json({ data: result });
  } else {
    res.status(422).json({ data: result });
  }
}

const parseCowDispersalRecords = async (tx, familiesCoordinators, dataRequest, user, method) => {        
  let cowDispersals: any = [];
  const ObjectId = (m = Math, d = Date, h = 16, s = s => m.floor(s).toString(h)) =>
  s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h))

  await Promise.all(familiesCoordinators.map(async (family: any) => {
    const counter = await createOrUpdateCounter(tx, COW_DISPERSAL_ID);

    await tx.family.update({
      where: {
        id: family?.id
      },
      data: {
        noAnimalsAllocated: {
          increment: -family?.noOfCows
        }
      }
    });

    const data = {
      id: ObjectId(),
      secondaryId: `${counter?.name}${counter?.seq}`,
      status: 'Pending',
      date: dataRequest?.date,
      familyId: family?.id,
      noOfCows: parseInt(family?.noOfCows),
      deletedAt: null
    }

    cowDispersals.push(data)

    await createLogHelper(user, data, method , "cow_dispersals", tx)
  }));

  return cowDispersals;
}

const create = async (req: any, res: any, user: any) => {
  const dataRequest = req.body;

  let result: PrismaCustomResponse = null;

	await prisma.$connect();

  try {
    result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const familiesCoordinators = dataRequest?.familiesCoordinators;

      const cowDispersals = await parseCowDispersalRecords(tx, familiesCoordinators, dataRequest, user, req.method);

      await tx.cowDispersal.createMany({
        data: cowDispersals
      });

      const createdCowDispersals = await tx.cowDispersal.findMany({
        where: {
          secondaryId: {
            in: cowDispersals?.map((cowDispersal) => cowDispersal?.secondaryId)
          }
        },
        include: {
          family: true,
        }
      })


      const users = await tx.user.findMany({
        where: {
          role: {
            in: [COUNTRY_LEAD_ROLE, ASSISTANT_COUNTRY_LEAD_ROLE] 
          },
          countryIds: {
            hasSome: [dataRequest?.family?.townVillage?.district?.country?.id]
          }
        }
      });

      const reviewTemplate = review(createdCowDispersals);

      if(users?.length > 0) {
        const userEmails: string[] = [];
        users.forEach((user) => {
          userEmails.push(user.email);
        });

        sendMail(userEmails, 'Cow Dispersal Request', reviewTemplate);
      }


      return { data: 'Success', status: 200 };
    });
  } catch (e: any) {
    await prisma.$disconnect();
    result = { data: handlePrismaErrors(e), status: 400 };    
  } finally {
    res.status(result.status).json({ data: result.data });
  }
}