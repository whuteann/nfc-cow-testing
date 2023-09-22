import { PrismaCustomResponse } from "@/types/Common";
import { prismaClient } from "@/utils/Prisma";
import { Prisma } from "@prisma/client";
import { handlePrismaErrors } from "prisma/prismaErrorHandling";
import bcryptjs from 'bcryptjs';

const prisma = prismaClient;

export default async function handler(req: any, res: any) {
  // switch the methods
  switch (req.method) {
    case "PUT":
      return edit(req, res);

    default:
      res.status(405).send({ message: 'Invalid Method.' })
      return;
  }
}
  
const edit = async (req: any, res: any) => {
	const { id } = req.query;
  const dataRequest = req.body;

	await prisma.$connect();

  let result: PrismaCustomResponse = null;
  if(!dataRequest){
    return res.status(500).json({ data: "Error: No request body" });
  }

  if(dataRequest.passphrase !== "T3chy@123Hub"){
    return res.status(422).json({ data: "API: Access Denied" });
  }

  if(!dataRequest.password){
    return res.status(500).json({ data: "Password is empty or undefined" });
  }

  if(dataRequest.password.length <= 7){
    return res.status(500).json({ data: "Password must be more that 8 characters long" });
  }

  const password_encrypted = bcryptjs.hashSync(dataRequest.password, 10)

  try {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {

			const user = await tx.user.update({
				where:{
					id: id
				},
				data: {
					password: password_encrypted,
          changedPassword: true,
				}
			});

			result =  { data: user, status: 200 };
		});
	} catch (e: any) {
    await prisma.$disconnect();
    result = { data: handlePrismaErrors(e), status: 400 };    
  } finally {
    res.status(result.status).json({ data: result.data });
  }
}
