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

export const getData = async (farmIds: string) => {
  await prisma.$connect();

	try {
		const farms = await prisma.farm.findMany({
			where: {
        id: {
          in: farmIds.split(","),
        },
      },
		});

		if(farms) {
			return farms;
		} else {
			return null;
		}
	} catch (e: any) {
		return null;
	}
}
  
const index = async (req: any, res: any) => {
	const { farmIds } = req.query;

	const farms = await getData(farmIds);

	res.status(200).json({ data: farms });
}
