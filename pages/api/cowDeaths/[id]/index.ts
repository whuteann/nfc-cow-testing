import { REVIEW_COW_DEATHS, VIEW_COW_DEATHS } from "@/permissions/Permissions";
import { getToken } from "next-auth/jwt";
import { Prisma } from "@prisma/client";
import { prismaClient } from "@/utils/Prisma";
import { PrismaCustomResponse } from "@/types/Common";
import { handlePrismaErrors } from "prisma/prismaErrorHandling";
import { COW_DEAD } from "@/types/Status";
import { createLogHelper } from "@/helpers/LogHelper";
import { reject } from "@/emails/cowDeaths/reject";
import { approve } from "@/emails/cowDeaths/approve";
import { sendMail } from "@/utils/Nodemailer";

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
      if (!permissions.includes(VIEW_COW_DEATHS)) {
        return res.status(422).json({ data: "CowDeaths: Access Denied" });
      }
      return index(req, res);
    case 'PUT':
      if (!permissions.includes(REVIEW_COW_DEATHS)) {
        return res.status(422).json({ data: "CowDeaths: Access Denied" });
      }
      return edit(req, res, user);
    default:
      res.status(405).send({ message: 'Invalid Method.' })
      return;
  }
}

export const approvalEmail = async (dataRequest: any) => {
  let reviewTemplate = null;

  const deathRecord = await getData(dataRequest.id)

  let data = {
    status: dataRequest.status,
    deathCause: deathRecord.deathCause,
    cowNfcID: deathRecord.cow.nfcId
  }

  if (dataRequest.status == "Rejected") {
    const rejectData = { ...data, reason: dataRequest.rejectedReason }
    reviewTemplate = reject(rejectData);
  } else {
    const approveData = { ...data }
    reviewTemplate = approve(approveData)
  }
  //mail      
  const users = await prisma.user.findMany({
    where: {
      id: deathRecord.createdBy.id
    }
  })


  if (users) {
    const userEmails: string[] = [];
    users.forEach((user) => {
      userEmails.push(user.email);
    });

    await sendMail(userEmails, `Cow Death ${dataRequest.status} (${deathRecord.secondaryId})`, reviewTemplate)
      .then(() => {})
      .catch(err => {
        throw new Error(err);
      })
  }
}

export const getData = async (id: string) => {
  try {
    const deathRecord = await prisma.deathRecord.findFirst({
      where: {
        id: id,
      },
      include: {
        cow: true,
        farm: true,
        family: true
      }
    })

    if (deathRecord) {
      return deathRecord;
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

  const result = await getData(id);

  if (result) {
    res.status(200).json({ data: result });
  } else {
    res.status(422).json({ data: result });
  }
}

const edit = async (req: any, res: any, user: any) => {
  const { id } = req.query;
  const dataRequest = req.body;

  await prisma.$connect();

  let result: PrismaCustomResponse = null;

  // const { approval, rejectedReason, data } = req.body;
  try {
    result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {

      const oldDeathRecord = await tx.deathRecord.findFirst({
        where: {
          id: id
        }
      })
      const deathRecord = await tx.deathRecord.update({
        where: {
          id: id
        },
        //data to be updated
        data: {
          status: dataRequest?.status,
          rejectedReason: dataRequest?.rejectedReason,
          updatedAt: new Date().toISOString(),
        }
      });

      //send email
      approvalEmail({ status: dataRequest?.status, id: id, rejectedReason: dataRequest?.rejectedReason })

      if (dataRequest.status == 'Approved') {
        await tx.cow.update({
          where: {
            id: dataRequest?.cow
          },
          data: {
            status: COW_DEAD
          },
        })
      }

      await createLogHelper(user, deathRecord, req.method, 'cow_deaths', tx, oldDeathRecord, dataRequest.status);

      return { data: deathRecord, status: 200 };
    });
  } catch (e: any) {
    await prisma.$disconnect();
    result = { data: handlePrismaErrors(e), status: 400 };
  } finally {
    res.status(result.status).json({ data: result.data });
  }

  // if(approval == "Approved"){
  //   Cow.findByIdAndUpdate(data.cow._id, {
  //     status: 'Dead',
  //     deathDate: data.date_of_death
  //   }, { new: true })
  //   .catch(async (error: any) => {        
  //     res.status(422).json({ data: "Update failed" });
  //   });
  // }

  // await Cow_Death.findByIdAndUpdate(_id, { 
  //   "$set": { 
  //     "status": approval, 
  //     "rejected_reason": rejectedReason
  // }})
  // .then( async (request:any) => {
  //   res.status(200).json({ data: request });
  // })
  // .catch((error) => {
  //   res.status(422).json({ data: "Wrong Data" });
  // });
};