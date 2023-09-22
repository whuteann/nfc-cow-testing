import { parseToBoolean, pluck, withCountryQuery } from "@/helpers/app";
import { getSession } from "next-auth/react";

export const districtsQuery = async (req: any, query: object, operator: string = 'AND') => {
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

      case 'country': 
        if(query[property] != '') {
          createQuery.push({
            country: {
              name: query[property]
            }
          });
        }
        break;

      case 'filterCountry': 
        const userCountries = (session as any)?.currentUser?.countries;

        query[property] = parseToBoolean(query[property])
        
        if(query[property] == true && userCountries?.length > 0) {

          if(userCountries?.length > 0) {
            const filteredCountries = pluck(userCountries, 'id');

            createQuery.push({
              country: {
                id: {
                  in: filteredCountries
                }
              }
            });
          }
        } else if (query[property] == true && userCountries?.length <= 0) {
          createQuery.push({
            country: {
              id: {
                in: []
              }
            }
          });
        }
        break;

      case 'filterDispersal':
        query[property] = parseToBoolean(query[property])

        if(query[property] == true) {
          createQuery.push({
            AND: [
              {
                name: {
                  not: {
                    contains: 'Dispersal'
                  }
                }
              },
              {
                name: {
                  not: {
                    contains: 'dispersal'
                  }
                }
              }
            ]
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
}