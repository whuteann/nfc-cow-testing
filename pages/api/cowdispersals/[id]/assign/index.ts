import { ASSIGN_FAMILY_COW_DISPERSALS } from "@/permissions/Permissions";
import { getToken } from "next-auth/jwt";
import { createLogHelper } from "@/helpers/LogHelper";
import { createOrUpdateCounter } from "@/helpers/Counter";
import { PrismaCustomResponse } from "@/types/Common";
import { Prisma } from "@prisma/client";
import { COW_ID } from "@/types/Counter";
import { prismaClient } from "@/utils/Prisma";
import _ from 'lodash';
import { handlePrismaErrors } from "prisma/prismaErrorHandling";

const secret = process.env.NEXTAUTH_SECRET
const prisma = prismaClient;

export default async function handler(req:any, res:any) {
  //API Middleware components
  const token = await getToken({ req, secret });
  const user: any = token?.user;
  const permissions: string[] = user?.permissions;

  // switch the methods
  switch (req.method) {
    case 'PUT': 
    if(permissions.includes(ASSIGN_FAMILY_COW_DISPERSALS)){
      return completeCowDispersalv2(req, res, user);
    }

    return res.status(422).json({ data: "FamilyCowDispersalAPI: Access Denied" });

    default:
      res.status(405).send({ message: 'Invalid Method.' })
      return;
  }
}


