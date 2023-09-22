import { MANAGE_DISTRICTS } from "@/permissions/Permissions";
import { getToken } from "next-auth/jwt";
import { prismaClient } from "@/utils/Prisma";
import { PrismaCustomResponse } from "@/types/Common";
import { Prisma } from "@prisma/client";
import { handlePrismaErrors } from "prisma/prismaErrorHandling";
import { createLogHelper } from "@/helpers/LogHelper";

const secret = process.env.NEXTAUTH_SECRET
const prisma = prismaClient;

export default async function handler(req: any, res: any) {
  //API Middleware components
  const token = await getToken({ req, secret });
  const user: any = token?.user;
  const permissions: string[] = user?.permissions;

  if(!permissions.includes(MANAGE_DISTRICTS)){
    return res.status(422).json({ data: "CowAPI: Access Denied" });
  }

  switch (req.method) {
    case "GET":
      return index(req, res);
    
    case 'PUT':
      return edit(req, res, user);
    
    default:
      res.status(405).send({ message: 'Invalid Method.' })
      return;
  }
}

const relations = {
  include:{
    farm: {
      include: {
        district: {
          include: {
            country: true
          },
        },
      },
    },

    family: {
      include: {
        townVillage: {
          include: {
            district: {
              include: {
                country: true
              },
            },
          },
        },
      },
    },
  }
}

export const getData = async (id: string) => {
	try {
		const cow = await prisma.cow.findFirst({
			where:{
				id: id
			},
      ...relations,
		});

		if(cow) {
			return cow;
		} else {
			return null;
		}
	} catch (e: any) {
		return null;
	}
}

const index = async (req: any, res: any) => {
  await prisma.$connect();

  const { id } = req.query;

  const cow = await getData(id);

	res.status(200).json({ data: cow });
}

const edit = async (req: any, res: any, user: any) => {
  const { id } = req.query;
  const dataRequest = req.body;

  await prisma.$connect();

  let result: PrismaCustomResponse = null;

  // const _id = req.query.id;
  // const {values} = req.body
  // const method = req.method

  // const oldData = await Cow.findById(_id).exec()

  try {
    result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const cowExist = await tx.cow.findFirst({
        where: {
          id: {
            not: id
          },
          nfcId: {
            equals: dataRequest?.nfcId,
            mode: "insensitive"
          },
          farmId: dataRequest?.farm
        }
      });

      if(cowExist) return { data: 'Cow already exist for this farm', status: 422 }

      const oldCow = await tx.cow.findFirst({
        where: {
          id: id
        }
      });

			const cow = await tx.cow.update({
				where: {
					id: id
				},
				data: {
					cowPhoto: dataRequest?.cowPhoto,
          updatedAt: new Date().toISOString()
				}
			});

      await createLogHelper(user, cow, req.method, 'cows', tx, oldCow);

			return { data: cow, status: 200 };
		});
	} catch (e: any) {
    await prisma.$disconnect();
    result = { data: handlePrismaErrors(e), status: 400 };    
  } finally {
    res.status(result.status).json({ data: result.data });
  }

  // await Cow.findByIdAndUpdate(_id, values)
  //   .then(async(cow) => {
  //     await createLogHelper(user, values, method , "cows", oldData)
  //     res.status(200).json({ data: cow });
  //   })
  //   .catch((error) => {
  //     res.status(422).json({ data: 'Duplicated Cow Name' });
  //   });
}

// // const update = async (req: any, res: any) => {
// //   const data = req.body;
// //   const cows = data.cows;
// //   let newCows: any = [];
// //   cows.forEach((cow: any) => {
// //     if(cow.createCow == true){
// //       //Remove empty properties in cow object.
// //       var filteredCow = JSON.parse(JSON.stringify(cow, function (key, value) {return (value === "") ? undefined : value}));
// //       newCows.push(filteredCow)
// //     }
// //   })
  
// //   //If there's no new cows then return.
// //   if(newCows.length == 0){
// //     res.status(200).json({ data: "No New Cows" });
// //   }
  
// //   //Insert an array of cows to Database
// //   await Cow.findByIdAndUpdate(newCows)
// //   .then((data: any) => {
// //     res.status(200).json({ data: data });
// //   })
// //   .catch((error: any) => {
// //     res.status(422).json({ nfcID: "Please enter a unique National ID." , value: error.errors.nfcID.value });
// //   });  
// }