import { CREATE_FAMILIES_COORDINATORS, VIEW_FAMILIES_COORDINATORS } from "@/permissions/Permissions";
import { connectToDatabase } from "@/utils/MongoDB";
import { getToken } from "next-auth/jwt";
import { prismaClient } from "@/utils/Prisma";
import { PrismaCustomResponse } from "@/types/Common";
import { Prisma } from "@prisma/client";
import { handlePrismaErrors } from "prisma/prismaErrorHandling";

const secret = process.env.NEXTAUTH_SECRET
const prisma = prismaClient;

export default async function handler(req:any, res:any) {
  await connectToDatabase();

  //API Middleware components
  const token = await getToken({ req, secret });
  const user: any = token?.user;
  const permissions: string[] = user?.permissions;

  // switch the methods
  switch (req.method) {
    case 'GET':
      if(permissions.includes(VIEW_FAMILIES_COORDINATORS)){
        return index(req, res);
      }
      return res.status(422).json({ data: "Family/Coordinator: Access Denied" });

    case 'PUT': 
      if(permissions.includes(CREATE_FAMILIES_COORDINATORS)){
        return edit(req, res);
      }
      return res.status(422).json({ data: "FarmCowSalesAPI: Access Denied" });

    // case 'DELETE':
    //   if(permissions.includes(CREATE_FAMILIES_COORDINATORS)){
    //     return deleteOne(req, res, user);
    //   }
    //   return res.status(422).json({ data: "FarmCowSalesAPI: Access Denied" });
    
    default:
      res.status(405).send({ message: 'Invalid Method.' })
      return;
  }
}


export const getData = async (id: string) => {
	try {
		const family = await prisma.family.findFirst({
			where:{
				id: id
			},
      include: {
        townVillage: {
          include: {
            district: {
              include: {
                country: true
              }
            }
          }
        },
        overseeTownsVillages: {
          include: {
            district: {
              include: {
                country: true
              }
            }
          }
        },
        supervisor: true,
        coordinator: true,
        families: true
      }
		});

		if(family) {
			return family;
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

	const family = await getData(id);

	res.status(200).json({ data: family });
}

const edit = async (req: any, res: any) => {
	const { id } = req.query;
  const dataRequest = req.body;

	await prisma.$connect();

  let result: PrismaCustomResponse = null;

  try {
    result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const familyExist = await tx.family.findFirst({
        where: {
          id: {
            not: id
          },
          nfcID: {
            equals: dataRequest?.nfcID,
            mode: "insensitive"
          }
        }
      });

      if(familyExist) return { data: 'NFC ID already exist.', status: 422 }

      // const transformedTownVillages = dataRequest?.overseeTownsVillages?.split(",");
     
      // const supervisor = dataRequest?.supervisor
      //   ?
      //     {
      //       supervisor: {
      //         connect: {
      //           id: dataRequest?.supervisor
      //         }
      //       }
      //     }
      //   :
      //     {};

      // const coordinator = dataRequest?.coordinator
      //   ?
      //     {
      //       coordinator: {
      //         connect: {
      //           id: dataRequest?.coordinator
      //         }
      //       }
      //     }
      //   :
      //     {};

			const family = await tx.family.update({
				where: {
					id: id
				},
        data: {
          nfcID: dataRequest?.nfcID,
          updatedAt: new Date().toISOString(),
          deletedAt: null
        }
			});

			return { data: family, status: 200 };
		});
	} catch (e: any) {
    await prisma.$disconnect();
    result = { data: handlePrismaErrors(e), status: 400 };    
  } finally {
    res.status(result.status).json({ data: result.data });
  }
}