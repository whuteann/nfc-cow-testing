import FamilyCoordinator, { IFamilyCoordinator } from "@/models/Family";
import Family_Rejection from "@/models/Families_Rejection";
import { REVIEW_FAMILIES_COORDINATORS } from "@/permissions/Permissions";
import { getToken } from "next-auth/jwt";
import { createLogHelper } from "@/helpers/LogHelper";
import { COORDINATOR } from "@/permissions/RolePermissions";
import User, { IUser } from "@/models/User";
import { createOrUpdateCounter } from "@/helpers/Counter";
import { connectToRealm } from "@/utils/Realm";
import bcryptjs from 'bcryptjs';
import { COORDINATOR_ROLE, EMAIL_PLACEHOLDER, PrismaCustomResponse } from "@/types/Common";
import { Prisma } from "@prisma/client";
import { handlePrismaErrors } from "prisma/prismaErrorHandling";
import { prismaClient } from "@/utils/Prisma";
import { USER_ID } from "@/types/Counter";
import { getRolePermission } from "@/helpers/app";

const secret = process.env.NEXTAUTH_SECRET
const prisma = prismaClient;

export default async function handler(req:any, res:any) {
  //API Middleware components
  const token = await getToken({ req, secret });
  const user: any = token?.user;
  const permissions: string[] = user?.permissions;

  // switch the methods
  switch (req.method) {
    case 'PUT': 
      if(permissions.includes(REVIEW_FAMILIES_COORDINATORS)){
        return edit(req, res, user);
      }
      return res.status(422).json({ data: "FarmCowSalesAPI: Access Denied" });

    default:
      res.status(405).send({ message: 'Invalid Method.' })
      return;
  }
}

const edit = async (req: any, res: any, currUser: any) => {
  const { id } = req.query;
  const dataRequest = req.body;

	await prisma.$connect();

  let result: PrismaCustomResponse = null;

  try {
    result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const familyExist = await tx.family.findFirst({
        where: {
          id: id
        },
        include: {
          townVillage: {
            include: {
              district: {
                include: {
                  country: true
                }
              }
            }
          }
        }
      });

      if(!familyExist || familyExist?.status == "Approved") return { data: 'Family does not exist or is already approved', status: 422 }

      let user: any = undefined;

      if(familyExist?.type == "Coordinator" && familyExist?.userId == null && dataRequest?.status == "Approved") {
        const newEmail = familyExist?.nationalID + EMAIL_PLACEHOLDER;
        const counter = await createOrUpdateCounter(tx, USER_ID);

        user = await tx.user.create({
          data: {
            secondaryId: `${counter?.name}${counter?.seq}`, 
            firstName: familyExist.name.split(" ")[0] || '-',
            lastName: familyExist.name.split(" ")[1] || '-',
            email: newEmail,
            password: bcryptjs.hashSync(familyExist?.nationalID, 10),
            role: COORDINATOR_ROLE,
            supervisorId: familyExist?.supervisorId,
            countryIds: [familyExist?.townVillage?.district?.country?.id],
            farmIds: [],
            image: familyExist?.headshot,
            permissions: getRolePermission(COORDINATOR_ROLE),
            joinedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            deletedAt: null
          }
        });

        try {
          const realm = await connectToRealm();
          let generatedPassword = familyExist?.nationalID;

          // Realm requires at least 6 char
          if(generatedPassword?.length < 6) {
            generatedPassword = generatedPassword + '@123';
          }

          await realm.emailPasswordAuth.registerUser({ 
            email: user?.email, 
            password: generatedPassword
          });  
        } catch {
          throw {
            data: "Something went wrong when registering with realm. National Id must be more than 6 characters as password.",
            status: 401,
          };
        }
      }

      const isNewUser = user 
        ?
          {
            userId: user?.id
          }
        :
          {};
        
      const oldFamily = await tx.family.findFirst({
        where: {
          id: id
        }
      })
      
			const family = await tx.family.update({
				where: {
					id: id
				},
        data: {
          ...isNewUser,
          status: dataRequest?.status,
          rejectedReason: dataRequest?.rejectionReason,
        }
			});
      
      await createLogHelper(currUser, family, req.method, family.type, tx, oldFamily, dataRequest?.status)

			return { data: family, status: 200 };
		});
	} catch (e: any) {
    await prisma.$disconnect();
    result = { data: handlePrismaErrors(e), status: 400 };    
  } finally {
    res.status(result.status).json({ data: result.data });
  }
}

// const updateStatus = async (req: any, res: any, user: any) => {
//   const {id} = req.query
//   var mongoose = require('mongoose');
//   var objectId = mongoose.Types.ObjectId(id);
//   const newData = req.body.values
//   const method = req.method

//   const oldData = await FamilyCoordinator.findById(id).exec() 
//   const familyRejectionData = {
//     familyID : id,
//     rejectedReason : req.body.rejectionReason,
//     createdBy : user
//   }

//   //Function to Convert and Insert Family(Coordinator) to User(Coordinator)
//   const createCoordinatorUser = async (coordinator: IFamilyCoordinator) => {
//     const newEmail = coordinator.nationalID+"@mail.com";
    
//     const coordinatorUser: any = {
//       firstName: coordinator.name.split(" ")[0],
//       lastName: coordinator.name.split(" ")[-1],
//       email: newEmail,
//       password: bcryptjs.hashSync(coordinator.nationalID),
//       role: COORDINATOR_ROLE,
//       countries: [coordinator.townVillage.district.country],
//       farms: [],
//       permissions: COORDINATOR,
//       image: coordinator.headshot,
//       joinedAt: new Date().toISOString(),
//       createdBy: user,
//     }
//     const email = coordinatorUser.email;
//     const password = coordinatorUser.password;

//     await User.create(coordinatorUser)
//     .then(async (user: IUser) => {
//       const realm = await connectToRealm();
//       await realm.emailPasswordAuth.registerUser({ email, password });
//       await createLogHelper(user, coordinatorUser, "POST" , "users")
//       //Update secondary ID
//       // await updateSecondaryID("userID", "US_", user._id, User)
//     })
//     .catch((error) => {
//       const message: string = 'The email is already taken.';
//     }); 
//   }

//   await FamilyCoordinator.findByIdAndUpdate(objectId, { "$set": { "status": req.body.approval, "rejectedReason": req.body.rejectionReason}})
//   .then(async(data: any) => {
//     //Approved : Create new user (ROLE: Coordinator)
//     if (newData.type == "Coordinator" && newData.status == "Approved"){
//       createCoordinatorUser(newData);
//     }
//     //Rejected : Create new Family_Rejection
//     else if (newData.status == "Rejected"){
//       await Family_Rejection.create(familyRejectionData)
//       .then(async(data: any) => {
//       })
//       .catch((error) => {
//       })
//     }
    
//     //Filter out not needed fields
//     Object.keys(newData).forEach(key => {
//       if (newData[key] === '' || newData[key] === true || newData[key] === false) {
//         delete newData[key];
//       }
//     });
//     await createLogHelper(user, newData , method , "families", oldData, req.body.approval) 
//     res.status(200).json({ data: data });
//   })
//   .catch((error) => {
//     res.status(422).json({ data: {nationalID: "Please enter a unique National ID." }});
//   });

// };