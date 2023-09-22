import { getToken } from "next-auth/jwt";
import { prismaClient } from "@/utils/Prisma";

const secret = process.env.NEXTAUTH_SECRET
const prisma = prismaClient;

interface queryProps {
  req: any,
  familyIds: any,
  fromDate?: any;
  toDate?: any;
}

export default async function handler(req: any, res: any) {
  //API Middleware components
  const token = await getToken({ req, secret });
  const user: any = token?.user;

  // switch the methods
  switch (req.method) {
    case "GET":
      if(token){
        return index(req, res);
      }
      return res.status(422).json({ data: "FamilyVisitationAPI: Access Denied" });
    
    // case 'POST':
    //   return create(req, res);
    
    default:
      res.status(405).send({ message: 'Invalid Method.' })
      return;
  }
}

export const getData = async ({
  req,
  familyIds = [],
  fromDate = null,
  toDate = null
}: queryProps) => {
  await prisma.$connect(); 
  console.log(`
  
  
  `)
  console.log(familyIds);

  const data = await prisma.familyVisitation.findMany({
    where: {
      familyId: {
        in: familyIds
      },
      visitationDate: {
        lte: new Date(toDate),
        gte: new Date(fromDate)
      },
    }
  })
  console.log(data);
  return data
}

const index = async (req: any, res: any) => {
  const { familyIds, fromDate, toDate } = req.query
  
  const result: any = await getData({
    req: req,
    familyIds: familyIds,
    fromDate: fromDate,
    toDate: toDate
  });

  if(result || result == 0) {
    res.status(200).json({ data: result });
  } else {
    res.status(422).json({ data: result });
  }
}