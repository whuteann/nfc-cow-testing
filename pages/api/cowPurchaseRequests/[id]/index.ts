import { reject } from "@/emails/cowPurchaseRequests/reject";
import { approve } from "@/emails/cowPurchaseRequests/approve";
import { REVIEW_COW_PURCHASE_REQUESTS } from "@/permissions/Permissions";
import { getToken } from "next-auth/jwt";
import { FARM_LEAD_ROLE, PrismaCustomResponse } from "@/types/Common";
import { sendMail } from "@/utils/Nodemailer";
import { prismaClient } from "@/utils/Prisma";
import { handlePrismaErrors } from "prisma/prismaErrorHandling";
import { Prisma } from "@prisma/client";
import { createLogHelper } from "@/helpers/LogHelper";


const secret = process.env.NEXTAUTH_SECRET
const prisma = prismaClient;

export default async function handler(req: any, res: any) {

  //API Middleware components
  const token = await getToken({ req, secret });
  const user: any = token?.user;
  const permissions: string[] = user?.permissions;

  // switch the methods
  switch (req.method) {
    case 'GET':
      if (permissions.includes(REVIEW_COW_PURCHASE_REQUESTS)) {
        return index(req, res);
      }
      return res.status(422).json({ data: "CowPurchaseRequest: Access Denied" });

    case 'PUT':
      if (permissions.includes(REVIEW_COW_PURCHASE_REQUESTS)) {
        return edit(req, res, user);
      }
      return res.status(422).json({ data: "CowPurchaseRequest: Access Denied" });
  }
}

export const approvalEmail = async (dataRequest: any) => {
  let reviewTemplate = null;

  const cowPurchaseRequest = await getData(dataRequest.id)

  let data = {
    status: dataRequest.status,
    farm: cowPurchaseRequest.farm.name,
    noOfCows: cowPurchaseRequest.noOfCows,
    pricePerCow: cowPurchaseRequest.pricePerCow,
    totalPrice: cowPurchaseRequest.calculatedPurchasePrice,
  }

  if (dataRequest.status == "Rejected") {
    const rejectData = { ...data, reason: dataRequest.rejectedReason }
    reviewTemplate = reject(rejectData);
  }
  else {
    reviewTemplate = approve(data);
  }

  //mail
  const users = await prisma.user.findMany({
    where: {
      farmRole: FARM_LEAD_ROLE,
      farmIds: {
        hasSome: cowPurchaseRequest.farm.id
      }
    }
  })


  if (users) {
    const userEmails: string[] = [];
    users.forEach((user) => {
      userEmails.push(user.email);
    });

    await sendMail(userEmails, `Cow Purchase Request ${dataRequest.status} (${cowPurchaseRequest.secondaryId})`, reviewTemplate)
      .then(() => {})
      .catch(err => {
        throw new Error(err);
      });
  }
}

export const getData = async (id: string) => {
  try {

    const relations = {
      include: {
        farm: {
          include: {
            district: {
              include: {
                country: true,
              },
            }
          },
        }
      }
    }

    const request = await prisma.cowPurchaseRequest.findFirst({
      where: {
        id: id
      },
      ...relations
    });

    if (request) {
      return request;
    } else {
      return null;
    }
  } catch (e: any) {
    return null;
  }
}

const index = async (req: any, res: any) => {
  const { id } = req.query;

  const result = await getData(id);

  if (result) {
    res.status(200).json({ data: result });
  } else {
    res.status(422).json({ data: result });
  }
}

const edit = async (req: any, res: any, user: any) => {
  const _id = req.query.id;
  const method = req.method;
  const { data, approval, rejectionReason, farm, totalAmount } = req.body;

  await prisma.$connect();

  let result: PrismaCustomResponse = null;

  try {
    result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {

      const oldRequest = await tx.cowPurchaseRequest.findFirst({
        where: {
          id: _id
        }
      })

      const request = await tx.cowPurchaseRequest.update({
        where: {
          id: _id
        },
        data: {
          status: approval,
          rejectedReason: rejectionReason
        }
      });

      //send email
      approvalEmail({ status: approval, id: _id, rejectedReason: rejectionReason })

      if (approval == 'Approved') {
        await prisma.totalFarmCows.upsert({
          where: {
            farmId: farm
          },
          update: {
            totalAmountOfCows: {
              increment: totalAmount
            }
          },
          create: {
            farm: {
              connect: {
                id: farm
              }
            },
            totalAmountOfCows: totalAmount
          },
        })
      }

      await createLogHelper(user, request, req.method, "cow_purchase_requests", tx, oldRequest, approval);

      return { data: request, status: 200 };
    });
  } catch (e: any) {
    await prisma.$disconnect();
    result = { data: handlePrismaErrors(e), status: 400 };
  } finally {
    res.status(result.status).json({ data: result.data });
  }
}

