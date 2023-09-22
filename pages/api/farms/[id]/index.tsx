import { MANAGE_FARMS } from "@/permissions/Permissions";
import { getToken } from "next-auth/jwt";
import { prismaClient } from "@/utils/Prisma";
import { PrismaCustomResponse } from '@/types/Common';
import { Prisma } from '@prisma/client';
import { handlePrismaErrors } from 'prisma/prismaErrorHandling';
import { createLogHelper } from "@/helpers/LogHelper";

const secret = process.env.NEXTAUTH_SECRET
const prisma = prismaClient;

export default async function handler(req: any, res: any) {
  //API Middleware components
  const token = await getToken({ req, secret });
  const user: any = token?.user;
  const permissions: string[] = user?.permissions;

  if(!permissions.includes(MANAGE_FARMS)){
    return res.status(422).json({ data: "FarmAPI: Access Denied" });
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
		const farm = await prisma.farm.findFirst({
			where:{ 
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

		if(farm) {
			return farm;
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

  const farm = await getData(id);
  
	res.status(200).json({ data: farm });
}

const edit = async (req: any, res: any, user:any) => {
	const { id } = req.query;
  const dataRequest = req.body;

	await prisma.$connect();

  let result: PrismaCustomResponse = null;

  try {
    result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const farmExist = await tx.farm.findFirst({
        where: {
          id: {
            not: id
          },
          name: {
            equals: dataRequest?.name,
            mode: "insensitive"
          },
          districtId: dataRequest?.district
        }
      });

      if(farmExist) return { data: 'Farm already exist for this country', status: 422 }

      const oldFarm = await tx.farm.findFirst({
        where:{
          id: id
        }
      })

			const farm = await tx.farm.update({
				where: {
					id: id
				},
				data: {
          name: dataRequest?.name,
          district: {
            connect : {
              id: dataRequest?.district
            }
          }
				}
			});

      await createLogHelper(user, farm, req.method, 'farms', tx, oldFarm);

			return { data: farm, status: 200 };
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

      const delete_date = new Date();

      const farm = await tx.farm.update({
        where: { id: id },
        data: {
          deletedAt: delete_date,
          deleted: true,
        }
      });

      await tx.totalFarmCows.update({
        where: {farmId: id},
        data: {
          deletedAt: delete_date
        }
      })
  
      await createLogHelper(user, farm, req.method, 'farms', tx);
  
      result = { data: 'Success', status: 200 };
    })
	} catch (e: any) {
		await prisma.$disconnect();
		result = { data: handlePrismaErrors(e), status: 400 };    
	} finally {
		res.status(result.status).json({ data: result.data });
	}
}  