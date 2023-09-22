import { review } from "@/emails/cowFarmSaleRequests/review";
import { CREATE_FARM_COW_SALES } from "@/permissions/Permissions";
import { FARM_LEAD_ROLE, PrismaCustomResponse } from "@/types/Common";
import { sendMail } from "@/utils/Nodemailer";
import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";
import { Prisma } from "@prisma/client";
import { cowFarmSaleRequestsQuery } from "@/helpers/Query/cowFarmSaleRequests";
import prismaPaginator from "@/helpers/Paginator/PrismaPaginator";
import { handlePrismaErrors } from "prisma/prismaErrorHandling";
import { createOrUpdateCounter } from "@/helpers/Counter";
import { COW_FARMSALESREQUEST_ID } from "@/types/Counter";
import { createLogHelper } from "@/helpers/LogHelper";
import { prismaClient } from "@/utils/Prisma";

const secret = process.env.NEXTAUTH_SECRET
const prisma = prismaClient;

interface queryProps {
  req: any,
  cursor?: string,
  search?: string,
  sort?: string;
  status?: string;
  pageSize?: number;
  limit?: number;
  paginate?: boolean;
  filterFarm?: boolean;
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
      return res.status(422).json({ data: "FarmCowSalesAPI: Access Denied" });

    case "POST":
      if (permissions.includes(CREATE_FARM_COW_SALES)) {
        return post(req, res, user);
      }
      return res.status(422).json({ data: "FarmCowSalesAPI: Access Denied" });

    default:
      res.status(405).send({ message: 'Invalid Method.' })
      return;
  }
}

export const getData = async ({
  req,
  cursor = '',
  search = '',
  sort = '',
  status = '',
  limit = 10,
  paginate = false,
  filterFarm = true
}: queryProps) => {
  await prisma.$connect();

  const searchQuery = await cowFarmSaleRequestsQuery(req, {
    search: search,
    status: status,
    filterFarm: filterFarm,
    deletedAt: true
  });

  const relations = {
    include: {
      cows: true,
      farm: true
    }
  }

  if(!paginate) {
    return await prisma.cowFarmSaleRequest.findMany({
      where: searchQuery,
      ...relations
    })
  }
  
  return await prismaPaginator({
    model: {name: 'cowFarmSaleRequest'},
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
  const { limit, status, search, cursor, paginate, filterFarm } = req.query;

  const result = await getData({
    req: req, 
    cursor: cursor,
    status: status,
    limit: limit, 
    search: search,
    paginate: paginate,
    filterFarm: filterFarm
  });

  if (result) {
    res.status(200).json({ data: result });
  } else {
    res.status(422).json({ data: result });
  }

}

const post = async (req: any, res: any, user: any) => {
  const dataRequest = req?.body;
  const session:any = await getSession({ req });

  let result: PrismaCustomResponse = null;

  await prisma.$connect();

  try {
    result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {

      //get cow      
      const cows = await prisma.cow.findMany({
        where: {
          id: {
            in: dataRequest?.cows
          }
        }
      })

      const counter = await createOrUpdateCounter(tx, COW_FARMSALESREQUEST_ID);
      const cowIds = dataRequest?.cows.map(cow => { 
        return {
          id: cow 
        }
      }) || [];
      
      const cowFarmSaleRequests = await tx.cowFarmSaleRequest.create({
        data: {
          secondaryId: `${counter?.name}${counter?.seq}`,
          farm: {
            connect : {
              id: dataRequest?.farm
            }
          },
          status: dataRequest?.status,
          quantity: dataRequest?.quantity,
          cows: {
            connect: cowIds,
          },
          cowsSnapshot: cows,
          deletedAt: null,
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
          role: FARM_LEAD_ROLE,
          farms: {
            some: {
              id : {
                in: dataRequest?.farm
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

        sendMail(userEmails, 'Cow Farm Sale Purchase Request', reviewTemplate);
      }

      await createLogHelper(user, cowFarmSaleRequests, req.method, "cow_farm_sale", tx)
        
      return { data: cowFarmSaleRequests, status: 200 };
    });
  } catch (e: any) {
    await prisma.$disconnect();
    result = { data: handlePrismaErrors(e), status: 400 };    
  } finally {
    res.status(result.status).json({ data: result.data });
  }

}