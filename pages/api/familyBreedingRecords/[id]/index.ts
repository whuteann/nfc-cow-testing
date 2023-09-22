import { VIEW_FARM_BREEDING_RECORDS } from "@/permissions/Permissions";
import { getToken } from "next-auth/jwt";
import { prismaClient } from "@/utils/Prisma";

const secret = process.env.NEXTAUTH_SECRET;
const prisma = prismaClient;

export default async function handler(req:any, res:any) {
  //API Middleware components
  const token = await getToken({ req, secret });
  const user: any = token?.user;
  const permissions: string[] = user?.permissions;
  
  
  if(!permissions.includes(VIEW_FARM_BREEDING_RECORDS)){
    return res.status(422).json({ data: "BreedingRecordsAPI: Access Denied" });
  }

  // switch the methods
  switch (req.method) {
    case 'GET':
      return index(req,res);

    default:
      res.status(405).send({ message: 'Invalid Method.' })
      return;
  }
}

export const getData = async (id: string) => {
	try {
		const birthRecord = await prisma.familyBirthRecord.findFirst({
			where:{
				id: id
			},
      include: {
        family: true,
        cow: true,
      }
		});

		if(birthRecord) {
			return birthRecord;
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

	const district = await getData(id);

	res.status(200).json({ data: district });
}