import { NextRequest, NextResponse } from "next/server"
import type { JWT } from "next-auth/jwt"
import { withAuth } from "next-auth/middleware"
import { IUser } from "./src/models/User";
import dashboardMiddleware from "./src/middleware/dashboard";
import loginMiddleware from "./src/middleware/login";

export default withAuth(
  async function middleware(req: NextRequest & { nextauth?: { token: JWT } }) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname || '';
    const user: IUser = token?.user;
    const permissions: string[] = user?.permissions;

    if (pathname == '/') {
      if (token) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/dashboard`);
      }

      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/login`);
    }

    if (pathname.includes('/login')) {
      return loginMiddleware(token);
    }

    if (pathname.includes('/dashboard')) {
      return dashboardMiddleware(token, pathname, permissions, user);
    }
  }
  ,
  {
    callbacks: {
      authorized: ({ token }) => true,
    }
  }
)

export const config = {
  matcher: ['/', '/login', '/dashboard/:path*'],
}