const completeCowDispersalv2 = async (req: any, res: any, user: any) => {
  const { id } = req.query;
  const dataRequest = req.body;
  
  let cowsData: any = [];
  let totalNewCows: number = 0;

  const nfcIds: any = [];

  dataRequest?.cows?.forEach((cow: any) => {
    if(!cow?.id) {
      nfcIds.push(cow?.nfcId);
    }
  });

  let result: PrismaCustomResponse = null;

	await prisma.$connect();

  try {
    result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const hasSameValue = (array) => {
        const uniqueArray = _.uniq(array.map(str => str.trim()));
        return uniqueArray.length === 1;
      };


      if(nfcIds?.length > 1 && hasSameValue(nfcIds) == true) {
        return { data: "Duplicate nfcIDs found. Please resolve it", status: 422 };   
      }

      const cowExists = await tx.cow.findMany({
        where: {
          nfcId: {
            in: nfcIds
          }
        }
      });

      if(cowExists?.length > 0) {
        return { data: `These NFC ID already exists: ${cowExists?.map((cow) => cow?.nfcId)}`, status: 422 };   
      }

      const oldCowDispersalData = await await tx.cowDispersal.findFirstOrThrow({
        where: {
          id: id
        }
      });

      const cowDispersalFarm = await tx.farm.findFirstOrThrow({
        where:{
          district: {
            is: {
              country: {
                id: dataRequest?.country
              }
            }
          },
          name: {
            contains: 'Dispersal',
            mode: 'insensitive'
          }
        }
      });

      await Promise.all(dataRequest?.cows?.map(async (cow: any) => {
        
        let birthDate = null;

        if(cow?.ageYear || cow?.ageMonth){
          birthDate =calculateDateOfBirth(cow?.ageYear, cow?.ageMonth);
        }

        if(cow.status !== "Dispersed"){
          if(cow?.id) {
            const updatedCow = await tx.cow.update({
              where: {
                id: cow?.id
              },
              data: {
                family: {
                  connect: {
                    id: dataRequest?.family
                  }
                },
                cowPhoto: cow?.cowPhoto || null,
                cowPrice: parseFloat(cow?.cowPrice) || null,
                weight: parseFloat(cow?.weight) || null,
                gender: cow?.gender || null,
                dispersalDate: cow?.dispersalDate || null,
                cowWithFamilyPhoto: cow?.cowWithFamilyPhoto || null,
                status: 'Dispersed',
        
                //Pakistan Exclusive
                transportPrice: parseFloat(cow?.transportPrice) || null,
                taxPrice: parseFloat(cow?.taxPrice) || null,
                coordinatorHelperExpenses: parseFloat(cow?.coordinatorHelperExpenses) || null,
                signedLegalDoc: cow?.signedLegalDoc || null,
                signedLegalDocFilename: cow?.signedLegalDoc?.name || null,
                
                //Bangladesh Exclusive
                ageYear: cow?.ageYear || 0,
                ageMonth: cow?.ageMonth || 0,
                birthDate: birthDate,
                height: parseFloat(cow?.height) || null,
                purchaseDate: cow?.purchaseDate || null,
                signedDispersalAgreement: cow?.signedDispersalAgreement || null,
                signedDispersalAgreementFilename: cow?.signedDispersalAgreement?.name || null,
                colour: cow?.colour || null
              }
            });

            cowsData.push(updatedCow);
          } else {
            const counter = await createOrUpdateCounter(tx, COW_ID)
  
            const createdCow = await tx.cow.create({
              data: {
                farm: {
                  connect: {
                    id: cowDispersalFarm?.id
                  }
                },
                family: {
                  connect: {
                    id: dataRequest?.family
                  }
                },
                secondaryId: `${counter?.name}${counter?.seq}`,
                nfcId: cow?.nfcId || null,
                cowPhoto: cow?.cowPhoto || null,
                cowPrice: parseFloat(cow?.cowPrice) || null,
                weight: parseFloat(cow?.weight) || null,
                gender: cow?.gender || null,
                dispersalDate: cow?.dispersalDate || null,
                cowWithFamilyPhoto: cow?.cowWithFamilyPhoto || null,
                status: 'Dispersed',
                isFrom: 'Market',
        
                //Pakistan Exclusive
                transportPrice: parseFloat(cow?.transportPrice) || null,
                taxPrice: parseFloat(cow?.taxPrice) || null,
                coordinatorHelperExpenses: parseFloat(cow?.coordinatorHelperExpenses) || null,
                signedLegalDoc: cow?.signedLegalDoc || null,
                signedLegalDocFilename: cow?.signedLegalDocFilename || null,
        
                //Bangladesh Exclusive
                ageYear: cow?.ageYear || 0,
                ageMonth: cow?.ageMonth || 0,
                birthDate: birthDate,
                height: parseFloat(cow?.height) || null,
                purchaseDate: cow?.purchaseDate || null,
                signedDispersalAgreement: cow?.signedDispersalAgreement || null,
                signedDispersalAgreementFilename: cow?.signedDispersalAgreementFilename || null,
      
                colour: cow?.colour || null,
                deletedAt: null
              }
            });

            totalNewCows += 1;
            cowsData.push(createdCow);
          }
        } else{
          if(cow?.id) {
            cowsData.push(cow);
          }
        }    
      }));

      // Todo: Should check if totalFarmCows have enough, else need to record it as too much
      if(totalNewCows > 0) {
        const totalFarmCowRecord = await tx.totalFarmCows.findFirst({
          where: {
            farmId: cowDispersalFarm.id
          }
        })

        if(totalFarmCowRecord) {
          await tx.totalFarmCows.update({
            where: {
              id: totalFarmCowRecord.id
            },
            data: {
              totalAmountOfCows: {
                increment: totalNewCows
              }
            }
          });
        } 
        else {
          await tx.totalFarmCows.create({
            data: {
              totalAmountOfCows: totalNewCows,
              farm: {
                connect: {
                  id: cowDispersalFarm.id
                }
              }
            },
          });
        }
      }

      const updatedCowDispersal = await tx.cowDispersal.update({
        where: {
          id: id
        },
        data: {
          cowsSnapshot: cowsData,
          cows: {
            connect: cowsData?.map((cowData) => { return { id: cowData?.id }})
          },
          status: dataRequest?.cows.length < oldCowDispersalData.noOfCows ? 'Sub-Completed' : 'Completed'
        }
      });

      await createLogHelper(user, updatedCowDispersal, req.method , "cow_dispersals", tx, oldCowDispersalData)
      
      return { data: "success", status: 200 };
    });
  } catch (e: any) {
    await prisma.$disconnect();
    result = { data: handlePrismaErrors(e), status: 400 };   
  } finally {
    res.status(result?.status).json({ data: result?.data });
  }
}

export function calculateDateOfBirth(year, month) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  let birthYear = currentYear - year;
  let birthMonth = currentMonth - month;

  // Adjust for negative birth month
  if (birthMonth <= 0) {
    birthYear--;
    birthMonth += 12;
  }

  const birthDate = new Date(birthYear, birthMonth - 1, 1); // Day is set to 1

  return birthDate;
}

