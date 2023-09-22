import { parseToBoolean, pluck } from "@/helpers/app";
import { getSession } from "next-auth/react";

export const farmsQuery = async (req: any, query: object, operator: string = 'AND') => {
  let createQuery = [];

  const session:any = await getSession({ req });
  
  for (var property in query) {
    switch (property) {
      case 'search':
        if (query[property] != '') {
          createQuery.push({
            name: {
              contains: query[property],
              mode: 'insensitive'
            }
          });
        }
        break;

      // case 'country': 
      //   if(query[property] != '') {
      //     createQuery.push({
      //       district: {
      //         is: {
      //           country: {
      //             is: {
      //               name: query[property]
      //             }
      //           }
      //         }
      //       }
      //     });
      //   }
      //   break;

      case 'countries':
        if (query[property] != '') {
          createQuery.push({
            district: {
              is: {
                country: {
                  is: {
                    name: {
                      in: query[property]
                    }
                  }
                }
              }
            }
          });
        }
        break;

      case 'filterCountry': 
        const userCountries = (session as any)?.currentUser?.countries;
        query[property] = parseToBoolean(query[property])

        if (query[property] == true && userCountries?.length > 0) {

          if (userCountries?.length > 0) {
            const filteredCountries = pluck(userCountries, 'id');
            
            createQuery.push({
              district: {
                is: {
                  country: {
                    is: {
                      id: {
                        in: filteredCountries
                      }
                    }
                  }
                }
              }
            });
          }
        } else if (query[property] == true && userCountries?.length <= 0) {
          createQuery.push({
            district: {
              is: {
                country: {
                  is: {
                    id: {
                      in: []
                    }
                  }
                }
              }
            }
          });
        }
        break;

      case 'filterFarm': 
        const userFarms = (session as any)?.currentUser?.farms;
        query[property] = parseToBoolean(query[property])

        if (query[property] == true && userFarms?.length > 0) {
          if(userFarms?.length > 0) {
            const filteredFarms = pluck(userFarms, 'id');

            createQuery.push({
              id: {
                in: filteredFarms
              }
            });
          }
        } else if (query[property] == true && userFarms?.length <= 0) {
            createQuery.push({
              id: {
                in: []
              }
            });
        }
        break;

      case 'filterDispersalFarm': 
      query[property] = parseToBoolean(query[property])

      if (query[property] != '') {
        createQuery.push({
          name: {
            not: {
              contains: 'Dispersal'
            }
          }
        });
      }
      break;

      case 'deletedAt':
        query[property] = parseToBoolean(query[property])
        
        if (query[property] == true) {
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