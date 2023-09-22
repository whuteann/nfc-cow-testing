import { CREATE_FAMILIES_COORDINATORS, VIEW_FAMILIES_COORDINATORS } from "@/permissions/Permissions";
import { getToken } from "next-auth/jwt";
import { prismaClient } from "@/utils/Prisma";
import { PrismaCustomResponse } from "@/types/Common";
import { Prisma } from "@prisma/client";
import { handlePrismaErrors } from "prisma/prismaErrorHandling";
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
      if (permissions.includes(VIEW_FAMILIES_COORDINATORS)) {
        return index(req, res);
      }
      return res.status(422).json({ data: "Family/Coordinator: Access Denied" });

    case 'PUT':
      if (permissions.includes(CREATE_FAMILIES_COORDINATORS)) {
        return edit(req, res, user);
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
      where: {
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

    if (family) {
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

const edit = async (req: any, res: any, user: any) => {
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
          nationalID: {
            equals: dataRequest?.nationalID,
            mode: "insensitive"
          }
        }
      });

      if (familyExist) return { data: 'National ID already exist.', status: 422 }

      const transformedTownVillages = dataRequest?.overseeTownsVillages?.split(",");

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

      const oldFamily = await tx.family.findFirst({
        where: {
          id: id
        }
      });

      const family = await tx.family.update({
        where: {
          id: id
        },
        data: {
          name: dataRequest?.name,
          nfcID: dataRequest?.nfcID,
          nationalID: dataRequest?.nationalID,
          type: dataRequest?.type,
          status: dataRequest.status == "Inactive" ? dataRequest.status : "Pending",
          rejectedReason: '',
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

      await createLogHelper(user, family, req.method, dataRequest?.type, tx, oldFamily);

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