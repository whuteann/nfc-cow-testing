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

export const getData = async (cowIds: string) => {
  await prisma.$connect();

	try {
		const cows = await prisma.cow.findMany({
			where: {
        id: {
          in: cowIds.split(","),
        },
      },
		});

		if(cows) {
			return cows;
		} else {
			return null;
		}
	} catch (e: any) {
		return null;
	}
}
  
const index = async (req: any, res: any) => {
	const { cowIds } = req.query;

	const cows = await getData(cowIds);

	res.status(200).json({ data: cows });
}
