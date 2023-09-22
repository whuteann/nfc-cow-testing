import { prismaClient } from "@/utils/Prisma";

const prisma = prismaClient;

export default async function handler(req: any, res: any) {
  // switch the methods
  switch (req.method) {
    case "GET":
      return index(req, res);

    default:
      res.status(405).send({ message: 'Invalid Method.' })
      return;
  }
}

export const getData = async (familyIds: string) => {
  await prisma.$connect();

	try {
		const familys = await prisma.family.findMany({
			where: {
        id: {
          in: familyIds.split(","),
        },
      },
		});

		if(familys) {
			return familys;
		} else {
			return null;
		}
	} catch (e: any) {
		return null;
	}
}
  
const index = async (req: any, res: any) => {
	const { familyIds } = req.query;

	const familys = await getData(familyIds);

	res.status(200).json({ data: familys });
}
