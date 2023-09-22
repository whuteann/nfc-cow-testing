
import { getToken } from "next-auth/jwt";
import { prismaClient } from "@/utils/Prisma";

import families, { getData as getFamilies } from "pages/api/families";
import { result } from "lodash";
import { ASSISTANT_COUNTRY_LEAD_ROLE, COORDINATOR_ROLE, COUNTRY_LEAD_ROLE, COUNTRY_MANAGER_ROLE, OFFICE_ADMIN_ROLE } from "@/types/Common";
import moment from "moment-timezone";


const secret = process.env.NEXTAUTH_SECRET
const prisma = prismaClient;

interface queryProps {
  userId: string;
  fromDate: string;
  toDate: string;
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

    default:
      res.status(405).send({ message: 'Invalid Method.' })
      return;
  }
}

export const getData = async ({
  userId,
  fromDate,
  toDate
}: queryProps) => {
  await prisma.$connect();

  const processedData = await dataQuery(userId, fromDate, toDate);

  return processedData;
}

const dataQuery = async (userId, fromDate, toDate) => {

  let families;
  let familyCowSales;
  let familyCowDeaths;


  const userRole = (await prisma.user.findFirst({
    where: {
      id: userId
    },
    select: {
      role: true
    }
  })).role


  if (userRole != OFFICE_ADMIN_ROLE && userRole != COUNTRY_LEAD_ROLE && userRole != COUNTRY_MANAGER_ROLE && userRole != ASSISTANT_COUNTRY_LEAD_ROLE) {

    if (userRole == COORDINATOR_ROLE) {
      families = await prisma.family.findMany({
        where: {
          coordinatorId: userId
        },
        select: {
          id: true,
          name: true,
        },
      })
    } else {
      families = await prisma.family.findMany({
        where: {
          supervisorId: userId
        },
        select: {
          id: true,
          name: true,
        },
      })
    }

    const familyIds = families.map(family => family.id)

    const { cowSales, cowDeaths } = await getDataFromFamilyId(familyIds, fromDate, toDate);

    familyCowSales = cowSales;
    familyCowDeaths = cowDeaths;

  } else {
    //if role is higher up
    families = await prisma.family.findMany()

    const familyIds = families.map(family => family.id)


    const { cowSales, cowDeaths } = await getDataFromFamilyId(familyIds, fromDate, toDate);

    familyCowSales = cowSales;
    familyCowDeaths = cowDeaths;
  }


  const processed = processFamily(families, familyCowSales, familyCowDeaths);

  return processed;
}

const processFamily = (families, familyCowSales, familyCowDeaths) => {
  const processed = families.map(family => {
    let totalNumberCowsSold = 0;
    let salesAmount = 0;
    let cciProfit = 0;
    let totalDeath = 0;

    familyCowSales.map(familyCowSale => {
      if (familyCowSale.familyId == family.id) {
        totalNumberCowsSold += familyCowSale.noOfCows

        familyCowSale.cowsSnapshot.map(cowSnapshot => {
          salesAmount += cowSnapshot.totalPrice
          cciProfit += cowSnapshot.cciShare
        })
      }
    })

    familyCowDeaths.map(familyCowDeath => {
      if (familyCowDeath.familyId == family.id) {
        totalDeath += 1
      }
    })

    if (totalNumberCowsSold + salesAmount + cciProfit + totalDeath !== 0) {
      return { id: family.id, name: family.name, totalNumberCowsSold: totalNumberCowsSold, salesAmount: salesAmount, cciProfit: cciProfit, totalDeath: totalDeath }
    }
  }).filter(item => item !== undefined);

  return processed;
}

const getDataFromFamilyId = async (familyIds, fromDate, toDate) => {


  const familyCowSales = await prisma.familyCowSale.findMany({
    where: {
      familyId: {
        in: familyIds
      },
      status: "Tallied",
      updatedAt: {
        lte: new Date(toDate),
        gte: new Date(fromDate)
      },
    },
    select: {
      familyId: true,
      cowsSnapshot: {
        select: {
          totalPrice: true,
          cciShare: true
        }
      },
      noOfCows: true
    }
  })

  const familyCowDeaths = await prisma.deathRecord.findMany({
    where: {
      familyId: {
        in: familyIds
      },
      status: "Approved",
      updatedAt: {
        lte: new Date(toDate),
        gte: new Date(fromDate)
      },
    },
    select: {
      familyId: true
    }
  })

  return { cowSales: familyCowSales, cowDeaths: familyCowDeaths }
}

const index = async (req: any, res: any) => {
  const { userId, fromDate, toDate} = req.query

  console.log("Date: ", fromDate, toDate);
  const result = await getData({
    userId: userId,
    fromDate: fromDate,
    toDate: toDate,
  });

  if (result) {
    res.status(200).json({ data: result });
  } else {
    res.status(422).json({ data: result });
  }
}