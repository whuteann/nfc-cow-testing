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

export const getData = async (districtIds: string) => {
  await prisma.$connect();

	try {
		const districts = await prisma.district.findMany({
			where: {
        id: {
          in: districtIds.split(","),
        },
      },
		});

		if(districts) {
			return districts;
		} else {
			return null;
		}
	} catch (e: any) {
		return null;
	}
}
  
const index = async (req: any, res: any) => {
	const { districtIds } = req.query;

	const districts = await getData(districtIds);

	res.status(200).json({ data: districts });
}
