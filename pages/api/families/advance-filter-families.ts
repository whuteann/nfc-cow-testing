import { VIEW_FAMILIES_COORDINATORS } from "@/permissions/Permissions";
import { getToken } from "next-auth/jwt";
import _ from 'lodash';
import { prismaClient } from "@/utils/Prisma";
import { getFamilyFilter } from "@/helpers/Query/families";
import { getSession } from "next-auth/react";

const secret = process.env.NEXTAUTH_SECRET;
const prisma = prismaClient;

export default async function handler(req: any, res: any) {
  const token = await getToken({ req, secret });
  const user: any = token?.user;
  const permissions: string[] = user?.permissions;

  // switch the methods
  switch (req.method) {
    case "GET": 
      // if(permissions.includes(VIEW_FAMILIES_COORDINATORS)){
        return index(req, res);
      // }
      // return res.status(422).json({ data: "Family/Coordinator: Access Denied" });
    
    default:
      res.status(400).json('Invalid request');
  }
}

export const getData = async ( 
  req: any,
  familyType: string, 
  townVillage: string, 
  name: string = '') => {
  
  await prisma.$connect();
  const session:any = await getSession({ req });

  let whereQuery: any = {
    status: 'Approved'
  };

  if(familyType) {
    if(familyType == 'Old with no cows dispersed currently') {
      whereQuery = {
        ...whereQuery,
        cowDispersals: {
          some: {
            status: {
              in: ['Completed', 'Sold'] 
            },
            cows: {
              some: {
                status: {
                  in: ['Sold', 'Dead']
                }
              }
            }
          }
        }
      };
    } else if(familyType == 'Old with cows dispersed currently') {
      whereQuery = {
        ...whereQuery,
        cowDispersals: {
          some: {
            status: {
              in: ['Completed', 'Sold', 'Approved'] 
            },
            cows: {
              some: {
                status: {
                  in: ['Dispersed']
                }
              }
            }
          }
        }
      };
    }
  }
  
  if(townVillage) {
    whereQuery = {
      ...whereQuery,
      townVillage: {
        id: townVillage
      }
    };
  }

  if(name) {
    whereQuery = {
      ...whereQuery,
      name: {
        contains: name,
        mode: 'insensitive'
      }
    };
  }

  const filter = await getFamilyFilter(session, prisma, "-1");

  whereQuery = {
    ...whereQuery,
    ...filter
  }


  const families = await prisma.family.findMany({
    where: {
      ...whereQuery
    }
  })

  if (familyType !== 'New'){
    return families
  }
  else {
    const familyIds = []
    families?.map((family) => {
      familyIds.push(family.id)
    })

    const cowDispersals = await prisma.cowDispersal.findMany({
      where: {
        familyId: {
          in: familyIds
        }
      }
    })

    const familyWithDispersalId = []
    cowDispersals?.map((cowDispersal) => {
      familyWithDispersalId.push(cowDispersal.familyId)
    })

    const filteredFamilies = families?.filter((family) => {
      if (familyWithDispersalId.length > 0){
        if (!(familyWithDispersalId?.includes(family.id))){
          return family
        }
      }
      else {
        return family
      }
    })

    return filteredFamilies

  }
}

const index = async (req: any, res: any) => {
  const { familyType, townVillage, name } = req.query

  const result = await getData(req, familyType, townVillage, name);

  if (result) {
    res.status(200).json({ data: result });
  } else{
    res.status(422).json({ data: result });
  }
}