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

export const getData = async (countryIds: string) => {
  await prisma.$connect();

	try {
		const country = await prisma.country.findMany({
			where: {
        id: {
          in: countryIds.split(","),
        },
      },
		});

		if(country) {
			return country;
		} else {
			return null;
		}
	} catch (e: any) {
		return null;
	}
}
  
const index = async (req: any, res: any) => {
	const { countryIds } = req.query;

	const country = await getData(countryIds);

	res.status(200).json({ data: country });
}
