import bcryptjs from 'bcryptjs';
import { MANAGE_USERS } from "@/permissions/Permissions";
import { getToken } from "next-auth/jwt";
import { prismaClient } from "@/utils/Prisma";
import { PrismaCustomResponse, SUPERVISOR_ROLE } from "@/types/Common";
import { Prisma } from "@prisma/client";
import { handlePrismaErrors } from "prisma/prismaErrorHandling";
import { getRolePermission } from '@/helpers/app';
import { createLogHelper } from '@/helpers/LogHelper';
import { connectToRealm } from '@/utils/Realm';

const secret = process.env.NEXTAUTH_SECRET;
const prisma = prismaClient;

interface UserProps {
  id: string,
  getPassword?: boolean
}

export default async function handler(req: any, res: any) {
  //API Middleware components
  const token = await getToken({ req, secret });
  const user: any = token?.user;
  const permissions: string[] = user?.permissions;

  const { id } = req.query;

  if (id == user?._id.toString()) {
    switch (req.method) {
      case "GET":
        return index(req, res);

      case "PUT":
        return edit(req, res, user);
        
      default:
        res.status(405).send({ message: 'Invalid Method.' })
        return;
    }
  }else{
    if (!permissions.includes(MANAGE_USERS)) {
      return res.status(422).json({ data: "UsersAPI: Access Denied" });
    }
  
    switch (req.method) {
      case "GET":
        return index(req, res);
  
      case "PUT":
        return edit(req, res, user);
  
      case "DELETE":
        return del(req, res, user);
  
      default:
        res.status(405).send({ message: 'Invalid Method.' })
        return;
    } 
  }
}

export const getData = async ({ id, getPassword = false }: UserProps) => {
  // Exclude keys from user
  function exclude<User, Key extends keyof User>(
    user: User,
    keys: Key[]
  ): Omit<User, Key> {
    for (let key of keys) {
      delete user[key]
    }
    return user
  }

  let returnUser = undefined;

  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: id
      },
      include: {
        countries: true,
        farms: true,
      }
    });


    if (getPassword && getPassword.toString() == "true") {
      return { password: user.password }
    } else {
      returnUser = exclude(user, ['password'])
    }

    return returnUser;


  } catch (e: any) {
    return null;
  }

}

const index = async (req: any, res: any) => {
  await prisma.$connect();

  const { getPassword, id } = req.query;

  const result = await getData({ id: id, getPassword: getPassword });

  res.status(200).json({ data: result });
}

const edit = async (req: any, res: any, user: any) => {
  const { id } = req.query;
  let dataRequest = req.body;
  let password_string = undefined;

  delete dataRequest['id'];

  if (dataRequest.password) {
    password_string = `${dataRequest.password}`;
    dataRequest.password = bcryptjs.hashSync(dataRequest?.password, 10)
  } else {
    delete dataRequest['password'];
  }

  await prisma.$connect();

  let result: PrismaCustomResponse = null;

  try {
    result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const userExist = await tx.user.findFirst({
        where: {
          id: {
            not: id
          },
          email: {
            equals: dataRequest?.email || ''
          }
        }
      });

      if (userExist) return { data: 'User already exist for this email', status: 422 }

      var permissions = undefined

      if (dataRequest.role || dataRequest.farm_role) {
        permissions = [
          ...getRolePermission(dataRequest?.role),
          ...getRolePermission(dataRequest?.farm_role),
        ]
      }


      const oldUser = await tx.user.findFirst({
        where: {
          id: id
        }
      })

      const user_created = await tx.user.update({
        where: {
          id: id
        },
        //data to be updated
        data: {
          firstName: dataRequest?.firstName,
          lastName: dataRequest?.lastName,
          password: !dataRequest.password ? undefined : dataRequest?.password,
          changedPassword: dataRequest.changedPassword,
          role: dataRequest?.role,
          farmRole: dataRequest?.farm_role,
          teamLeadId: dataRequest?.team_lead,
          supervisorId: dataRequest?.team_lead,
          countryIds: dataRequest?.countryIds,
          farmIds: dataRequest?.farmIds,
          image: dataRequest?.image,
          status: dataRequest?.status,
          permissions: permissions,
          updatedAt: new Date().toISOString(),
				}
			});

      //update families if old role was coordinator
      if (dataRequest.affected_families?.length > 0 && dataRequest.new_coordinators?.length > 0){
        dataRequest.affected_families.map(async (familyId, index) => {
          await prisma.family.update({
            where: {
              id: familyId
            },
            data: {
              coordinatorId: dataRequest.new_coordinators[index]
            }
          })
        })

      }

      if(dataRequest.password) {
        const realm = await connectToRealm(); 

        await realm.emailPasswordAuth.callResetPasswordFunction({ email: oldUser?.email, password: password_string}, [])
      }

      await createLogHelper(user, user_created, req.method, "users", tx, oldUser);

      return { data: user_created, status: 200 };
    });
  } catch (e: any) {
    await prisma.$disconnect();
    // result = { data: handlePrismaErrors(e), status: 400 };    
    result = { data: e, status: 400 };

  } finally {
    res.status(result.status).json({ data: result.data });
  }
}

const del = async (req: any, res: any, user: any) => {
  const { id } = req.query;

  await prisma.$connect();

  let result: PrismaCustomResponse = null;

  try {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const user_deleted = await tx.user.update({
        where: { id: id },
        data: {
          deleted: true,
          deletedAt: new Date()
        }
      });
  
      await createLogHelper(user, user_deleted, req.method, "users", tx);
  
      result = { data: 'Success', status: 200 };
    })
  } catch (e: any) {
    await prisma.$disconnect();
    result = { data: handlePrismaErrors(e), status: 400 };
  } finally {
    res.status(result.status).json({ data: result.data });
  }
}
