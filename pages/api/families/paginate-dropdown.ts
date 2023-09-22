import Cow from "@/models/Cow";
import { ObjectId } from "mongodb";
import { getToken } from "next-auth/jwt";
import { prismaClient } from "@/utils/Prisma";

const secret = process.env.NEXTAUTH_SECRET
const prisma = prismaClient;

export default async function handler(req: any, res: any) {
  //API Middleware components
  const token = await getToken({ req, secret });

  if(!token){
    return res.status(422).json({ data: "Family: Access Denied" });
  }

  // switch the methods
  switch (req.method) {
    case "GET":
      return index(req, res);
    
    default:
      res.status(400).json('Invalid request');
  }
}

export const getData = async (
  req: any, 
  id: string = '',
  name: string = '',
  type: string = '',
  country: string = ''
  ) => {
  await prisma.$connect();

  let query: object = {};

  if(id !== '') {
    query = { 
      ...query, 
      userId: {
        not: id
      }
    };
  }

  if(name !== '') {
    query = { 
      ...query, 
      name: {
        contains: name,
        mode: 'insensitive'
      }
    };
  }

  if(type !== '') {
    query = {
      ...query,
      type: {
        equals: type,
        mode: 'insensitive'
      }
    }
  }

  if(country !== '') {
    query = {
      ...query,
      townVillage: {
        district: {
          country: {
            name: country
          }
        }
      }
    }
  }
  
  query = {
    ...query,
    status: 'Approved',
    deletedAt: null,
    // // familyQueryProps
    // filterFamily: true,
    // filterCountry: true
  }


  return await prisma.family.findMany({
    take: 15,
    where: query,
    orderBy: {
      secondaryId: 'asc',
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
      coordinator: true
    }
  })
}

const index = async (req: any, res: any) => {
  const { id, name, type, country } = req.query;
  const result = await getData(req, id, name, type, country);

  if (result) {
    res.status(200).json({ data: result });
  } else{
    res.status(422).json({ data: result });
  }
}