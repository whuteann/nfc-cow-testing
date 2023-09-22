import { getRolePermission, pluck, withCountryQuery } from "@/helpers/app";
import User from "@/models/User";
import { connectToRealm } from "@/utils/Realm";
import { connectToDatabase } from "@/utils/MongoDB";
import bcryptjs from 'bcryptjs';
import { MANAGE_USERS } from "@/permissions/Permissions";
import { getToken } from "next-auth/jwt";
import { createLogHelper } from "@/helpers/LogHelper";
import { getSession } from "next-auth/react";

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req: any, res: any) {
  await connectToDatabase();

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body : "12345",
  }

  await fetch(`${process.env.MONGODB_HTTP}/test?secret=${process.env.MONGODB_HTTP_SECRET}`, options)
    .then((res: any) => {
      if(!res.ok) {
        return Promise.reject(res);
      }

    })
    .catch(error => {
    });
}
