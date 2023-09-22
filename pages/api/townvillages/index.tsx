import { createOrUpdateCounter } from "@/helpers/Counter";
import { townVillagesQuery } from "@/helpers/Query/townVillages";
import { MANAGE_TOWN_VILLAGES } from "@/permissions/Permissions";
import { getToken } from "next-auth/jwt";
import { Prisma } from "@prisma/client";
import prismaPaginator from "@/helpers/Paginator/PrismaPaginator";
import { PrismaCustomResponse } from "@/types/Common";
import { TOWNVILLAGE_ID } from "@/types/Counter";
import { handlePrismaErrors } from "prisma/prismaErrorHandling";
import { prismaClient } from "@/utils/Prisma";
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
  countries?: string[] | '';
  filterCountry?: boolean
}

export default async function handler(req: any, res: any) {
  const token = await getToken({ req, secret });
  const user: any = token?.user;
  const permissions: string[] = user?.permissions;

  switch (req.method) {
    case "GET":
      if(token){
        return index(req, res);
      }
      return res.status(422).json({ data: "TownVillagesAPI: Access Denied" });

    case "POST":
      if(permissions.includes(MANAGE_TOWN_VILLAGES)){
        return post(req, res, user);
      }
      return res.status(422).json({ data: "TownVillagesAPI: Access Denied" });

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
  countries = '',
  filterCountry = true,
}: queryProps) => {
  await prisma.$connect();

  const searchQuery = await townVillagesQuery(req, {
    search: search,
    countries: countries,
    filterCountry: filterCountry,
    deletedAt: true
  });

  const relations = {
    include: {
      district: {
        include: {
          country: true
        }
      }
    }
  }

  if(!paginate) {
    return await prisma.townVillage.findMany({
      where: searchQuery,
      ...relations
    })
  }

  const datatest = await prisma['townVillage'].findMany();

  return await prismaPaginator({
    model: {name: 'townVillage'},
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
  const { cursor, limit, search, page, paginate, countries, filterCountry } = req.query;

  const transformedCountries = countries?.split(",");

  const result = await getData({
    req: req, 
    cursor: cursor,
    page: page, 
    limit: limit, 
    search: search,
    paginate: paginate,
    countries: transformedCountries?.length > 0 ? transformedCountries : "",
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
      const townVillageExist = await tx.townVillage.findFirst({
        where: {
          name: {
            equals: dataRequest?.name,
            mode: "insensitive"
          },
          townVillage: dataRequest?.townVillage,
          districtId: dataRequest?.district
        }
      });

      if(townVillageExist) return { data: 'Town/Village already exist for this district', status: 422 }

      const counter = await createOrUpdateCounter(tx, TOWNVILLAGE_ID);

      const townVillage = await tx.townVillage.create({
        data: {
          secondaryId: `${counter?.name}${counter?.seq}`, 
          name: dataRequest?.name,
          townVillage: dataRequest?.townVillage,
          district: {
            connect : {
              id: dataRequest?.district
            }
          },
          deletedAt: null
        }
      });

      await createLogHelper(user, townVillage, req.method, 'town_villages', tx);

      return { data: townVillage, status: 200 };
    });
  } catch (e: any) {
    await prisma.$disconnect();
    result = { data: handlePrismaErrors(e), status: 400 };    
  } finally {
    res.status(result.status).json({ data: result.data });
  }
}