import { reject } from "@/emails/familyTransferRequests/reject";
import { approve } from "@/emails/familyTransferRequests/approve";
import { createLogHelper } from "@/helpers/LogHelper";
import Family_Transfer_Requests from "@/models/Family_Transfer_Requests";
import { REVIEW_FAMILY_TRANSFERS_REQUESTS } from "@/permissions/Permissions";
import { OFFICE_ADMIN_ROLE, PrismaCustomResponse } from "@/types/Common";
import { sendMail } from "@/utils/Nodemailer";
import { getToken } from "next-auth/jwt";
import { prismaClient } from "@/utils/Prisma";
import { handlePrismaErrors } from "prisma/prismaErrorHandling";
import { Prisma } from "@prisma/client";


const prisma = prismaClient;
const secret = process.env.NEXTAUTH_SECRET

export default async function handler(req: any, res: any) {
  //API Middleware components
  const token = await getToken({ req, secret });
  const user: any = token?.user;
  const permissions: string[] = user?.permissions;

  // switch the methods
  switch (req.method) {
    case 'GET':
      return index(req, res);

    case 'PUT':
      if (permissions.includes(REVIEW_FAMILY_TRANSFERS_REQUESTS)) {
        return edit(req, res, user);
      }
      return res.status(422).json({ data: "FamilyCowDispersalAPI: Access Denied" });

    case 'DELETE':
      return deleteOne(req, res);

    default:
      res.status(405).send({ message: 'Invalid Method.' })
      return;
  }
}

export const approvalEmail = async (dataRequest: any) => {
  let reviewTemplate = null;

  const familyTransferRequest = await getData(dataRequest.id)

  let data = {
    status: dataRequest.status,
    family1: familyTransferRequest.family1,
    family2: familyTransferRequest.family2,
    noOfCows: familyTransferRequest.noOfCows,
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
      countryIds: {
        hasSome: familyTransferRequest.family1.townVillage.district.country.id
      }
    }
  })


  if (users) {
    const userEmails: string[] = [];
    users.forEach((user) => {
      userEmails.push(user.email);
    });

    await sendMail(userEmails, `Family Transfer Request ${dataRequest.status} (${familyTransferRequest.secondaryId})`, reviewTemplate)
      .then(() => {})
      .catch(err => {
        throw new Error(err);
      });
  }
}

const refillAllocatedAnimals = async (family: any, newNoAllocatedAnimals: any) => {

  // const oldFamilyData = await Family.findById(family._id).exec() 
  await prisma.family.update({
    where: {
      id: family.id
    },
    data: {
      noAnimalsAllocated: newNoAllocatedAnimals
    }
  });

  // await Family.findByIdAndUpdate(family._id, {"noAnimalsAllocated": newNoAllocatedAnimals})
  //   .then(async(data: any)=> {
  //     data.noAnimalsAllocated = newNoAllocatedAnimals
  //     await createLogHelper(user, data, "PUT", "families", oldFamilyData)
  //   })
  //   .catch((error: any)=> {
  //   })
}

export const getData = async (id: string) => {
  try {
    const relations = {
      include: {
        family1: {
          include: {
            townVillage: {
              include: {
                district: {
                  include: {
                    country: true
                  }
                }
              }
            }
          }
        },
        family2: true
      }
    }

    const request = await prisma.familyTransferRequest.findFirst({
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

// const updateStatus = async (req: any, res: any, user: any) => {

//   const {id} = req.query
//   var mongoose = require('mongoose');
//   var objectId = mongoose.Types.ObjectId(id);
//   const {familyTransfer, approval, rejectionReason} = req.body;
//   const method = req.method

//   if(approval == "Rejected"){

//     //Revert animalsAllocated values back to default ones.
//     refillAllocatedAnimals(user, familyTransfer.family1, familyTransfer.family1?.noAnimalsAllocated);
//     refillAllocatedAnimals(user, familyTransfer.family2, familyTransfer.family2?.noAnimalsAllocated);
//   }

//   const oldData = await Family_Transfer_Requests.findById(id).exec() 

//   await Family_Transfer_Requests.findByIdAndUpdate(objectId, { "$set": { "status": approval, "rejectedReason": rejectionReason}})
//   .then(async (data: any) => {
//     if(approval === "Rejected"){
//       await approvalEmail(approval, data, rejectionReason);
//       data.status = "Rejected"
//     }
//     if(approval === "Approved"){
//       await approvalEmail(approval, data)
//       data.status = "Approved"
//     }
//     //Filter out not needed fields
//     Object.keys(data).forEach(key => {
//       if (data[key] === '' || data[key] === true || data[key] === false) {
//         delete data[key];
//       }
//     });
//     await createLogHelper(user, data, method , "family_transfer_requests", oldData, approval)
//     res.status(200).json({ data: data });
//   })
//   .catch((error) => {
//     res.status(422).json({ data: error });
//   });

// };

const edit = async (req: any, res: any, user: any) => {
  const _id = req.query.id;
  const method = req.method;
  const { familyTransfer, approval, rejectionReason } = req.body;
  const family1 = familyTransfer.family1;
  const family2 = familyTransfer.family2;

  await prisma.$connect();

  let result: PrismaCustomResponse = null;

  try {
    result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {

      const oldRequest = await tx.familyTransferRequest.findFirst({
        where: {
          id: _id
        }
      })

      const request = await tx.familyTransferRequest.update({
        where: {
          id: _id
        },
        data: {
          status: approval,
          rejectedReason: rejectionReason
        }
      });

      if (approval == "Rejected") {
        //Revert animalsAllocated values back to default ones.
        refillAllocatedAnimals(family1, family1.noAnimalsAllocated + familyTransfer.noOfCows);
        refillAllocatedAnimals(family2, family2.noAnimalsAllocated - familyTransfer.noOfCows);
      }

      approvalEmail({ status: approval, id: _id, rejectedReason: rejectionReason })

      // if(approval === "Rejected"){
      //   await approvalEmail(approval, request, rejectionReason);
      //   request.status = "Rejected"
      // }
      // if(approval === "Approved"){
      //   await approvalEmail(approval, request)
      //   request.status = "Approved"
      // }
      await createLogHelper(user, request, method, "family_transfer_requests", tx, oldRequest, approval)

      return { data: request, status: 200 };
    });
  } catch (e: any) {
    await prisma.$disconnect();
    result = { data: handlePrismaErrors(e), status: 400 };
  } finally {
    res.status(result.status).json({ data: result.data });
  }
}

const assignCows = async (res: any, req: any) => {
  const _id = req.query.id;

  const { cows } = req.body;

  const request = await prisma.familyTransferRequest.update({
    where: {
      id: _id
    },
    data: {
      cows: {
        connect: {

        }
      }
    }
  });
}

const deleteOne = async (req: any, res: any) => {
  const { id } = req.query;

  try {
    const deleteData = await (Family_Transfer_Requests as any).delete({ _id: id })
    if (!deleteData) {
      return res.status(500).json({ success: false })
    }
    res.status(200).json({ success: true, data: deleteData })
  }
  catch (error) {
    res.status(500).json({ error: 'There was a Server Side Error!' })
  };
};