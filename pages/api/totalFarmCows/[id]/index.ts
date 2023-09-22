import { CREATE_COW_PURCHASE_REQUESTS } from "@/permissions/Permissions";
import { getToken } from "next-auth/jwt";
import { prismaClient } from "@/utils/Prisma";
import { getSession } from "next-auth/react";
import { ASSISTANT_COUNTRY_LEAD_ROLE, COUNTRY_LEAD_ROLE, COUNTRY_MANAGER_ROLE, OFFICE_ADMIN_ROLE } from "@/types/Common";

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
      if (permissions.includes(CREATE_COW_PURCHASE_REQUESTS)) {
        return index(req, res);
      }
      return res.status(422).json({ data: "Total Farm Cows: Access Denied" });

    default:
      res.status(405).send({ message: 'Invalid Method.' })
      return;
  }
}



export const getData = async (id: string, req: any) => {

  const rolesAllowed = [OFFICE_ADMIN_ROLE, COUNTRY_LEAD_ROLE, ASSISTANT_COUNTRY_LEAD_ROLE, COUNTRY_MANAGER_ROLE]
  const session: any = await getSession({ req });

  try {
    const totalFarmCows = await prisma.totalFarmCows.findFirst({
      where: {
        farmId: id
      }
    });

    if (totalFarmCows) {
      if (rolesAllowed.includes(session.currentUser.role)) {
        return totalFarmCows;
      } else {
        return null;
      }

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

  const family = await getData(id, req);

  res.status(200).json({ data: family });
}
