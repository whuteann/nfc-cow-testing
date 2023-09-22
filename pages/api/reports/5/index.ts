
import { getToken } from "next-auth/jwt";
import { prismaClient } from "@/utils/Prisma";
import { family } from "@/models/Cow";
import { getTotalAmountOfCowsQuery } from "@/helpers/Query/reports/getTotalAmountOfCows";



const secret = process.env.NEXTAUTH_SECRET
const prisma = prismaClient;

interface queryProps {
  countryId: string,
  farmId: string,
  villageTownId: string,
  teamLeadId: string,
  supervisorId: string,
  coordinatorId: string,
  familyId: string,
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
  countryId, farmId, villageTownId, teamLeadId, supervisorId, coordinatorId, familyId, toDate, fromDate
}: queryProps) => {
  await prisma.$connect();

  const result = [];

  const queryAll = await getTotalAmountOfCowsQuery(
    prisma,
    "",
    countryId,
    farmId,
    villageTownId,
    teamLeadId,
    supervisorId,
    coordinatorId,
    familyId,
    "",
    ""
  );

  const querySold = await getTotalAmountOfCowsQuery(
    prisma,
    "",
    countryId,
    farmId,
    villageTownId,
    teamLeadId,
    supervisorId,
    coordinatorId,
    familyId,
    toDate,
    fromDate
  );


  const queryDeath = await getTotalAmountOfCowsQuery(
    prisma,
    "Dead",
    countryId,
    farmId,
    villageTownId,
    teamLeadId,
    supervisorId,
    coordinatorId,
    familyId,
    "",
    ""
  );

  const getTotalAmountOfCows = await prisma.cow.count({
    where: queryAll
  });

  const cowsSold = await prisma.cow.findMany({
    where: querySold
  });

  const getTotalAmountOfCowsSold = cowsSold.length;

  const getTotalSaleAmount = cowsSold.reduce((a, cow)=>{
    return a + cow.cowPrice
  }, 0);

  const getTotalCCIProfits = cowsSold.reduce((a, cow)=>{
    return a + cow.cciShare
  }, 0);

  const getTotalAmountOfDeadCows = await prisma.cow.count({
    where: queryDeath
  });

  result.push(getTotalAmountOfCows);
  result.push(getTotalAmountOfCowsSold);
  result.push(getTotalSaleAmount.toFixed(2));
  result.push(getTotalCCIProfits.toFixed(2));
  result.push(getTotalAmountOfDeadCows);

  return result;
}


const index = async (req: any, res: any) => {
  const { countryId, farmId, villageTownId, teamLeadId, supervisorId, coordinatorId, familyId, fromDate, toDate } = req.query

  const result = await getData({
    countryId: countryId,
    farmId: farmId,
    villageTownId: villageTownId,
    teamLeadId: teamLeadId,
    supervisorId: supervisorId,
    coordinatorId: coordinatorId,
    familyId: familyId,
    toDate: toDate,
    fromDate: fromDate
  });

  if (result) {
    res.status(200).json({ data: result });
  } else {
    res.status(422).json({ data: result });
  }
}