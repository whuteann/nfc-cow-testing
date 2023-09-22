import { createOrUpdateCounter } from "@/helpers/Counter";
import { MANAGE_COUNTRIES } from "@/permissions/Permissions";
import { getToken } from "next-auth/jwt"
import { prismaClient } from "@/utils/Prisma";
import prismaPaginator from "@/helpers/Paginator/PrismaPaginator";
import { countriesQuery } from "@/helpers/Query/countries";
import { PrismaCustomResponse } from "@/types/Common";
import { handlePrismaErrors } from "prisma/prismaErrorHandling";
import { COUNTRY_ID } from "@/types/Counter";
import { Prisma } from "@prisma/client";
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
      return res.status(422).json({ data: "CountryAPI: Access Denied" });

    case "POST":
      if(permissions.includes(MANAGE_COUNTRIES)){
        return post(req, res, user);
      }
      return res.status(422).json({ data: "CountryAPI: Access Denied" });

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
  filterCountry = true
}: queryProps) => {
  await prisma.$connect();

  const searchQuery = await countriesQuery(req, {
    search: search,
    filterCountry: filterCountry,
    deletedAt: true
  });

  if(!paginate) {
    return await prisma.country.findMany({
      where: searchQuery
    })
  }

  return await prismaPaginator({
    model: {name: 'country'},
    cursor: cursor,
    size: parseInt(limit.toString()),
    buttonNum: 5,
    orderBy: 'secondaryId',
    where: searchQuery,
    orderDirection: 'desc',
    prisma: prisma
  });
}

const index = async (req: any, res: any) => {
  const { cursor, limit, search, page, paginate, filterCountry } = req.query;

  const result = await getData({
    req: req, 
    cursor: cursor,
    page: page, 
    limit: limit, 
    search: search,
    paginate: paginate,
    filterCountry: filterCountry
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
      const countryExist = await prisma.country.findFirst({
        where:{
          name: dataRequest?.name
        },
      });

      if(countryExist) {
        return { data: 'Country already exist', status: 422 };
      }

      const counter = await createOrUpdateCounter(tx, COUNTRY_ID);

      const country = await tx.country.create({
        data: {
          secondaryId: `${counter?.name}${counter?.seq}`, 
          name: dataRequest?.name,
          deletedAt: null
        }
      });
      await createLogHelper(user, country, req.method, 'countries', tx);

      return { data: country, status: 200 };
    });
  } catch (e: any) {
    await prisma.$disconnect();
    result = { data: handlePrismaErrors(e), status: 400 };    
  } finally {
    res.status(result.status).json({ data: result.data });
  }
}