import { getToken } from "next-auth/jwt";
import { prismaClient } from "@/utils/Prisma";

const secret = process.env.NEXTAUTH_SECRET
const prisma = prismaClient;

export default async function handler(req: any, res: any) {
  //API Middleware components
  const token = await getToken({ req, secret });

  if(!token){
    return res.status(422).json({ data: "Cow: Access Denied" });
  }

  // switch the methods
  switch (req.method) {
    case "GET":
      return index(req, res);
    
    default:
      res.status(400).json('Invalid request');
  }
}

export const getData = async (req: any, hasFamily: boolean = false, farm: string, nfcID: string, status: string, country: string) => {
  await prisma.$connect();

  let query: object = {};
  
  if(hasFamily == true) {
    query = { 
      ...query,
      familyId: {
        isSet: true
      }
    };
  } else {
    query = { 
      ...query,
      familyId: {
        isSet: false
      },
    };
  }

  if(country){
    query = {
      ...query,
      farm: {
        is: {
          district: {
            is: {
              country: {
                id: country
              }
            }
          }
        }
      }
    }
  }

  if(farm) {
    query = { 
      ...query, 
      farm: {
        id: farm
      }
    };
  }

  if(nfcID) {
    query = {
      ...query,
      nfcId: {
        equals: nfcID,
        mode: 'insensitive'
      }
    }
  }
  
  query = {
    ...query,
    status: {
      not: 'Dead'
    },
    deletedAt: null
  }


  return await prisma.cow.findMany({
    take: 15,
    where: query,
    orderBy: {
      secondaryId: 'asc',
    },
    include: {
      family: true,
      farm: {
        include: {
          district: {
            include: {
              country: true
            }
          }
        }
      }
    }
  })
}

const index = async (req: any, res: any) => {
  const { hasFamily, farm, country, nfcID, status } = req.query;
  const result = await getData(req, hasFamily, farm, nfcID, status, country);

  if (result) {
    res.status(200).json({ data: result });
  } else{
    res.status(422).json({ data: result });
  }
}