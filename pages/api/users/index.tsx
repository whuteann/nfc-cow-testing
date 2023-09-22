import { getRolePermission, pluck, withCountryQuery } from "@/helpers/app";
import { createOrUpdateCounter } from "@/helpers/Counter";
import { connectToRealm } from "@/utils/Realm";
import bcryptjs from 'bcryptjs';
import { MANAGE_USERS } from "@/permissions/Permissions";
import { getToken } from "next-auth/jwt";
import { createLogHelper } from "@/helpers/LogHelper";
import { Prisma } from '@prisma/client';
import prismaPaginator from "@/helpers/Paginator/PrismaPaginator";
import { usersQuery } from "@/helpers/Query/users";
import { handlePrismaErrors } from "prisma/prismaErrorHandling";

import { prismaClient } from "@/utils/Prisma";
import { PrismaCustomResponse } from "@/types/Common";
import { USER_ID } from "@/types/Counter";

const secret = process.env.NEXTAUTH_SECRET;
const prisma = prismaClient;

interface queryProps {
  req: any,
  cursor?: string,
  role?: string,
  search?: string,
  sort?: string;
  page?: number;
  pageSize?: number;
  limit?: number;
  paginate?: boolean;
  filterCountry?: boolean;
  filterRole?: boolean;
  status?: Array<any>
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
      return res.status(422).json({ data: "UsersAPI: Access Denied" });

    case "POST":
      if (permissions.includes(MANAGE_USERS)) {
        return post(req, res, user);
      }
      return res.status(422).json({ data: "UsersAPI: Access Denied" });

    default:
      res.status(405).send({ message: 'Invalid Method.' })
      return;
  }
}

export const getData = async ({
  req,
  cursor = '',
  search = '',
  role = '',
  sort = '',
  limit = 10,
  paginate = false,
  filterCountry = true,
  filterRole = false,
  status = []
}: queryProps) => {
  await prisma.$connect();
  
  const searchQuery = await usersQuery(req, prisma, role, {
    search: search,
    role: role,
    filterCountry: filterCountry,
    filterRole: filterRole,
    deletedAt: true,
    status: status,
  });

  const relations = {
    include: {
      countries: true,
      farms: true
    }
  }

  if(!paginate) {
    return await prisma.user.findMany({
      where: searchQuery,
      ...relations
    })
  }

  return await prismaPaginator({
    model: {name: 'user'},
    cursor: cursor,
    size: parseInt(limit.toString()),
    buttonNum: 5,
    orderBy: 'secondaryId', // Order by created at
    where: searchQuery,
    ...relations,
    orderDirection: 'desc',
    prisma: prisma
  });
}

const index = async (req: any, res: any) => {
  const { cursor, limit, search, role, page, paginate, filterCountry, filterRole, status } = req.query;

  const result = await getData({
    req: req, 
    cursor: cursor,
    role: role,
    page: page, 
    limit: limit, 
    search: search,
    paginate: paginate,
    filterCountry: filterCountry,
    filterRole: filterRole == 'true',
    status: status
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

  await prisma.$connect();

  try {
    result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const userExist = await tx.user.findFirst({
        where: {
          email: {
            equals: dataRequest?.email,
          }
        }
      });

      if(userExist) return { data: 'User already exist for this email', status: 422 }

      const counter = await createOrUpdateCounter(tx, USER_ID);

      const permissions = [
        ...getRolePermission(dataRequest?.role),
        ...getRolePermission(dataRequest?.farm_role),
      ]

      const user_created = await tx.user.create({
        data: {
          secondaryId: `${counter?.name}${counter?.seq}`, 
          firstName: dataRequest?.firstName,
          lastName: dataRequest?.lastName,
          email: dataRequest?.email,
          password: bcryptjs.hashSync(dataRequest?.password, 10),
          role: dataRequest?.role,
          farmRole: dataRequest?.farm_role,
          teamLeadId: dataRequest?.team_lead,
          countryIds: dataRequest?.countryIds,
          farmIds: dataRequest?.farmIds,
          image: dataRequest?.image,
          status: dataRequest?.status,
          permissions: permissions,
          joinedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deletedAt: null
        }
      });

      try {
        const realm = await connectToRealm();

        await realm.emailPasswordAuth.registerUser({ 
          email: user_created?.email, 
          password: dataRequest?.password 
        });
      } catch {
        throw {
          data: "Something went wrong when registering with realm",
          status: 401,
        };
      }
      
      await createLogHelper(user, user_created, method, "users", tx)

      return { data: user_created, status: 200 };
    });
  } catch (e: any) {
    console.error('e', e)
    await prisma.$disconnect();
    result = { data: handlePrismaErrors(e), status: 400 };    
  } finally {
    res.status(result.status).json({ data: result.data });
  }
}