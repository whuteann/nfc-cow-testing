import { getToken } from "next-auth/jwt";
import { createOrUpdateCounter } from "@/helpers/Counter";
import { VIEW_COW_DEATHS } from "@/permissions/Permissions";
import { Prisma } from "@prisma/client";
import { handlePrismaErrors } from "prisma/prismaErrorHandling";
import prismaPaginator from "@/helpers/Paginator/PrismaPaginator";
import { PrismaCustomResponse } from "@/types/Common";
import { DEATHRECORD_ID } from "@/types/Counter";
import { deathRecordsQuery } from "@/helpers/Query/deathRecords";
import { createLogHelper } from "@/helpers/LogHelper";
import { prismaClient } from "@/utils/Prisma";
import { getSession } from "next-auth/react";

const secret = process.env.NEXTAUTH_SECRET
const prisma = prismaClient;

interface queryProps {
  req: any,
  hasNfcID?: boolean,
  cursor?: string,
  search?: string,
  sort?: string;
  pageSize?: number;
  limit?: number;
  paginate?: boolean;
  type?: string;
  townvillage?: string;
  status?: string;
  coordinator?: string;
  supervisor?: string;
  teamlead?: string;
  isNfcIdNecessary?: string;
  nfcID?: string;

  filterFarm?: boolean;
  filterFamily?: boolean;
  filterCountry?: boolean;
}

export default async function handler(req: any, res: any) {
  const token = await getToken({ req, secret });
  const user: any = token?.user;
  const permissions: string[] = user?.permissions;

  switch (req.method) {
    case "GET":
      if(!permissions.includes(VIEW_COW_DEATHS)){
        return res.status(422).json({ data: "CowDeaths: Access Denied" });
      }
      return index(req,res);

    case "POST":
      if(!permissions.includes(VIEW_COW_DEATHS)){
        return res.status(422).json({ data: "CowDeaths: Access Denied" });
      }
      return post(req,res,user);

    default:
      res.status(405).send({ message: 'Invalid Method.' })
      return;
  }
}

export const getData = async ({
  req,
  status = '',
  cursor = '',
  search = '',
  sort = '',
  limit = 10,
  paginate = false,
  filterFarm = false,
  filterFamily = false,
  filterCountry = true,
}: queryProps) => {
  await prisma.$connect();

  //change query
  const searchQuery = await deathRecordsQuery(req, {
    status: status,
    search: search,
    filterFarm: filterFarm,
    filterFamily: filterFamily,
    filterCountry: filterCountry,
    deletedAt: true
  }, "AND", prisma);

  const relations = {
    include: {
      family: {
        include: {
          townVillage: {
            include: {
              district: {
                include: {
                  country: true
                }
              }
            }
          }
        }
      },
      farm: {
        include: {
          district: {
            include: {
              country: true
            }
          }
        }
      },
      cow: true,
    },
  }

  if(!paginate) {
    return await prisma.deathRecord.findMany({
      where: searchQuery,
      ...relations
    })
  }

  return await prismaPaginator({
    model: {name: 'deathRecord'},
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

const index = async (req:any, res:any) =>{
  const { cursor, limit, search, sort, paginate, status, filterFarm, filterFamily } = req.query;

  const result = await getData({
    req: req, 
    cursor: cursor,
    limit: limit, 
    sort: sort,
    search: search,
    paginate: paginate,
    filterFarm: filterFarm,
    filterFamily: filterFamily,
    status: status,
  });

  if(result) {
    res.status(200).json({ data: result });
  } else {
    res.status(422).json({ data: result });
  }
}

const post = async (req:any, res:any, user: any) =>{
  const dataRequest = req?.body;
  let result: PrismaCustomResponse = null;
  const session: any = await getSession({ req });

  await prisma.$connect();

  try {
    result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const counter = await createOrUpdateCounter(tx, DEATHRECORD_ID);

      const family = dataRequest?.family
        ?
          {
            family: {
              connect: {
                id: dataRequest?.family
              }
            }
          }
        :
          {};

      const farm = dataRequest?.farm
      ?
        {
          farm: {
            connect: {
              id: dataRequest?.farm
            }
          }
        }
      :
        {};

      const cow = 
          {
            cow: {
              connect: {
                id: dataRequest?.cow
              },
            }
          }

      const deathRecord = await tx.deathRecord.create({
        data: {
          secondaryId: `${counter?.name}${counter?.seq}`,
          type: dataRequest?.type,
          option: dataRequest?.option,
          ...family,
          ...farm,
          ...cow,
          deathCause: dataRequest?.deathCause,
          dateOfDeath: dataRequest?.dateOfDeath,
          cowPic: dataRequest?.cowPic,
          report: dataRequest?.report,
          reportFilename: dataRequest?.reportFilename,
          status: dataRequest?.status,
          rejectedReason: dataRequest?.rejectedReason,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          createdBy: {
            id: (session.currentUser as any)._id,
            firstName: (session.currentUser as any).firstName,
            lastName: (session.currentUser as any).lastName
          }
        }
      });

      await createLogHelper(user, deathRecord, req.method, 'cow_deaths', tx);

      return { data: deathRecord, status: 200 };
    });
  } catch (e: any) {

    await prisma.$disconnect();
    result = { data: handlePrismaErrors(e), status: 400 };    
  } finally {
    res.status(result.status).json({ data: result.data });
  }

  // var filteredData = JSON.parse(JSON.stringify(data, function (key, value) {return (value === "") ? undefined : value}));

  // await Cow_Death.create(filteredData)
  // .then(async (cow_death) => {
  //   await createLogHelper(user, filteredData, method , "cow_deaths")
  //   //Update secondary ID
  //   await updateSecondaryID("cowDeathID", "CDTH_", cow_death._id, Cow_Death)
  //   res.status(200).json({ data: cow_death });
  // })
  // .catch((error) => {

  //   res.status(422).json({ data: "Wrong Data" });
  // }); 
}