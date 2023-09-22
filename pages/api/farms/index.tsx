import { createOrUpdateCounter } from "@/helpers/Counter";
import { farmsQuery } from "@/helpers/Query/farms";
import { MANAGE_FARMS } from "@/permissions/Permissions";
import { getToken } from "next-auth/jwt";
import { Prisma } from "@prisma/client";
import prismaPaginator from "@/helpers/Paginator/PrismaPaginator";
import { PrismaCustomResponse } from "@/types/Common";
import { FARM_ID } from "@/types/Counter";
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
  country?: string;
  countries?: string[] | '';
  filterCountry?: boolean,
  filterFarm?: boolean,
  filterDispersalFarm?: boolean
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
      return res.status(422).json({ data: "FarmsAPI: Access Denied" });

    case "POST":
      if(permissions.includes(MANAGE_FARMS)){
        return post(req, res, user);
      }
      return res.status(422).json({ data: "FarmsAPI: Access Denied" });

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
  filterFarm = true,
  filterDispersalFarm = true
}: queryProps) => {
  await prisma.$connect();
  
  let searchQuery = await farmsQuery(req, {
    search: search,
    countries: countries,
    filterCountry: filterCountry,
    filterFarm: filterFarm,
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

  if(filterDispersalFarm) {
    searchQuery = {
      AND: [
        searchQuery,
        {
          name: {
            not: {
              contains: 'Dispersal' 
            }
          }
        }
      ]
    }
  } else {
    searchQuery = {
      OR: [
        searchQuery,
        {
          name: {
            contains: 'Dispersal'
          }
        }
      ]
    }
  }

  if(!paginate) {
    return await prisma.farm.findMany({
      where: searchQuery,
      ...relations
    })
  }

  return await prismaPaginator({
    model: {name: 'farm'},
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
  const { cursor, limit, search, page, paginate, countries, filterCountry, filterFarm, filterDispersalFarm } = req.query;

  const transformedCountries = countries?.split(",");

  const result = await getData({
    req: req, 
    cursor: cursor,
    page: page, 
    limit: limit, 
    search: search,
    paginate: paginate,
    countries: transformedCountries?.length > 0 ? transformedCountries : "",
    filterCountry: filterCountry,
    filterFarm: filterFarm,
    filterDispersalFarm: filterDispersalFarm,
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
      const farmExist = await tx.farm.findFirst({
        where: {
          name: {
            equals: dataRequest?.name,
            mode: "insensitive"
          },
          districtId: dataRequest?.district
        }
      });

      if(farmExist) return { data: 'Farm already exist for this district', status: 422 }

      const counter = await createOrUpdateCounter(tx, FARM_ID);

      const farm = await tx.farm.create({
        data: {
          secondaryId: `${counter?.name}${counter?.seq}`, 
          name: dataRequest?.name,
          district: {
            connect : {
              id: dataRequest?.district
            }
          },
          deletedAt: null
        }
      });

      await tx.totalFarmCows.create({
        data:{
          farm: {
            connect: {
              id: farm.id
            }
          },
          totalAmountOfCows: 0,
          deletedAt: null
        }
      });

      await createLogHelper(user, farm, req.method, 'farms', tx);

      return { data: farm, status: 200 };
    });
  } catch (e: any) {
    await prisma.$disconnect();
    result = { data: handlePrismaErrors(e), status: 400 };    
  } finally {
    res.status(result.status).json({ data: result.data });
  }
}