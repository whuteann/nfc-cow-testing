import { parseToBoolean, pluck } from "@/helpers/app";
import { getSession } from "next-auth/react";

export const totalFarmCowsQuery = async (req: any, query: object, operator: string = 'AND') => {
  let createQuery = [];

  const session: any = await getSession({ req });

  for (var property in query) {

    switch (property) {
      case 'filterCountry':
        const userCountries = (session as any)?.currentUser?.countries;

        query[property] = parseToBoolean(query[property])

        if (query[property] == true && userCountries?.length > 0) {
          if (userCountries?.length > 0) {
            const filteredCountries = pluck(userCountries, 'id');

            createQuery.push({
              farm: {
                is: {
                  district: {
                    is: {
                      country: {
                        id: {
                          in: filteredCountries
                        }
                      }
                    }
                  }
                }
              }
            });
          }
        } else if (query[property] == true && userCountries?.length <= 0) {
          createQuery.push({
            farm: {
              is: {
                district: {
                  is: {
                    country: {
                      id: {
                        in: []
                      }
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

        query[property] = parseToBoolean(query[property]);
        
        
        if (query[property] == true && userFarms?.length > 0) {
          if (userFarms?.length > 0) {
            const filteredFarms = pluck(userFarms, 'id');


            createQuery.push({
              farmId: {
                  in: filteredFarms
              }
            });
          }

        } else if (query[property] == true && userFarms?.length <= 0) {
          createQuery.push({
            farm: {
              id: {
                in: []
              }
            }
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
