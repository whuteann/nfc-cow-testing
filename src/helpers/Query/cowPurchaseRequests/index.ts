import { parseToBoolean, pluck } from "@/helpers/app";
import { getSession } from "next-auth/react";

export const cowPurchaseRequestsQuery = async (req: any, query: object, operator: string = 'AND') => {
  let createQuery = [];

  const session: any = await getSession({ req });

  for (var property in query) {
    switch (property) {
      case 'search':
        if (query[property] != '') {
          createQuery.push({
            'OR': [
              {
                farm: {
                  is: {
                    name: {
                      contains: query[property],
                      mode: 'insensitive'
                    }
                  }
                }
              },
              {
                reasonForPurchase: {
                  contains: query[property],
                  mode: 'insensitive'
                }
              }
            ]
          })
        }
        break;

        case 'filterFarm':
          const userFarms = (session as any)?.currentUser?.farms;
          const userCountries = (session as any)?.currentUser?.countries;
  
          query[property] = parseToBoolean(query[property]);
          
          const toIncludeDispersal = !parseToBoolean(query["includeDispersalCows"]);
  
          if (query[property] == true && userFarms?.length > 0) {
  
  
            if (userFarms?.length > 0) {
              const filteredFarms = pluck(userFarms, 'id');
              const filteredCountries = pluck(userCountries, "id");
  
              if (toIncludeDispersal) {
                createQuery.push(
                  {
                    farm: {
                      OR: [
                        {
                          AND: [
                            {
                              OR: [
                                {
                                  name: {
                                    contains: 'Dispersal'
                                  }
                                },
                                {
                                  name: {
                                    contains: 'dispersal'
                                  }
                                }
                              ]
                            },
                            {
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
                            }
                          ]
                        }, {
                          id: {
                            in: filteredFarms
                          }
                        }
                      ]
                    }
                  }
                );
              } else {
                createQuery.push({
                  farm: {
                    is: {
                      id: {
                        in: filteredFarms
                      }
                    }
                  }
                });
              }
            }
          } else if (query[property] == true && userFarms?.length <= 0) {
  
            if (toIncludeDispersal) {
              const filteredCountries = pluck(userCountries, "id");
  
              createQuery.push(
                {
                  farm: {
                    AND: [
                      {
                        OR: [
                          {
                            name: {
                              contains: 'Dispersal'
                            }
                          },
                          {
                            name: {
                              contains: 'dispersal'
                            }
                          }
                        ]
                      },
                      {
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
                      }
                    ]
                  }
                }
              );
            } else {
              createQuery.push({
                farm: {
                  is: {
                    id: {
                      in: []
                    }
                  }
                }
              });
            }
  
          }
          break;

      case 'status':
        if (query[property] != '') {
          createQuery.push({
            status: query[property]
          })
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