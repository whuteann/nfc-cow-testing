import { withCountryQuery } from "@/helpers/app";
import Cow from "@/models/Cow";
// import { connectToDatabase } from "@/utils/MongoDB";
import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";

const secret = process.env.NEXTAUTH_SECRET

export default async function handler(req: any, res: any) {
  // await connectToDatabase();

  //API Middleware components
  const token = await getToken({ req, secret });

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

export const getData = async (req: any, gender: string, farms: string) => {
  let query: object = {status: { $ne: "Dead" }};
  
  if(gender) {
    query = { 
      ...query, 
      gender: gender
    };
  }

  if(farms) {
    query = { 
      ...query, 
      // "farm.name": {
      //   $in: farms.split(',')
      // } // TODO: Add farm to cow
    };
  }

  return Cow.find(query, (error: any, result: any) => {
    if (!error) {
      return result;
    } 
    else {
      return error;
    }
  }).clone();
}

const index = async (req: any, res: any) => {
  const { gender, farms } = req.query
  const result = await getData(req, gender, farms)

  if (result) {
    res.status(200).json({ data: result });
  } else{
    res.status(422).json({ data: result });
  }
}