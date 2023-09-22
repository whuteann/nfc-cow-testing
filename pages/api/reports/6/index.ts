
import { getToken } from "next-auth/jwt";
import { prismaClient } from "@/utils/Prisma";



const secret = process.env.NEXTAUTH_SECRET
const prisma = prismaClient;

interface queryProps {
  familyIds: string[];
  toDate: any,
  fromDate: any
}

export default async function handler(req: any, res: any) {
  //API Middleware components
  const token = await getToken({ req, secret });
  const user: any = token?.user;

  // switch the methods
  switch (req.method) {
    case "GET":
      if (token) {
        return index(req, res);
      }
      return res.status(422).json({ data: "ReportAPI: Access Denied" });

    default:
      res.status(405).send({ message: 'Invalid Method.' })
      return;
  }
}

export const getData = async ({
  familyIds, toDate, fromDate
}: queryProps) => {
  await prisma.$connect();

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
    include: {
      family: {
        select: {
          name: true
        }
      }
    },
    orderBy: {
      dateOfSale: 'desc'
    }
  });


  const result = [];

  familyCowSales.map(familyCowSale => {

    const date = new Date(`${familyCowSale.dateOfSale}`);

    result.push({
      name: familyCowSale.family.name,
      dateSold: `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`,
      quantity: familyCowSale.noOfCows,
      price: familyCowSale.totalPrice
    })
  })

  return result;
}



const index = async (req: any, res: any) => {
  const { familyIds, toDate, fromDate } = req.query
  console.log(familyIds);
  const result = await getData({
    familyIds: familyIds.split(","),
    toDate: toDate,
    fromDate: fromDate
  });

  if (result) {
    res.status(200).json({ data: result });
  } else {
    res.status(422).json({ data: result });
  }
}