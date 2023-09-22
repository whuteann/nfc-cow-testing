import { createOrUpdateCounter } from "@/helpers/Counter";
import { createLogHelper } from "@/helpers/LogHelper";
import FamilyCoordinator from "@/models/Family";  
import { VIEW_FAMILIES_COORDINATORS, CREATE_FAMILIES_COORDINATORS } from "@/permissions/Permissions";
import { getToken } from "next-auth/jwt";
import { prismaClient } from "@/utils/Prisma";
import prismaPaginator from "@/helpers/Paginator/PrismaPaginator";
import { familiesQuery } from "@/helpers/Query/families";
import { PrismaCustomResponse } from "@/types/Common";
import { COORDINATOR_ID, DISTRICT_ID } from "@/types/Counter";
import { Prisma } from "@prisma/client";
import { handlePrismaErrors } from "prisma/prismaErrorHandling";

const secret = process.env.NEXTAUTH_SECRET
const prisma = prismaClient;

interface queryProps {
  req: any,
  hasNfcID?: boolean,
  cursor?: string,
  search?: string,
  sort?: string;
  pageSize?: number;
  limit?: number;
  paginate?: boolean;
  filterCountry?: boolean;
  filterFamily?: boolean;
  type?: "Family" | "Coordinator" | "All" | '';
  townvillage?: string;
  status?: string;
  coordinator?: string;
  supervisor?: string;
  teamlead?: string;
  isNfcIdNecessary?: string;
  nfcID?: string;
}

export default async function handler(req: any, res: any) {
  const token = await getToken({ req, secret });
  const user: any = token?.user;
  const permissions: string[] = user?.permissions;

  // switch the methods
  switch (req.method) {
    case "GET":
      if (permissions.includes(VIEW_FAMILIES_COORDINATORS)) {
        return index(req, res);
      }
      return res.status(422).json({ data: "Family/Coordinator: Access Denied" });

    case 'POST':
      if (permissions.includes(CREATE_FAMILIES_COORDINATORS)) {
        return post(req, res);
      }
      return res.status(422).json({ data: "Family/Coordinator: Access Denied" });

    default:
      res.status(400).json('Invalid request');
  }
}

export const getData = async ({
  req,
  hasNfcID = false,
  cursor = '',
  search = '',
  sort = '',
  limit = 10,
  paginate = false,
  filterCountry = true,
  filterFamily = true,
  type = '',
  townvillage = '',
  status = '',
  nfcID= '',
  coordinator=''
}: queryProps) => {
  await prisma.$connect();
  
  const searchQuery = await familiesQuery(req, prisma, type, {
    search: search,
    hasNfcID: hasNfcID,
    filterCountry: filterCountry,
    filterFamily: filterFamily,
    deletedAt: true,
    type: type,
    townvillage: townvillage,
    status: status,
    nfcID: nfcID,
    coordinator: coordinator,
  });

  const relations = {
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
      coordinator: true
    }
  }

  if(!paginate) {
    return await prisma.family.findMany({
      where: searchQuery,
      ...relations
    })
  }

  return await prismaPaginator({
    model: {name: 'family'},
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

const index = async (req: any, res: any) => {
  const { hasNfcID, cursor, limit, search, sort, paginate, filterCountry, filterFamily, type, townvillage, status, nfcID, coordinator } = req.query;

  const result = await getData({
    req: req, 
    hasNfcID: hasNfcID, 
    cursor: cursor,
    limit: limit, 
    sort: sort,
    search: search,
    paginate: paginate,
    filterCountry: filterCountry,
    filterFamily: filterFamily,
    type: type,
    townvillage: townvillage,
    status: status,
    nfcID: nfcID,
    coordinator: coordinator,
  });

  if(result) {
    res.status(200).json({ data: result });
  } else {
    res.status(422).json({ data: result });
  }
}

const post = async (req: any, res: any) => {
  const dataRequest = req?.body;
  let result: PrismaCustomResponse = null;
  
	await prisma.$connect();

  try {
    result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const familyExist = await tx.family.findFirst({
        where: {
          nationalID: {
            equals: dataRequest?.nationalID,
            mode: "insensitive"
          }
        }
      });

      if(familyExist) return { data: 'National ID already exist.', status: 422 }

      const counter = await createOrUpdateCounter(tx, COORDINATOR_ID);

      const transformedTownVillages: any = dataRequest?.overseeTownsVillages?.split(",");

      const supervisor = dataRequest?.supervisor
        ?
          {
            supervisor: {
              connect: {
                id: dataRequest?.supervisor
              }
            }
          }
        :
          {};

      const coordinator = dataRequest?.coordinator
        ?
          {
            coordinator: {
              connect: {
                id: dataRequest?.coordinator
              }
            }
          }
        :
          {};

      const family = await tx.family.create({
        data: {
          secondaryId: `${counter?.name}${counter?.seq}`,
          name: dataRequest?.name,
          nfcID: dataRequest?.nfcID,
          nationalID: dataRequest?.nationalID,
          type: dataRequest?.type,
          status: "Pending",
          rejectedReason: dataRequest?.rejectedReason,
          coordinatorType: dataRequest?.coordinatorType,
          houseType: dataRequest?.houseType,
          address: dataRequest?.address,
          unionCouncil: dataRequest?.unionCouncil,
          province: dataRequest?.province,
          nearestFamousLandmard: dataRequest?.nearestFamousLandmard,
          cityName: dataRequest?.cityName,
          townVillage: {
            connect: {
              id: dataRequest?.townVillage
            }
          },
          flatNumber: dataRequest?.flatNumber,
          buildingName: dataRequest?.buildingName,
          areaName: dataRequest?.areaName,
          policeStationThanaName: dataRequest?.policeStationThanaName,
          postOfficeName: dataRequest?.postOfficeName,
          notes: dataRequest?.notes,
          contact: dataRequest?.contact,
          religion: dataRequest?.religion,
          headshot: dataRequest?.headshot,
          overseeTownsVillagesIds: transformedTownVillages,
          spouseName: dataRequest?.spouseName,
          contractForm: dataRequest?.contractForm,
          contractFormFilename: dataRequest?.contractFormFilename,
          familyPhoto: dataRequest?.familyPhoto,
          housePhoto: dataRequest?.housePhoto,
          applicationForm: dataRequest?.applicationForm,
          applicationFormFilename: dataRequest?.applicationFormFilename,
          typeOfAnimalAllowed: dataRequest?.typeOfAnimalAllowed,
          noAnimalsAllocated: parseInt(dataRequest?.noAnimalsAllocated),
          children: dataRequest?.children,
          ...supervisor,
          ...coordinator,
          deletedAt: null
        }
      });

      return { data: family, status: 200 };
    });
  } catch (e: any) {
    console.error('e', e);
    await prisma.$disconnect();
    result = { data: handlePrismaErrors(e), status: 400 };    
  } finally {
    res.status(result.status).json({ data: result.data });
  }
}