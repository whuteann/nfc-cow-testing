import { reject } from "@/emails/familyFarmTransferRequests/reject";
import { approve } from "@/emails/familyFarmTransferRequests/approve";
import { createLogHelper } from "@/helpers/LogHelper";
import Family from "@/models/Family";
import Family_Farm_Transfer_Request from "@/models/Family_Farm_Transfer_Request";
import User from "@/models/User";
import { CREATE_FAMILY_FARM_TRANSFER_REQUESTS, REVIEW_FAMILY_FARM_TRANSFER_REQUESTS, VIEW_FAMILY_FARM_TRANSFER_REQUESTS } from "@/permissions/Permissions";
import { OFFICE_ADMIN_ROLE, PrismaCustomResponse } from "@/types/Common";
import { sendMail } from "@/utils/Nodemailer";
import { getToken } from "next-auth/jwt";

import { prismaClient } from "@/utils/Prisma";
import { handlePrismaErrors } from "prisma/prismaErrorHandling";
import { Prisma } from "@prisma/client";

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
      if (permissions.includes(VIEW_FAMILY_FARM_TRANSFER_REQUESTS)) {
        return index(req, res);
      }
      return res.status(422).json({ data: "FamilyFarmTransferRequest: Access Denied" });

    case 'PUT':
      if (permissions.includes(REVIEW_FAMILY_FARM_TRANSFER_REQUESTS)) {
        return edit(req, res, user);
      }
      return res.status(422).json({ data: "FamilyFarmTransferRequest: Access Denied" });

    case 'DELETE':
      if (permissions.includes(CREATE_FAMILY_FARM_TRANSFER_REQUESTS)) {
        return deleteOne(req, res);
      }
      return res.status(422).json({ data: "FamilyFarmTransferRequest: Access Denied" });

    default:
      res.status(405).send({ message: 'Invalid Method.' })
      return;
  }
}

export const approvalEmail = async (dataRequest: any) => {
  let reviewTemplate = null;

  const familyFarmTransferRequest = await getData(dataRequest.id)

  let data = {
    status: dataRequest.status,
    family: familyFarmTransferRequest.family.name,
    farm: familyFarmTransferRequest.farm.name,
    noOfCows: familyFarmTransferRequest.noOfCows,
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
      role: OFFICE_ADMIN_ROLE,
      farmIds: {
        hasSome: familyFarmTransferRequest.farm.id
      }
    }
  })



  if (users) {
    const userEmails: string[] = [];
    users.forEach((user) => {
      userEmails.push(user.email);
    });

    await sendMail(userEmails, `Family Farm Transfer Request ${dataRequest.status} (${familyFarmTransferRequest.secondaryId})`, reviewTemplate)
      .then(() => {})
      .catch(err => {
        throw new Error(err);
      });
  }
}

const refillAllocatedAnimals = async (user: any, family: any, newNoAllocatedAnimals: any) => {
  const oldFamilyData = await Family.findById(family._id).exec()
  await Family.findByIdAndUpdate(family._id, { "noAnimalsAllocated": newNoAllocatedAnimals })
    .then(async (data: any) => {
      //Create log for families collection
      data.noAnimalsAllocated = newNoAllocatedAnimals
      // await createLogHelper(user, data, "PUT", "families", tx, oldFamilyData)

    })
    .catch((error: any) => {
    })
}

export const getData = async (id: string) => {
  try {
    const relations = {
      include: {
        family: true,
        farm: true
      }
    }

    const request = await prisma.familyFarmTransferRequest.findFirst({
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

  const { id } = req.query

  let result = await getData(id);

  if (result) {
    res.status(200).json({ data: result });
  } else {
    res.status(422).json({ data: result });
  }
};

const edit = async (req: any, res: any, user: any) => {
  const _id = req.query.id

  const { familyFarmTransferRequest, approval, rejectionReason } = req.body;

  await prisma.$connect();
  let result: PrismaCustomResponse = null;

  try {
    result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {

      const oldRequest = await tx.familyFarmTransferRequest.findFirst({
        where: {
          id: _id
        }
      })

      const request = await tx.familyFarmTransferRequest.update({
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

      await createLogHelper(user, request, req.method, "family_farm_transfer_requests", tx, oldRequest, approval)

      return { data: request, status: 200 };
    });
  } catch (e: any) {
    await prisma.$disconnect();
    result = { data: handlePrismaErrors(e), status: 400 };
  } finally {
    res.status(result.status).json({ data: result.data });
  }
};

const deleteOne = async (req: any, res: any) => {
  const { id } = req.query
  try {
    const deleteData = await (Family_Farm_Transfer_Request as any).delete({ _id: id })
    if (!deleteData) {
      return res.status(500).json({ success: false })
    }
    res.status(200).json({ success: true, data: deleteData })
  }
  catch (error) {
    res.status(500).json({ error: 'There was a Server Side Error!' })
  };
};