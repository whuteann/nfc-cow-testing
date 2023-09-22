import { MANAGE_TOWN_VILLAGES } from "@/permissions/Permissions";
import { getToken } from "next-auth/jwt";
import { prismaClient } from "@/utils/Prisma";
import { PrismaCustomResponse } from "@/types/Common";
import { Prisma } from "@prisma/client";
import { handlePrismaErrors } from "prisma/prismaErrorHandling";
import { createLogHelper } from "@/helpers/LogHelper";

const secret = process.env.NEXTAUTH_SECRET
const prisma = prismaClient;

export default async function handler(req: any, res: any) {
  //API Middleware components
  const token = await getToken({ req, secret });
  const user: any = token?.user;
  const permissions: string[] = user?.permissions;

  if (!permissions.includes(MANAGE_TOWN_VILLAGES)) {
    return res.status(422).json({ data: "TownVillagesAPI: Access Denied" });
  }

  switch (req.method) {
    case 'GET':
      return index(req, res)

    case 'PUT':
      return edit(req, res, user)

    case 'DELETE':
      return del(req, res, user)

    default:
      res.status(405).send({ message: 'Invalid Method.' })
      return;
  }
}

export const getData = async (id: string) => {
  try {
    const townVillage = await prisma.townVillage.findFirst({
      where: {
        id: id
      },
      include: {
        district: {
          include: {
            country: true
          }
        }
      }
    });

    if (townVillage) {
      return townVillage;
    } else {
      return null;
    }
  } catch (e: any) {
    return null;
  }
}

const index = async (req: any, res: any) => {
  await prisma.$connect();

  const { id } = req.query;

  const townVillage = await getData(id);

  res.status(200).json({ data: townVillage });
}

const edit = async (req: any, res: any, user: any) => {
  const { id } = req.query;
  const dataRequest = req.body;

  await prisma.$connect();

  let result: PrismaCustomResponse = null;

  try {
    result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const townVillageExist = await tx.townVillage.findFirst({
        where: {
          id: {
            not: id
          },
          name: {
            equals: dataRequest?.name,
            mode: "insensitive"
          },
          townVillage: dataRequest?.townVillage,
          districtId: dataRequest?.district
        }
      });

      if (townVillageExist) return { data: 'Town/Village already exist for this country', status: 422 }

      const oldTownVillage = await tx.townVillage.findFirst({
        where: {
          id: id
        }
      })

      const townVillage = await tx.townVillage.update({
        where: {
          id: id
        },
        data: {
          name: dataRequest?.name,
          townVillage: dataRequest?.townVillage,
          district: {
            connect: {
              id: dataRequest?.district
            }
          }
        }
      });

      await createLogHelper(user, townVillage, req.method, 'town_villages', tx, oldTownVillage);

      return { data: townVillage, status: 200 };
    });
  } catch (e: any) {
    await prisma.$disconnect();
    result = { data: handlePrismaErrors(e), status: 400 };
  } finally {
    res.status(result.status).json({ data: result.data });
  }
}

const del = async (req: any, res: any, user: any) => {
  const { id } = req.query;

  await prisma.$connect();

  let result: PrismaCustomResponse = null;

  try {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const townVillage = await tx.townVillage.update({
        where: { id: id },
        data: {
          deletedAt: new Date(),
          deleted: true
        }
      });
  
      await createLogHelper(user, townVillage, req.method, 'town_villages', tx);
  
      result = { data: 'Success', status: 200 };
    })
  } catch (e: any) {
    await prisma.$disconnect();
    result = { data: handlePrismaErrors(e), status: 400 };
  } finally {
    res.status(result.status).json({ data: result.data });
  }
}  