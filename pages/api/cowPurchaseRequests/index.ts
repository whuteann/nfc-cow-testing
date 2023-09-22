import { createOrUpdateCounter } from "@/helpers/Counter";
import { CREATE_COW_PURCHASE_REQUESTS } from "@/permissions/Permissions";
import { OFFICE_ADMIN_ROLE, PrismaCustomResponse } from "@/types/Common";
import { getToken } from "next-auth/jwt";
import { Prisma } from "@prisma/client";
import prismaPaginator from "@/helpers/Paginator/PrismaPaginator";
import { cowPurchaseRequestsQuery } from "@/helpers/Query/cowPurchaseRequests";
import { prismaClient } from "@/utils/Prisma";
import { COW_PURCHASE_REQUEST_ID } from "@/types/Counter";
import { handlePrismaErrors } from "prisma/prismaErrorHandling";
import { createLogHelper } from "@/helpers/LogHelper";
import { review } from "@/emails/cowPurchaseRequests/review";
import { sendMail } from "@/utils/Nodemailer";
import { getSession } from "next-auth/react";

const secret = process.env.NEXTAUTH_SECRET
const prisma = prismaClient;

interface queryProps {
  req: any,
  cursor?: string,
  search?: string,
  sort?: string;
  page?: number;
  status?: string;
  pageSize?: number;
  limit?: number;
  paginate?: boolean;
  filterFarm?: boolean;
  filterDispersalFarm?: boolean;
}


export default async function handler(req: any, res: any) {
  //API Middleware components
  const token = await getToken({ req, secret });
  const user: any = token?.user;
  const permissions: string[] = user?.permissions;

  switch (req.method) {
    case "GET":
      if (token) {
        return index(req, res);
      }
      return res.status(422).json({ data: "CowPurchaseRequest: Access Denied" });

    case "POST":
      if (permissions.includes(CREATE_COW_PURCHASE_REQUESTS)) {
        return post(req, res, user);
      }
      return res.status(422).json({ data: "CowPurchaseRequest: Access Denied" });

    default:
      res.status(405).send({ message: 'Invalid Method.' })
      return;
  }
}

export const getData = async ({
  req,
  cursor = '',
  limit = 10,
  search = '',
  paginate = false,
  status = '',
  filterFarm = true,
  filterDispersalFarm = true,
}: queryProps) => {
  await prisma.$connect();

  let searchQuery = await cowPurchaseRequestsQuery(req, {
    search: search,
    status: status,
    filterFarm: filterFarm,
    includeDispersalCows: filterDispersalFarm,
    deletedAt: true
  });

  const relations = {
    include: {
      farm: true
    }
  }

  if (!paginate) {
    return await prisma.cowPurchaseRequest.findMany({
      where: searchQuery,
      ...relations
    })
  }

  return await prismaPaginator({
    model: { name: 'cowPurchaseRequest' },
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
  const { cursor, limit, search, page, paginate, status, filterFarm, filterDispersalFarm } = req.query;
  
  const result = await getData({
    req: req,
    cursor: cursor,
    page: page,
    limit: limit,
    search: search,
    paginate: paginate,
    status: status,
    filterFarm: filterFarm,
    filterDispersalFarm: filterDispersalFarm
  });


  if (result) {
    res.status(200).json({ data: result });
  } else {
    res.status(422).json({ data: result });
  }
}

const post = async (req: any, res: any, user: any) => {
  const dataRequest = req?.body;
  let result: PrismaCustomResponse = null;
  const session:any = await getSession({ req });

  // res.status(400).json({ data: dataRequest });
  await prisma.$connect();

  try {
    result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const counter = await createOrUpdateCounter(tx, COW_PURCHASE_REQUEST_ID);

      const cowPurchaseRequest = await tx.cowPurchaseRequest.create({
        data: {
          ...dataRequest.data,
          secondaryId: `${counter?.name}${counter?.seq}`,
          deletedAt: null,
          farm: {
            connect: {
              id: dataRequest?.data?.farm
            }
          },
          createdBy: {
            id: (session.currentUser as any)._id,
            firstName: (session.currentUser as any).firstName,
            lastName: (session.currentUser as any).lastName
          }
        }
      });

      //mail      
      const users = await prisma.user.findMany({
        where: {
          role: OFFICE_ADMIN_ROLE,
          farms: {
            some: {
              id : {
                in: dataRequest?.data?.farm
              }
            }
          } 
        }
      })

      const reviewTemplate = review(dataRequest);

      if (users?.length > 0) {
        const userEmails: string[] = [];
        users.forEach((user) => {
          userEmails.push(user.email);
        });

        sendMail(userEmails, 'Cow Purchase Request', reviewTemplate);
      }

      await createLogHelper(user, cowPurchaseRequest, req.method, "cow_purchase_requests", tx);

      return { data: cowPurchaseRequest, status: 200 };
    });
  } catch (e: any) {
    await prisma.$disconnect();

    result = { data: handlePrismaErrors(e), status: 400 };    
  } finally {
    res.status(result.status).json({ data: result.data });
  }
}