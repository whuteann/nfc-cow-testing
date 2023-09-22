import { reject } from "@/emails/cowFarmSaleRequests/reject";
import { approve } from "@/emails/cowFarmSaleRequests/approve";
import { createLogHelper } from "@/helpers/LogHelper";
import Cow_Farm_Sale_Request from "@/models/Cow_Farm_Sale_Request";
import { REVIEW_FARM_COW_SALES } from "@/permissions/Permissions";
import { getToken } from "next-auth/jwt";
import { sendMail } from "@/utils/Nodemailer";
import User from "@/models/User";
import { prismaClient } from "@/utils/Prisma";
import { PrismaCustomResponse } from "@/types/Common";
import { Prisma } from "@prisma/client";
import { COW_SOLD } from "@/types/Status";
import { handlePrismaErrors } from "prisma/prismaErrorHandling";

const secret = process.env.NEXTAUTH_SECRET;
const prisma = prismaClient;

export default async function handler(req: any, res: any) {
  //API Middleware components
  const token = await getToken({ req, secret });
  const user: any = token?.user;
  const permissions: string[] = user?.permissions;

  // switch the methods
  switch (req.method) {
    case 'GET':
      if (permissions.includes(REVIEW_FARM_COW_SALES)) {
        return index(req, res);
      }
      return res.status(422).json({ data: "FarmCowSalesAPI: Access Denied" });

    case 'PUT':
      if (permissions.includes(REVIEW_FARM_COW_SALES)) {
        return edit(req, res, user);
      }
      return res.status(422).json({ data: "FarmCowSalesAPI: Access Denied" });

    default:
      res.status(405).send({ message: 'Invalid Method.' })
      return;
  }
}

export const approvalEmail = async (dataRequest: any) => {
  const cowFarmSaleRequest = await getData(dataRequest?.id)

  let reviewTemplate = null;
  let data = {
    status: dataRequest?.status,
    farm: cowFarmSaleRequest?.farm,
    quantity: cowFarmSaleRequest?.quantity,
    cows: cowFarmSaleRequest?.cows,
  }

  if (dataRequest.status == "Rejected") {
    const rejectData = { ...data, reason: dataRequest.rejectedReason }
    reviewTemplate = reject(rejectData);

  }
  else {
    reviewTemplate = approve(data);

  }

  const users = await prisma.user.findMany({
    where: {
      id: cowFarmSaleRequest?.createdBy.id
    }
  })


  // Send mail to requester.
  if (users) {
    const userEmails: string[] = [];
    users.forEach((user) => {
      userEmails.push(user.email);
    });

    await sendMail(userEmails, `Cow Farm Sale Request ${dataRequest?.status} (${cowFarmSaleRequest.secondaryId})`, reviewTemplate)
      .then(() => {})
      .catch(err => {
        throw new Error(err);
      });
  }
}

export const getData = async (id: string) => {
  try {
    const cowFarmSaleRequest = await prisma.cowFarmSaleRequest.findFirst({
      where: {
        id: id
      },
      include: {
        farm: true,
        cows: {
          include: {
            farm: true,
          }
        }
      }
    });

    if (cowFarmSaleRequest) {
      return cowFarmSaleRequest;
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

  const cowFarmSaleRequest = await getData(id);

  res.status(200).json({ data: cowFarmSaleRequest });
}


const edit = async (req: any, res: any, user: any) => {
  const dataRequest = req.body;
  // const method = req.method

  let result: PrismaCustomResponse = null;

  try {
    result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {

      const oldCowFarmSaleRequest = await tx.cowFarmSaleRequest.findFirst({
        where: {
          id: dataRequest.id
        },
      })

      const cowFarmSaleRequest = await tx.cowFarmSaleRequest.update({
        where: {
          id: dataRequest.id
        },
        //data to be updated
        data: {
          status: dataRequest?.status,
          rejectedReason: dataRequest?.rejectedReason,
          updatedAt: new Date().toISOString(),
        }
      });

      //send email
      approvalEmail(dataRequest)

      if (dataRequest.status == 'Approved') {
        await tx.cow.updateMany({
          where: {
            id: {
              in: dataRequest?.cows.map(cow => cow.id)
            }
          },
          data: {
            status: COW_SOLD
          },
        })
      }
      
      await createLogHelper(user, cowFarmSaleRequest, req.method, 'cow_farm_sale', tx, oldCowFarmSaleRequest, dataRequest.status);
      return { data: cowFarmSaleRequest, status: 200 };
    });
  } catch (e: any) {
    await prisma.$disconnect();
    result = { data: handlePrismaErrors(e), status: 400 };
  } finally {
    res.status(result.status).json({ data: result.data });
  }

  // const oldCowFarmSaleRequestData = await Cow_Farm_Sale_Request.findById(_id)

  // await Cow_Farm_Sale_Request.findByIdAndUpdate(_id, { "$set": { "status": approval, "rejectedReason": rejectionReason } })
  //   .then(async (cow_farm_sale_request: any) => {
  //     if (approval === "Rejected") {
  //       await approvalEmail(approval, data, rejectionReason);
  //       data.status = "Rejected"
  //     }
  //     if (approval === "Approved") {
  //       await approvalEmail(approval, data);
  //       data.status = "Approved"
  //     }

  //     //Filter out not needed fields
  //     Object.keys(data).forEach(key => {
  //       if (data[key] === '' || data[key] === true || data[key] === false) {
  //         delete data[key];
  //       }
  //     });
  //     await createLogHelper(user, data, method, "cow_farm_sale_requests", oldCowFarmSaleRequestData)
  //     res.status(200).json({ data: cow_farm_sale_request });
  //   })
  //   .catch(() => {
  //     res.status(422).json({ data: "Wrong Data" });
  //   });
};
