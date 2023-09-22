import { ASSIGN_FAMILY_COW_DISPERSALS, CREATE_COW_PURCHASE_REQUESTS, CREATE_FAMILIES_COORDINATORS, CREATE_FARM_BREEDING_RECORDS, CREATE_FARM_COW_SALES, MANAGE_COUNTRIES, MANAGE_DISTRICTS, MANAGE_FARMS, MANAGE_TOWN_VILLAGES, MANAGE_USERS, REVIEW_COW_PURCHASE_REQUESTS, REVIEW_FAMILIES_COORDINATORS, REVIEW_FAMILY_COW_DISPERSALS, REVIEW_FARM_COW_SALES, VIEW_FAMILIES_COORDINATORS, VIEW_FAMILY_COW_DISPERSALS, VIEW_FARM_BREEDING_RECORDS } from "@/permissions/Permissions"
import type { JWT } from "next-auth/jwt"
import { NextResponse } from "next/server"

export default function dashboardMiddleware (token: JWT, pathname: string, permissions: string[]) {
  console.log("API MIDDLEWARE RAN")

  if(!token){
    console.log('if', process.env.NEXT_PUBLIC_PUBLIC_URL);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/login`);
  }

  console.log("pathname:", pathname)

  // AmazonS3 API (Image Upload)

  if (pathname.includes("/amazonS3")) {
    return NextResponse.next();
  }

  // Cows API (Not listed)

  if (pathname.includes("/cows")) {
    return NextResponse.next();
  }

  // MANAGE PERMISSIONS (CRUD)
    //  EDIT/CREATE

  if (pathname.includes("/users/") && permissions.includes(MANAGE_USERS)){
    return NextResponse.next();
  }

  if (pathname.includes("/countries/")){
    return NextResponse.next();
  }

  if (pathname.includes("/districts/") && permissions.includes(MANAGE_DISTRICTS)){
    return NextResponse.next();
  }

  if (pathname.includes("/townvillages/") && permissions.includes(MANAGE_TOWN_VILLAGES)){
    return NextResponse.next();
  }

  if (pathname.includes("/farms/") && permissions.includes(MANAGE_FARMS)){
    return NextResponse.next();
  }

  if ( pathname.endsWith("/users") || pathname.endsWith("/countries") || pathname.endsWith("/districts") || pathname.endsWith("/townvillages") || pathname.endsWith("/farms") ) {
    return NextResponse.next();
  }

  // COW PURCHASE REQUESTS (C,U)

  if (pathname.includes("/cowPurchaseRequests") && (permissions.includes(CREATE_COW_PURCHASE_REQUESTS) || permissions.includes(REVIEW_COW_PURCHASE_REQUESTS))){
    return NextResponse.next();
  }

  // FAMILIES & COORDINATORS (C,R,U)

  if (pathname.includes("/families") && permissions.includes(VIEW_FAMILIES_COORDINATORS)){

    // if (pathname.includes("/approval") && !permissions.includes(REVIEW_FAMILIES_COORDINATORS)){
    //   return NextResponse.redirect(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/dashboard`);
    // }

    // if (pathname.includes("/families/") && !permissions.includes(CREATE_FAMILIES_COORDINATORS)){
    //   return NextResponse.redirect(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/dashboard`);
    // }

    return NextResponse.next();
  }

  //REPORTS (R)
  if (pathname.includes("/reports") && permissions.includes(VIEW_FAMILIES_COORDINATORS)){
    return NextResponse.next();
  }


  // FAMILY COW DISPERSALS (C,R,U)

  if (pathname.includes("/cowdispersals") && permissions.includes(VIEW_FAMILY_COW_DISPERSALS)){

    // if (pathname.includes("/cowdispersals/") && (!permissions.includes(CREATE_FAMILIES_COORDINATORS) && !permissions.includes(REVIEW_FAMILY_COW_DISPERSALS))){
    //   return NextResponse.redirect(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/dashboard`);
    // }

    // if (pathname.includes("/assign") && !permissions.includes(ASSIGN_FAMILY_COW_DISPERSALS)){
    //   return NextResponse.redirect(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/dashboard`);
    // }

    return NextResponse.next();
  }

  // FARM COW SALES (C,R,U)

  if (pathname.includes("/cowFarmSaleRequests") && (permissions.includes(CREATE_FARM_COW_SALES) || permissions.includes(REVIEW_FARM_COW_SALES))){
    return NextResponse.next();
  }

  // FARM BREEDING RECORDS (C,R)

  if (pathname.includes("/breedingRecords") && (permissions.includes(VIEW_FARM_BREEDING_RECORDS) || permissions.includes(CREATE_FARM_BREEDING_RECORDS))){
    return NextResponse.next();
  }

  console.log("API PERMISSION DENIED");
  return NextResponse.next();
}
