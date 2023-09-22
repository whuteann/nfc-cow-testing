import Cow from "@/models/Cow";
// import { connectToDatabase } from "@/utils/MongoDB";
import { ObjectId } from "mongodb";
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

const getData = async (farm:string, family:string, nfcID:string) =>{
  let query: object = {status: { $ne: "Dead" }};

  if(farm) {
    query = { 
      ...query, 
      "farm._id": new ObjectId(farm)
    };
  }

  if(family) {
    query = { 
      ...query, 
      "family._id": new ObjectId(family)
    };
  }
  
  if(nfcID) {
    query = {
      ...query,
      nfcID : {'$regex' : nfcID, '$options': 'i'}
    }
  }

  const options = {
    page: 0,
    limit: 15
  };

  return (Cow as any).paginate(query, options)
    .then((cows: any) => {
      return cows;
    })
    .catch((error: any) => {
      return error;
    });
}

const index = async (req: any, res: any) => {
  const { farm, family, nfcID } = req.query;
  const result = await getData(farm, family, nfcID);

  if (result) {
    res.status(200).json({ data: result });
  } else{
    res.status(422).json({ data: result });
  }
}