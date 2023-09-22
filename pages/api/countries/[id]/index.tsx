import { MANAGE_COUNTRIES } from "@/permissions/Permissions";
import { getToken } from "next-auth/jwt";
import { Prisma } from '@prisma/client';
import { PrismaCustomResponse } from '@/types/Common';
import { handlePrismaErrors } from 'prisma/prismaErrorHandling';
import { prismaClient } from "@/utils/Prisma";
import { createLogHelper } from "@/helpers/LogHelper";

const secret = process.env.NEXTAUTH_SECRET
const prisma = prismaClient;

export default async function handler(req: any, res: any) {
  //API Middleware components
  const token = await getToken({ req, secret });
  const user: any = token?.user;
  const permissions: string[] = user?.permissions;
  
  if(!permissions.includes(MANAGE_COUNTRIES)){
    return res.status(422).json({ data: "CountryAPI: Access Denied" });
  }

  // switch the methods
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
  await prisma.$connect();

	try {
		const country = await prisma.country.findFirst({
			where:{
				id: id
			},
		});

		if(country) {
			return country;
		} else {
			return null;
		}
	} catch (e: any) {
		return null;
	}
}
  
const index = async (req: any, res: any) => {
	const { id } = req.query;

	const country = await getData(id);

	res.status(200).json({ data: country });
}

const edit = async (req: any, res: any, user: any) => {
	const { id } = req.query;
  const dataRequest = req.body;

	await prisma.$connect();

  let result: PrismaCustomResponse = null;

  try {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
		
      const oldCountry = await tx.country.findFirst({
        where:{
          id: id
        }
      })

			const country = await tx.country.update({
				where:{
					id: id
				},
				data: {
					name: dataRequest?.name,
				}
			});

      await createLogHelper(user, country, req.method, 'countries', tx, oldCountry);

			result =  { data: country, status: 200 };
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
      const country = await tx.country.update({
        where: { id: id },
        data: {
          deletedAt: new Date()
        }
      });
  
      await createLogHelper(user, country, req.method, 'countries', tx);
  
      result = { data: 'Success', status: 200 };
    })
	} catch (e: any) {
    await prisma.$disconnect();
    result = { data: handlePrismaErrors(e), status: 400 };      
  } finally {
    res.status(result.status).json({ data: result.data });
  }
}  