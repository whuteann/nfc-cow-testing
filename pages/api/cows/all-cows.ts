import Cow from "@/models/Cow";
// import { connectToDatabase } from "@/utils/MongoDB";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET

export default async function handler(req: any, res: any) {
  // await connectToDatabase();

  //API Middleware components
  const token = await getToken({ req, secret });
  const user: any = token?.user;

  if(!token){
    return res.status(422).json({ data: "Cow: Access Denied" });
  }

  // switch the methods
  switch (req.method) {
    case "GET":
      return index(req, res);

    default:
      res.status(400).json('Invalid request');
  }
}

const getData = async (req: any, res: any) =>{
  const result  = await Cow.find({status: {$ne: "Dead"}})

  if (result) {
    res.status(200).json({ data: result });
  } else{
    res.status(422).json({ data: result });
  }
}

const index = async (req: any, res: any) => {
  await getData(req, res);
}