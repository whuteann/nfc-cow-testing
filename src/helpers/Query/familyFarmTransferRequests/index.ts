import { parseToBoolean, pluck } from "@/helpers/app";
import { getSession } from "next-auth/react";

export const familyFarmTransferRequestsQuery = async (req: any, query: object, operator: string = 'AND') => {
  let createQuery = [];

  const session:any = await getSession({ req });

  for (var property in query) {
    switch (property) {
      case 'search':
        if (query[property] != '') {
          createQuery.push({
            'OR': [
              {
                family: {
                  is: {
                    name: {
                      contains: query[property],
                      mode: 'insensitive'
                    }
                  }
                }
              },
              {
                farm: {
                  is: {
                    name: {
                      contains: query[property],
                      mode: 'insensitive'
                    }
                  }
                }
              }
            ]
          })
        }
        break;

        case 'filterCountry': 
        const userCountries = (session as any)?.currentUser?.countries;
        query[property] = parseToBoolean(query[property])

        if(query[property] == true && userCountries?.length > 0) {
          if(userCountries?.length > 0) {
            const filteredCountries = pluck(userCountries, 'id');
            createQuery.push({
              'OR': [
                {
                  farm: {
                    is: {
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
                  }
                },
                {
                  family: {
                    is: {
                      townVillage: {
                        is: {
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
                      }
                    }
                  }
                },
              ]
            });
          }
        } else if (query[property] == true && userCountries?.length <= 0) {
          createQuery.push({
            'OR': [
              {
                farm: {
                  is: {
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
                  }
                }
              },
              {
                family: {
                  is: {
                    townVillage: {
                      is: {
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
                      }
                    }
                  }
                }
              },
            ]
          });
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
        if (query[property] == true) {
          createQuery.push({
            deletedAt: null
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