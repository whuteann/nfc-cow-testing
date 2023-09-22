import { CREATE_FAMILY_FARM_TRANSFER_REQUESTS } from "@/permissions/Permissions";
import { getToken } from "next-auth/jwt";
import { Prisma } from "@prisma/client";
import { prismaClient } from "@/utils/Prisma";
import { PrismaCustomResponse } from "@/types/Common";
import { handlePrismaErrors } from "prisma/prismaErrorHandling";
import { familyFarmTransferRequestsQuery } from "@/helpers/Query/familyFarmTransferRequests";
import prismaPaginator from "@/helpers/Paginator/PrismaPaginator";
import { createOrUpdateCounter } from "@/helpers/Counter";
import { FAMILY_FARM_TRANSFER_REQUEST_ID } from "@/types/Counter";
import { createLogHelper } from "@/helpers/LogHelper";
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
  filterCountry?: boolean
}

export default async function handler(req: any, res: any) {

  //API Middleware components
  const token = await getToken({ req, secret });
  const user: any = token?.user;
  const permissions: string[] = user?.permissions;

  switch (req.method) {
    case "GET":
      if(token){
        return index(req, res);
      }
      return res.status(422).json({ data: "FamilyFarmTransferRequest: Access Denied" });

    case "POST":
      if(permissions.includes(CREATE_FAMILY_FARM_TRANSFER_REQUESTS)){
        return create(req, res, user);
      }
      return res.status(422).json({ data: "FamilyFarmTransferRequest: Access Denied" });

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
  filterCountry = true
}: queryProps) => {
  await prisma.$connect();

  const searchQuery = await familyFarmTransferRequestsQuery(req, {
    search: search,
    status: status,
    deletedAt: true,
    filterCountry: filterCountry
  });

  const relations = {
    include: {
      family: true,
      farm: true
    }
  }

  if (!paginate) {
    return await prisma.familyFarmTransferRequest.findMany({
      where: searchQuery,
      ...relations
    })
  }

  return await prismaPaginator({
    model: { name: 'familyFarmTransferRequest' },
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
  const { cursor, limit, search, page, paginate, status, filterCountry } = req.query;

  const result = await getData({
    req: req,
    cursor: cursor,
    page: page,
    limit: limit,
    search: search,
    paginate: paginate,
    status: status,
    filterCountry: filterCountry
  });

  if(result) {
    res.status(200).json({ data: result });
  } else {
    res.status(422).json({ data: result });
  }
}

const create = async (req: any, res: any, user: any) => {
  const { data } = req.body;
  let result: PrismaCustomResponse = null;
  const method = req.method
  const session:any = await getSession({ req });

  // return res.status(400).json({ data: data });
  try {
    result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const counter = await createOrUpdateCounter(tx, FAMILY_FARM_TRANSFER_REQUEST_ID);

      const familyFarmTransferRequest = await tx.familyFarmTransferRequest.create({
        data: {
          status: "Pending",
          secondaryId: `${counter?.name}${counter?.seq}`,
          family: {
            connect:{
              id: data.family.id
            }
          }, 
          farm:{
            connect:{
              id: data.farm.id
            }
          }, 
          noOfCows: data.noOfCows,
          deletedAt: null,
          createdBy: {
            id: (session.currentUser as any)._id,
            firstName: (session.currentUser as any).firstName,
            lastName: (session.currentUser as any).lastName
          }
        }
      });

      await createLogHelper(user, familyFarmTransferRequest, method , "family_farm_transfer_requests", tx)

      return { data: familyFarmTransferRequest, status: 200 };
    });
  } catch (e: any) {
    await prisma.$disconnect();

    result = { data: handlePrismaErrors(e), status: 400 };    
  } finally {
    res.status(result.status).json({ data: result.data });
  }

}


