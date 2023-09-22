import { createLogHelper } from "@/helpers/LogHelper";
import FamilyCoordinator from "@/models/Family";
import { CREATE_FAMILIES_COORDINATORS, VIEW_FAMILIES_COORDINATORS } from "@/permissions/Permissions";
import { connectToDatabase } from "@/utils/MongoDB";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET

export default async function handler(req:any, res:any) {
  await connectToDatabase();

  //API Middleware components
  const token = await getToken({ req, secret });
  const user: any = token?.user;
  const permissions: string[] = user?.permissions;

  // switch the methods
  switch (req.method) {
    case 'GET':
      if(permissions.includes(VIEW_FAMILIES_COORDINATORS)){
        return index(req, res);
      }
      return res.status(422).json({ data: "Family/Coordinator: Access Denied" });
    default:
      res.status(405).send({ message: 'Invalid Method.' })
      return;
  }
}

export const getData = async (districtId: string) => {

  await connectToDatabase();
  var mongoose = require('mongoose');
  var objectId = mongoose.Types.ObjectId(districtId);

  return FamilyCoordinator.find({"townVillage.district._id" : objectId})
    .then((data) => {
      return data;
    })
    .catch((error) => {
      return error;
    });
}

const index = async (req: any, res: any) => {
    const {districtId} = req.query

    let result = await getData(districtId);

    if(result) {
      res.status(200).json({ data: result });
    } else {
      res.status(422).json({ data: result });
    }

};