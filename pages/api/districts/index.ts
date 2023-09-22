import { createOrUpdateCounter } from "@/helpers/Counter";
import prismaPaginator from "@/helpers/Paginator/PrismaPaginator";
import { districtsQuery } from "@/helpers/Query/districts";
import { MANAGE_DISTRICTS } from "@/permissions/Permissions";
import { getToken } from "next-auth/jwt";
import { prismaClient } from "@/utils/Prisma";
import { PrismaCustomResponse } from "@/types/Common";
import { DISTRICT_ID } from "@/types/Counter";
import { Prisma } from "@prisma/client";
import { handlePrismaErrors } from "prisma/prismaErrorHandling";
import { createLogHelper } from "@/helpers/LogHelper";

const secret = process.env.NEXTAUTH_SECRET
const prisma = prismaClient;

interface queryProps {
  req: any,
  cursor?: string,
  search?: string,
  sort?: string;
  page?: number;
  pageSize?: number;
  limit?: number;
  paginate?: boolean;
  country?: string;
  filterCountry?: boolean;
  filterDispersal?: boolean;
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
      return res.status(422).json({ data: "DistrictsAPI: Access Denied" });

    case "POST":
      if(permissions.includes(MANAGE_DISTRICTS)){
        return post(req, res, user);
      }
      return res.status(422).json({ data: "DistrictsAPI: Access Denied" });

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
  limit = 10,
  paginate = false,
  country = '',
  filterCountry = true,
  filterDispersal = true
}: queryProps) => {
  await prisma.$connect();
  
  const searchQuery = await districtsQuery(req, {
    search: search,
    country: country,
    filterCountry: filterCountry,
    filterDispersal: filterDispersal,
    deletedAt: true
  });

  const relations = {
    include: {
      country: true
    }
  }

  if(!paginate) {
    return await prisma.district.findMany({
      where: searchQuery,
      ...relations
    })
  }

  return await prismaPaginator({
    model: {name: 'district'},
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
  const { cursor, limit, search, page, paginate, country, filterCountry, filterDispersal } = req.query;
 
  const result = await getData({
    req: req, 
    cursor: cursor,
    page: page, 
    limit: limit, 
    search: search,
    paginate: paginate,
    country: country,
    filterCountry: filterCountry,
    filterDispersal: filterDispersal
  });

  if(result) {
    res.status(200).json({ data: result });
  } else {
    res.status(422).json({ data: result });
  }
}

const post = async (req: any, res: any, user: any) => {
  const dataRequest = req?.body;
  let result: PrismaCustomResponse = null;
  
	await prisma.$connect();

  try {
    result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const districtExist = await tx.district.findFirst({
        where: {
          name: {
            equals: dataRequest?.name,
            mode: "insensitive"
          },
          countryId: dataRequest?.country
        }
      });

      if(districtExist) return { data: 'District already exist for this country', status: 422 }

      const counter = await createOrUpdateCounter(tx, DISTRICT_ID);

      const district = await tx.district.create({
        data: {
          secondaryId: `${counter?.name}${counter?.seq}`, 
          name: dataRequest?.name,
          country: {
            connect : {
              id: dataRequest?.country
            }
          },
          deletedAt: null
        }
      });

      await createLogHelper(user, district, req.method, 'districts', tx);

      return { data: district, status: 200 };
    });
  } catch (e: any) {
    await prisma.$disconnect();
    result = { data: handlePrismaErrors(e), status: 400 };    
  } finally {
    res.status(result.status).json({ data: result.data });
  }
}