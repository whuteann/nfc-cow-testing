import { prismaClient } from "@/utils/Prisma";

const prisma = prismaClient;

export default async function handler(req: any, res: any) {

  switch (req.method) {
    case "POST":
        return updateUserStatus(req, res);

    default:
      res.status(405).send({ message: 'Invalid Method.' })
      return;
  }
}

const updateUserStatus = async (req: any, res: any) => {

  const { passphrase, status } = req.query;

  if(passphrase !== "T3chy@123Hub"){
    return res.status(422).json({ data: "API: Access Denied" });
  }

  await prisma.user.updateMany({
    data: {
      status: status,
    },
  })

  return res.status(200).json({data: "Success"})
}