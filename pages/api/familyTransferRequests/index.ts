import { CREATE_FAMILY_TRANSFER_REQUESTS } from "@/permissions/Permissions";
import { getToken } from "next-auth/jwt";
import { createOrUpdateCounter } from "@/helpers/Counter";
import { Prisma } from "@prisma/client";
import { prismaClient } from "@/utils/Prisma";
import prismaPaginator from "@/helpers/Paginator/PrismaPaginator";
import { familyTransferRequestsQuery } from "@/helpers/Query/familyTransferRequests";
import { FAMILY_TRANSFER_REQUEST_ID } from "@/types/Counter";
import { PrismaCustomResponse } from "@/types/Common";
import { handlePrismaErrors } from "prisma/prismaErrorHandling";
import { createLogHelper } from "@/helpers/LogHelper";
import { getSession } from "next-auth/react";

const secret = process.env.NEXTAUTH_SECRET
const prisma = prismaClient;

interface queryProps {
  req: any,
  cursor?: string,
  search?: string,
  sort?: string;
  page?: number;
  status?: string;
  pageSize?: number;
  limit?: number;
  paginate?: boolean;
  filterFamily?: boolean;
  filterCountry?: boolean;
}

export default async function handler(req: any, res: any) {

  //API Middleware components
  const token = await getToken({ req, secret });
  const user: any = token?.user;
  const permissions: string[] = user?.permissions;

  // switch the methods
  switch (req.method) {
    case "GET": 
      return index(req, res);
    
    case 'POST':
      if(permissions.includes(CREATE_FAMILY_TRANSFER_REQUESTS)){
        return create(req, res, user);
      }
      return res.status(422).json({ data: "FamilyCowDispersalAPI: Access Denied" });
    
    default:
      res.status(400).json('Invalid request');
  }
}

export const getData = async ({
  req,
  cursor = '',
  limit = 10,
  search = '',
  paginate = false,
  status = '',
  filterFamily: filterFamily,
  filterCountry = true,
}: queryProps) => {
  await prisma.$connect();

  const searchQuery = await familyTransferRequestsQuery(req, prisma, {
      search: search,
      status: status,
      deletedAt: true,
      filterFamily: filterFamily,
      filterCountry: filterCountry
    });

  const relations = {
    include: {
      family1: true,
      family2: true
    }
  }

  if (!paginate) {
    return await prisma.familyTransferRequest.findMany({
      where: searchQuery,
      ...relations
    })
  }

  return await prismaPaginator({
    model: { name: 'familyTransferRequest' },
    cursor: cursor,
    size: parseInt(limit.toString()),
    buttonNum: 5,
    orderBy: 'secondaryId',
    where: searchQuery,
    ...relations,
    orderDirection: 'desc',
    prisma: prisma
  }); 
}

// export const getData = async (req: any, status: string = undefined, page: string = undefined, limit: string = undefined, search: string = undefined) => {
//   await connectToDatabase();

//   const session:any = await getSession({ req });
//   const userCountries = (session as any)?.currentUser.countries;

//   let query: any = {};

//   if(status){
//     query = {...query, "status": status};
//   }
//   if(search){
//     query = {...query, "secondaryId" : {'$regex' : search, '$options': 'i'}};
//   }

//   query = withCountryQuery('cow.country._id', userCountries, query);

//   if(page === undefined || page === '') {
//     return Cow_Dispersal.find(query , (error: any, result: any) => {
//       if (!error) {
//         return error;
//       } else{
//         return false;
//       }
//     }).clone();
//   } 
  
//   const options = {
//     page: page,
//     limit: limit
//   };

//   return (Family_Transfer_Requests as any).paginate(query, options)
//     .then((transferRequests: any) => {
//       return transferRequests;
//     })
//     .catch((error: any) => {
//       return error;
//     });
// }

const index = async (req: any, res: any) => {
  const { cursor, limit, search, page, paginate, status, filterFamily } = req.query

  const result = await getData({
    req: req,
    cursor: cursor,
    page: page,
    limit: limit,
    search: search,
    paginate: paginate,
    status: status,
    filterFamily: filterFamily
  });

  if (result) {
    res.status(200).json({ data: result });
  } else{
    res.status(422).json({ data: result });
  }
}

const create = async (req: any, res: any, user: any) => {

  const { data } = req.body;
  let result: PrismaCustomResponse = null;
  const method = req.method
  const session:any = await getSession({ req });

  let noOfCows: number = Number(data.noOfCows);
  let family1: any = data.family1;
  let family2: any = data.family2;

  // noAnimalsAllocated number update function.
  async function updateAllocatedNumber(familyCoordinator: any, newAllocatedNumber: any) {

    await prisma.family.update({
      where: {
        id: familyCoordinator.id
      },
      data: {
        noAnimalsAllocated: newAllocatedNumber
      }
    });

    // await Family.findByIdAndUpdate(familyCoordinator._id, {"noAnimalsAllocated": newAllocatedNumber})
    //   .then(async(familyCoordinator: any) => {
    //     //Create log for families collection
    //     familyCoordinator.noAnimalsAllocated = newAllocatedNumber
    //     await createLogHelper(user, familyCoordinator, "PUT", "families", oldFamilyData)
    //   })
    //   .catch((error: any) => {
    //   })
  }

  //Update Family1 and Family2 noAnimalsAllocated numbers.
  const family1_OldAllocatedNumber: number = Number(family1.noAnimalsAllocated);
  const family2_OldAllocatedNumber: number = Number(family2.noAnimalsAllocated);

  let family1_NewAllocatedNumber: number = family1_OldAllocatedNumber - noOfCows;
  let family2_NewAllocatedNumber: number = family2_OldAllocatedNumber + noOfCows;

  updateAllocatedNumber(family1, family1_NewAllocatedNumber);
  updateAllocatedNumber(family2, family2_NewAllocatedNumber);

  //Create new Family Transfer Request.
  
  try {
    result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const counter = await createOrUpdateCounter(tx, FAMILY_TRANSFER_REQUEST_ID);

      const familyTransferRequest = await tx.familyTransferRequest.create({
        data: {
          status: "Pending",
          secondaryId: `${counter?.name}${counter?.seq}`,
          family1: {
            connect:{
              id: family1.id
            }
          }, 
          family2:{
            connect:{
              id: family2.id
            }
          }, 
          // date: data.date,
          noOfCows: noOfCows,
          deletedAt: null,
          createdBy: {
            id: (session.currentUser as any)._id,
            firstName: (session.currentUser as any).firstName,
            lastName: (session.currentUser as any).lastName
          }
        }
      });

      await createLogHelper(user, familyTransferRequest, method , "family_transfer_requests", tx)

      return { data: familyTransferRequest, status: 200 };
    });
  } catch (e: any) {
    await prisma.$disconnect();

    result = { data: handlePrismaErrors(e), status: 400 };    
  } finally {
    res.status(result.status).json({ data: result.data });
  }

  // await Family_Transfer_Requests.create(data)
  //   .then(async (familyTransferRequest: any) => {
  //     await createLogHelper(user, data, method , "family_transfer_requests")
  //     //Update secondary ID
  //     await updateSecondaryID("familyTransferRequestID", "FTR_", familyTransferRequest._id, Family_Transfer_Requests)
  //     res.status(200).json({ data: data });
  //     })
  //   .catch((error: any) => {
  //     res.status(422).json({ data: error });
  //   });  
}