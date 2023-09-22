import { createOrUpdateCounter } from "@/helpers/Counter";
import { createLogHelper } from "@/helpers/LogHelper";
import { CREATE_FARM_BREEDING_RECORDS, VIEW_FARM_BREEDING_RECORDS } from "@/permissions/Permissions";
import { getToken } from "next-auth/jwt";
import { Prisma } from '@prisma/client';
import prismaPaginator from "@/helpers/Paginator/PrismaPaginator";
import { PrismaCustomResponse } from "@/types/Common";
import { BIRTHRECORD_ID } from "@/types/Counter";
import { handlePrismaErrors } from "prisma/prismaErrorHandling";
import { birthRecordQuery } from "@/helpers/Query/birthRecords";
import { prismaClient } from "@/utils/Prisma";

const secret = process.env.NEXTAUTH_SECRET;
const prisma = prismaClient;

interface queryProps {
  req: any,
  status?: string,
  cursor?: string,
  role?: string,
  search?: string,
  sort?: string;
  page?: number;
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
      if(!permissions.includes(VIEW_FARM_BREEDING_RECORDS)){
        return res.status(422).json({ data: "BreedingRecords: Access Denied" });
      }
      return index(req,res);

    case "POST":
      if(!permissions.includes(CREATE_FARM_BREEDING_RECORDS)){
        return res.status(422).json({ data: "BreedingRecords: Access Denied" });
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
  role = '',
  sort = '',
  limit = 10,
  paginate = false,
  filterFarm = true
}: queryProps) => {
  await prisma.$connect();

  const searchQuery = await birthRecordQuery(req, {
    status: status,
    search: search,
    role: role,
    filterFarm: filterFarm,
    deletedAt: true
  });

  const relations = {
    include: {
      cow: true,
      farm: true
    }
  }

  if(!paginate) {
    return await prisma.birthRecord.findMany({
      where: searchQuery,
      ...relations
    })
  }

  return await prismaPaginator({
    model: {name: 'birthRecord'},
    cursor: cursor,
    size: parseInt(limit.toString()),
    buttonNum: 5,
    orderBy: 'createdAt', // Order by created at
    where: searchQuery,
    ...relations,
    orderDirection: 'desc',
    prisma: prisma
  });
}

const index = async (req: any, res: any) => {
  const { status, cursor, limit, search, role, page, paginate, filterFarm } = req.query;

  const result = await getData({
    req: req, 
    status: status,
    cursor: cursor,
    role: role,
    page: page, 
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
  const method = req.method;
  let result: PrismaCustomResponse = null;
  dataRequest.createdBy = user

  await prisma.$connect();

  try {
    result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // const recordExist = await tx.birthRecord.findFirst({
      //   where: {
      //     email: {
      //       equals: dataRequest?.email,
      //     }
      //   }
      // });

      // if(recordExist) return { data: 'Record already exist for this email', status: 422 }

      //bug
      const counter = await createOrUpdateCounter(tx, BIRTHRECORD_ID);

      const birthRecord = await tx.birthRecord.create({
        data: {
          secondaryId: `${counter?.name}${counter?.seq}`, 
          option: dataRequest?.option,
          farmId: dataRequest?.farmId,
          status: dataRequest?.status,
          dateOfBirth: dataRequest?.dateOfBirth,
          aliveCalves: dataRequest?.aliveCalves,
          deadCalves : dataRequest?.deadCalves,
          comment : dataRequest?.comment,
          cowId : dataRequest?.cowId,
          // createdBy: dataRequest?.createdBy,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deletedAt: null
        }
      });
      
      await createLogHelper(user, birthRecord, method, "birth_records", tx)

      return { data: birthRecord, status: 200 };
    });
  } catch (e: any) {

    await prisma.$disconnect();
    result = { data: handlePrismaErrors(e), status: 400 };    
  } finally {
    // //Update secondary ID
    // await updateSecondaryID("birthRecordID", "BR_", birthRecord.id, Breeding_Record)

    res.status(result.status).json({ data: result.data });
  }
}


