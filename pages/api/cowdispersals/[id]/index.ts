import { reject } from "@/emails/cowDispersalRequests/reject";
import { approve } from "@/emails/cowDispersalRequests/approve";
import Cow_Dispersal from "@/models/Cow_Dispersal";
import { CREATE_FAMILY_COW_DISPERSALS, REVIEW_FAMILY_COW_DISPERSALS, VIEW_FAMILY_COW_DISPERSALS } from "@/permissions/Permissions";
import { ASSISTANT_COUNTRY_LEAD_ROLE, COUNTRY_LEAD_ROLE, PrismaCustomResponse } from "@/types/Common";
import { sendMail } from "@/utils/Nodemailer";
import { getToken } from "next-auth/jwt";
import { prismaClient } from "@/utils/Prisma";
import { Prisma } from "@prisma/client";
import { handlePrismaErrors } from "prisma/prismaErrorHandling";
import console from "console";
import { createLogHelper } from "@/helpers/LogHelper";

const secret = process.env.NEXTAUTH_SECRET
const prisma = prismaClient;

export default async function handler(req:any, res:any) {
  //API Middleware components
  const token = await getToken({ req, secret });
  const user: any = token?.user;
  const permissions: string[] = user?.permissions;

  // switch the methods
  switch (req.method) {
    case 'GET':
      if(permissions.includes(VIEW_FAMILY_COW_DISPERSALS)){
        return index(req, res);
      }
      return res.status(422).json({ data: "FamilyCowDispersalAPI: Access Denied" });

    case 'PUT': 
      if(permissions.includes(REVIEW_FAMILY_COW_DISPERSALS)){
        return updateStatus(req, res, user);
      }
      return res.status(422).json({ data: "FamilyCowDispersalAPI: Access Denied" });

    case 'DELETE':
      if(permissions.includes(CREATE_FAMILY_COW_DISPERSALS)){
        return deleteOne(req, res);
      }
      return res.status(422).json({ data: "FamilyCowDispersalAPI: Access Denied" });
    
    default:
      res.status(405).send({ message: 'Invalid Method.' })
      return;
  }
}

export const getData = async (id: string) => {
  await prisma.$connect();

	try {
		const cowDispersal = await prisma.cowDispersal.findFirst({
			where:{
				id: id
			},
      include: {
        family: {
          include: {
            townVillage: {
              include: {
                district:{
                  include:{
                    country: true
                  }
                }
              }
            }
          }
        },
        cows: true
      }
		});

		if(cowDispersal) {
			return cowDispersal;
		} else {
			return null;
		}
	} catch (e: any) {
		return null;
	}
}
  
const index = async (req: any, res: any) => {
	const { id } = req.query;

	const cowDispersal = await getData(id);

	res.status(200).json({ data: cowDispersal });
}

const updateStatus = async (req: any, res: any, user: any) => {
  const dataRequest = req.body;

  let result: PrismaCustomResponse = null;

	await prisma.$connect();

  try {
    result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const cowDispersal = await tx.cowDispersal.findFirstOrThrow({
        where: {
          id: dataRequest?.id
        },
        include: {
          family: true
        }
      });

      if(dataRequest?.approval == 'Rejected') {
        await tx.family.update({
          where: {
            id: cowDispersal?.familyId
          },
          data: {
            noAnimalsAllocated: {
              increment: cowDispersal?.noOfCows
            }
          }
        });
      }
      
      const cowDispersalUpdated = await tx.cowDispersal.update({
        where: {
          id: dataRequest?.id
        },
        data: {
          status: dataRequest?.approval == 'Rejected' ? 'Rejected' : 'Approved',
          rejectedReason: dataRequest?.rejectionReason
        }
      });

      await createLogHelper(user, cowDispersalUpdated, req.method , "cow_dispersals", tx, cowDispersal, dataRequest?.approval)

      const users = await tx.user.findMany({
        where: {
          role: {
            in: [COUNTRY_LEAD_ROLE, ASSISTANT_COUNTRY_LEAD_ROLE] 
          },
          countryIds: {
            hasSome: [dataRequest?.family?.townVillage?.district?.country?.id]
          }
        }
      });
      
      let reviewTemplate = null;
      let data: any = {
        status: dataRequest?.approval == 'Rejected' ? 'Rejected' : 'Approved',
        family: cowDispersal?.family,
        noOfCows: cowDispersal?.noOfCows
      }
      
      if(dataRequest?.approval == 'Rejected') {
        data = {
          ...data,
          reason: dataRequest?.rejectionReason
        }
        reviewTemplate = reject(data);
      } else {
        reviewTemplate = approve(data);
      }

      if(users?.length > 0) {
        const userEmails: string[] = [];
        users.forEach((user) => {
          userEmails.push(user.email);
        });

        sendMail(userEmails, `${cowDispersal?.secondaryId} - Cow Dispersal Approval`, reviewTemplate);
      }

      return { data: 'Success', status: 200 };
    });
  } catch (e: any) {
    await prisma.$disconnect();
    result = { data: handlePrismaErrors(e), status: 400 };    
  } finally {
    res.status(result.status).json({ data: result.data });
  }
}

const deleteOne = async (req: any, res: any) => {
  const {id} = req.query
  try {
    const deleteData = await (Cow_Dispersal as any).delete({_id : id})
    if (!deleteData) {
      return res.status(500).json({success:false})
    }
    res.status(200).json({success:true, data:deleteData})
  }
  catch(error) {
      res.status(500).json({error:'There was a Server Side Error!'})
  };
};