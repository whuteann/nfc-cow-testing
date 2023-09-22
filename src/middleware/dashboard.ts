import { ASSIGN_FAMILY_COW_DISPERSALS, CREATE_COW_PURCHASE_REQUESTS, CREATE_FAMILIES_COORDINATORS, CREATE_FAMILY_COW_DISPERSALS, CREATE_FARM_BREEDING_RECORDS, CREATE_FARM_COW_SALES, MANAGE_COUNTRIES, MANAGE_DISTRICTS, MANAGE_FARMS, MANAGE_TOWN_VILLAGES, MANAGE_USERS, REVIEW_COW_PURCHASE_REQUESTS, REVIEW_FAMILIES_COORDINATORS, REVIEW_FAMILY_COW_DISPERSALS, REVIEW_FARM_COW_SALES, VIEW_FAMILIES_COORDINATORS, VIEW_FAMILY_COW_DISPERSALS, VIEW_FARM_BREEDING_RECORDS, CREATE_FAMILY_FARM_TRANSFER_REQUESTS } from "@/permissions/Permissions"
import type { JWT } from "next-auth/jwt"
import { NextResponse } from "next/server"

export default function dashboardMiddleware ( token: JWT, pathname: string, permissions: string[], user: any ) {
  console.log("DASHBOARD MIDDLEWARE RAN")

  if(!token){
    console.log('if', process.env.NEXT_PUBLIC_PUBLIC_URL);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/login`);
  }

  if(!user?.changedPassword){
    if(pathname.includes("/dashboard/change-password/")){
      return NextResponse.next();
    }
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/dashboard/change-password/${user?._id}`);
  }
  // Main Dashboard

  if (pathname.endsWith("/dashboard") || pathname.endsWith("/dashboard.js")){
    console.log("Dashboard");
    return NextResponse.next();
  }

  // MANAGE PERMISSIONS (CRUD)

  if (pathname.includes("/users") && permissions.includes(MANAGE_USERS)){
    console.log("USERS GRANTED");
    return NextResponse.next();
  }

  if (pathname.includes("/countries") && permissions.includes(MANAGE_COUNTRIES) ){
    console.log("COUNTRIES GRANTED");
    return NextResponse.next();
  }

  if (pathname.includes("/districts") && permissions.includes(MANAGE_DISTRICTS)){
    console.log("DISTRICTS GRANTED");
    return NextResponse.next();
  }

  if (pathname.includes("/townvillages") && permissions.includes(MANAGE_TOWN_VILLAGES)){
    console.log("TOWNVILAGES GRANTED");
    return NextResponse.next();
  }

  if (pathname.includes("/farms") && permissions.includes(MANAGE_FARMS)){
    console.log("FARMS GRANTED");
    return NextResponse.next();
  }

  // COW PURCHASE REQUESTS (C,U)
  if (pathname.includes("/cow-purchase-requests") && permissions.includes(CREATE_COW_PURCHASE_REQUESTS)){
    return NextResponse.next();
  }

  if (pathname.includes("/cow-purchase-requests/create") && permissions.includes(CREATE_COW_PURCHASE_REQUESTS)){
    console.log("COW PURCHASE REQUEST CREATE GRANTED");
    return NextResponse.next();
  }

  if (pathname.includes("/cow-purchase-requests/approval") && permissions.includes(REVIEW_COW_PURCHASE_REQUESTS)){
    console.log("COW PURCHASE REQUEST APPROVAL GRANTED");
    return NextResponse.next();
  }

  // FAMILIES & COORDINATORS (C,R,U)

  if ((pathname.includes("/families") || pathname.includes("/coordinators")) && permissions.includes(VIEW_FAMILIES_COORDINATORS)){

    if (( pathname.includes("/create") || pathname.includes("/edit") ) && !permissions.includes(CREATE_FAMILIES_COORDINATORS)){
      console.log("FAMILIES/COORDINATORS CREATE DENIED");
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/dashboard`);
    }

    if (pathname.includes("/approvals") && !permissions.includes(REVIEW_FAMILIES_COORDINATORS)){
      console.log("FAMILIES/COORDINATORS REVIEW DENIED");
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/dashboard`);
    }

    console.log("FAMILIES/COORDINATORS GRANTED");
    return NextResponse.next();
  }

  // REPORTS (R)

  if (pathname.includes("/reports") && permissions.includes(VIEW_FAMILIES_COORDINATORS)){
    console.log("REPORTS GRANTED");
    return NextResponse.next();
  }

  // FAMILY COW DISPERSALS (C,R,U)

  if (pathname.includes("/cow-dispersals") && permissions.includes(VIEW_FAMILY_COW_DISPERSALS)){

    if (( pathname.includes("/create") || pathname.includes("/edit") ) && !permissions.includes(CREATE_FAMILY_COW_DISPERSALS)){
      console.log("FAMILY COW DISPERSAL CREATE DENIED");
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/dashboard`);
    }

    if (pathname.includes("/approvals") && !permissions.includes(REVIEW_FAMILY_COW_DISPERSALS)){
      console.log("FAMILY COW DISPERSAL REVIEW DENIED");
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/dashboard`);
    }

    if (pathname.includes("/assign") && !permissions.includes(ASSIGN_FAMILY_COW_DISPERSALS)){
      console.log("FAMILY COW DISPERSAL ASSIGN DENIED");
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/dashboard`);
    }

    console.log("FAMILY COW DISPERSAL GRANTED");
    return NextResponse.next();
  }

  // FARM COW SALES (C,R,U)

  if (pathname.includes("/cow-farm-sale-requests") && permissions.includes(CREATE_FARM_COW_SALES)){
    console.log("FARM COW SALES CREATE GRANTED");
    return NextResponse.next();
  }

  if (pathname.includes("/cow-farm-sale-requests/approval") && permissions.includes(REVIEW_FARM_COW_SALES)){
    console.log("FARM COW SALES APPROVAL GRANTED");
    return NextResponse.next();
  }

  // FARM BREEDING RECORDS (C,R)

  if (pathname.includes("/farm-birth-records") && permissions.includes(VIEW_FARM_BREEDING_RECORDS)){

    if (( pathname.includes("/create") || pathname.includes("/edit") ) && !permissions.includes(CREATE_FARM_BREEDING_RECORDS)){
      console.log("FAMILIES/COORDINATORS CREATE DENIED");
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/dashboard`);
    }

    return NextResponse.next();
  }

  //FAMILY BREEDING RECORDS
  if (pathname.includes("/family-birth-records") && permissions.includes(VIEW_FARM_BREEDING_RECORDS)){

    return NextResponse.next();
  }


  //COW DEATHS
  if(pathname.includes("/cow-deaths")){
    return NextResponse.next();
  }

  // COW RECORDS (R)

  if (pathname.includes("/cows")){
    return NextResponse.next();
  }

  // FAMILY TRANSFER REQUESTS (U)

  if (pathname.includes("/family-transfer-requests")){
    return NextResponse.next();
  }

  // USER PROFILE

  if (pathname.includes("/profile")){
    console.log("USER PROFILE APPROVAL GRANTED");
    return NextResponse.next();
  }

  // Family Farm Transfer (C, R)

  if (pathname.includes("/family-farm-transfer-requests") && permissions.includes(CREATE_FAMILY_FARM_TRANSFER_REQUESTS)){
    console.log("FAMILY TO FARM TRANSFER CREATE GRANTED");
    return NextResponse.next();
  }
  
  //Logs
  if(pathname.includes("/logs")){
    return NextResponse.next();
  }

  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/dashboard`);
}
