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

export const getData = async (townVillageIds: string) => {
  await prisma.$connect();

	try {
		const townVillages = await prisma.townVillage.findMany({
			where: {
        id: {
          in: townVillageIds.split(","),
        },
      },
		});

		if(townVillages) {
			return townVillages;
		} else {
			return null;
		}
	} catch (e: any) {
		return null;
	}
}
  
const index = async (req: any, res: any) => {
	const { townVillageIds } = req.query;

	const townVillages = await getData(townVillageIds);

	res.status(200).json({ data: townVillages });
}
