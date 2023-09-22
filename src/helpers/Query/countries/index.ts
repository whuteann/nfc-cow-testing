import { parseToBoolean, withCountryQuery } from "@/helpers/app";
import { getSession } from "next-auth/react";

export const countriesQuery = async (req: any, query: object, operator: string = 'AND') => {
  let createQuery = [];
  
  const session:any = await getSession({ req });
  for (var property in query) {
    switch(property) {
      case 'search': 
        if(query[property] != '') {
          createQuery.push({
            name: {
              contains: query[property],
              mode: 'insensitive'
            }
          });
        }
        break;

      case 'filterCountry': 
        const userCountries = (session as any)?.currentUser?.countries;

        query[property] = parseToBoolean(query[property])
        
        if(query[property] == true && userCountries?.length > 0) {
          query = withCountryQuery('id', userCountries);
          
          createQuery.push({
            ...query
          });
        } else if (query[property] == true && userCountries?.length <= 0) {
          createQuery.push({
            name: '-1'
          });
        }
        break;

      case 'deletedAt':
        query[property] = parseToBoolean(query[property])
        
        if(query[property] == true) {
          createQuery.push({
            deleted: false
          });
        } 
        break;

      default:    
        break;
    }
  }

  return {
    [operator]: createQuery 
  } as any

// {
  // AND: [
  //   {
  //     name: {
  //       contains: 'Lihao',
  //       mode: 'insensitive'
  //     },
  //   },
  //   {

  //     id: {
  //       in: []
  //     },
  //   },
  //   {
  //     deletedAt: null
  //   }
  // ]
// }
}