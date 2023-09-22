import { MANAGE_DISTRICTS } from "@/permissions/Permissions";
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

  if (!permissions.includes(MANAGE_DISTRICTS)) {
    return res.status(422).json({ data: "CountryAPI: Access Denied" });
  }

  switch (req.method) {
    case "GET":
      return index(req, res);

    case "PUT":
      return edit(req, res, user);

    case "DELETE":
      return del(req, res, user);

    default:
      res.status(405).send({ message: 'Invalid Method.' })
      return;
  }
}

export const getData = async (id: string) => {
  try {
    const district = await prisma.district.findFirst({
      where: {
        id: id
      },
      include: {
        country: true
      }
    });

    if (district) {
      return district;
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

  const district = await getData(id);

  res.status(200).json({ data: district });
}

const edit = async (req: any, res: any, user: any) => {
  const { id } = req.query;
  const dataRequest = req.body;

  await prisma.$connect();

  let result: PrismaCustomResponse = null;

  try {
    result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const districtExist = await tx.district.findFirst({
        where: {
          id: {
            not: id
          },
          name: {
            equals: dataRequest?.name,
            mode: "insensitive"
          },
          countryId: dataRequest?.country
        }
      });

      if (districtExist) return { data: 'District already exist for this country', status: 422 }

      const oldDistrict = await tx.district.findFirst({
        where: {
          id: id
        }
      })

      const district = await tx.district.update({
        where: {
          id: id
        },
        data: {
          name: dataRequest?.name,
          country: {
            connect: {
              id: dataRequest?.country
            }
          }
        }
      });

      await createLogHelper(user, district, req.method, 'districts', tx, oldDistrict);

      return { data: district, status: 200 };
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
      const district = await tx.district.update({
        where: { id: id },
        data: {
          deletedAt: new Date()
        }
      });

      await createLogHelper(user, district, req.method, 'districts', tx);

      result = { data: 'Success', status: 200 };
    })
  } catch (e: any) {
    await prisma.$disconnect();
    result = { data: handlePrismaErrors(e), status: 400 };
  } finally {
    res.status(result.status).json({ data: result.data });
  }
}  