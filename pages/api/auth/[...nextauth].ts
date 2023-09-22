import NextAuth from "next-auth"
import CredentialProvider from "next-auth/providers/credentials";
import bcryptjs from 'bcryptjs';
import console from "console";
import { NextApiRequest, NextApiResponse } from "next";
import { prismaClient } from "@/utils/Prisma";

const THIRTY_DAYS = 30 * 24 * 60 * 60
const THIRTY_MINUTES = 30 * 60

const prisma = prismaClient;

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, {
    providers: [
      CredentialProvider({
        name: 'crendentials',
        credentials: {
          email: { 
            label: 'Email', 
            type: 'email', 
          },
          password: {
            label: 'Password',
            type: 'password'
          }
        },
        authorize: async (credentials) => {
          await prisma.$connect();

          const email = credentials?.email;
          const password = credentials?.password;

          const user = await prisma.user.findUnique({
            where: {
              email: email,
            }
          });

          if (!user) {
            throw new Error('Invalid email or password');
          }

          if(user.status == "Inactive"){
            throw new Error('Account is no longer active');
          }

          const isMatch = await bcryptjs.compare(password!, user.password!);

          if(!isMatch) {
            throw new Error('Invalid email or password');
          }

          await prisma.$disconnect();
          
          return user;
        }
      })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
      strategy: 'jwt',
      maxAge: THIRTY_DAYS,
      updateAge: THIRTY_MINUTES
    },
    callbacks: {
      jwt: async ({ token, user }) => {      
        if (req.url.includes("update") || req.url.includes("credentials")) {        
          await prisma.$connect();

          const userData = await prisma.user.findUnique({
            where: {
              email: token.email,
            },
            include: {
              countries: true,
              farms: true
            }
          });

          const user = await prisma.user.findFirst({
            where: {
              email: token.email,
            }
          });

          console.log(user, token.email)

          const imageURL = JSON.parse(JSON.stringify(userData?.image));
            
          token.user = {
            _id : userData?.id,
            name: `${userData?.firstName} ${userData?.lastName}`,
            firstName: userData?.firstName,
            lastName: userData?.lastName,
            email: userData?.email,
            role: userData?.role,
            farm_role: userData?.farmRole,
            countries: userData?.countries,
            farms: userData?.farms,
            changedPassword: userData?.changedPassword,
            image: imageURL,
            permissions: userData?.permissions,
          }
        }

        return token;
      },
      session: ({ session, token }: any) => {
        session.currentUser = {
          _id : token?.user?._id,
          name: `${token?.user?.firstName} ${token?.user?.lastName}`,
          firstName: token?.user?.firstName,
          lastName: token?.user?.lastName,
          email: token?.user?.email,
          role: token?.user?.role,
          farm_role: token?.user?.farm_role,
          countries: token?.user?.countries,
          farms: token?.user?.farms,
          changedPassword: token?.user?.changedPassword,
          image: token?.user?.image,
          permissions: token?.user?.permissions,
        }

        return session
      },
      redirect: ({ url, baseUrl }) => {
        return url;
      }
    },
    pages: {
      signIn: '/login'
    }
  })
}