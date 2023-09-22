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

export const getData = async (userIds: string) => {
  await prisma.$connect();

	try {
		const users = await prisma.user.findMany({
			where: {
        id: {
          in: userIds.split(","),
        },
      },
		});

		if(users) {
			return users;
		} else {
			return null;
		}
	} catch (e: any) {
		return null;
	}
}
  
const index = async (req: any, res: any) => {
	const { userIds } = req.query;

	const users = await getData(userIds);

	res.status(200).json({ data: users });
}
