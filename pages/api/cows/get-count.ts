import { pluck } from "@/helpers/app";
import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";
import { prismaClient } from "@/utils/Prisma";

const secret = process.env.NEXTAUTH_SECRET
const prisma = prismaClient;

export default async function handler(req: any, res: any) {
  // await connectToDatabase();

  //API Middleware components
  const token = await getToken({ req, secret });
  const user: any = token?.user;

  if (!token) {
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

const getData = async (req: any, res: any) => {
  await prisma.$connect();
  const session: any = await getSession({ req });

  const userFarms = (session as any)?.currentUser?.farms;
  const userCountries = (session as any)?.currentUser?.countries;
  const filteredFarms = pluck(userFarms, 'id');



  const promises = userCountries.map(async (country) => {
    const cows = await prisma.cow.groupBy({
      where: {
        farm: {
          OR: [
            {
              AND: [
                {
                  district: {
                    is: {
                      country: {
                        is: {
                          id: country.id
                        }
                      }
                    }
                  }
                }
                ,
                {
                  id: {
                    in: filteredFarms
                  }
                }
              ]
            },
            {
              AND: [
                {
                  district: {
                    is: {
                      country: {
                        is: {
                          id: country.id
                        }
                      }
                    }
                  }
                }
                ,
                {
                  name: {
                    contains: 'Dispersal',
                    mode: 'insensitive'
                  }
                }
              ]
            }
          ]
        }
      },
      by: ["status"],
      _count: {
        _all: true,
      },
      orderBy: {
        status: "desc",
      }
    })

    return {
      country: country.name,
      data: cows
    }
  })

  const results = await Promise.all(promises);

  return res.status(200).json({ data: results });
}

const index = async (req: any, res: any) => {

  await getData(req, res);
}