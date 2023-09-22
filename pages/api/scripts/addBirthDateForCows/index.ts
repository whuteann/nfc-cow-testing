import { prismaClient } from "@/utils/Prisma";
import { calculateDateOfBirth } from "pages/api/cowdispersals/[id]/assign";

const prisma = prismaClient;

export default async function handler(req: any, res: any) {

  switch (req.method) {
    case "POST":
      return addBirthDateForCows(req, res);

    default:
      res.status(405).send({ message: 'Invalid Method.' })
      return;
  }
}

const addBirthDateForCows = async (req: any, res: any) => {

  const { passphrase } = req.query;

  if (passphrase !== "T3chy@123Hub") {
    return res.status(422).json({ data: "API: Access Denied" });
  }

  const cows = await prisma.cow.findMany();

  const updates = [];

  cows.forEach((cow) => {
    if (cow.ageYear || cow.ageMonth) {
      const birthDate = calculateDateOfBirth(cow.ageYear || 0, cow.ageMonth || 0);
      updates.push(
        prisma.cow.update({
          where: {
            id: cow.id,
          },
          data: {
            birthDate,
          },
        })
      );
    } else if (cow.ageYear === 0 && cow.ageMonth === 0) {
      updates.push(
        prisma.cow.update({
          where: {
            id: cow.id,
          },
          data: {
            birthDate: new Date(),
          },
        })
      );
    }
  });

  await prisma.$transaction(updates);


  return res.status(200).json({ data: "success" })
}