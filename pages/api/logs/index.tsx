import { prismaClient } from "@/utils/Prisma";

const prisma = prismaClient;

export default async function handler(req: any, res: any) {

  switch (req.method) {
    case "POST":
      return create(req, res);

        
    default:
      res.status(405).send({ message: "Invalid Method." });
      return;
  }
}

const create = async (req: any, res: any) =>{
  // const { data } = req.body;
  // let result: PrismaCustomResponse = null;

  // try {
  //   result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {

  //     const log = await tx.log.create({
  //       data: {
  //         ...data,
  //         user: {
  //           connect:{
  //             id: data.user._id
  //           }
  //         }
  //       }
  //     });

  //     return { data: log, status: 200 };
  //   });
  // } catch (e: any) {
  //   await prisma.$disconnect();

  //   result = { data: handlePrismaErrors(e), status: 400 };    
  // } finally {
  //   res.status(result.status).json({ data: result.data });
  // }
}