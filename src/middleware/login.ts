import type { JWT } from "next-auth/jwt"
import { NextResponse } from "next/server"

export default function dashboardMiddleware (token: JWT, pathname: string = null, permissions: string[] = null) {
  if(token) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/dashboard`);
  }
  return NextResponse.next();
}
