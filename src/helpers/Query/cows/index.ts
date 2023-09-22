import { parseToBoolean, pluck } from "@/helpers/app";
import { PrismaClient } from "@prisma/client";

export const cowsQuery = async (req: any, query: object, operator: string = 'AND', prisma: PrismaClient, userId: string) => {
  let createQuery = [];

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    include: {
      countries: true,
      farms: true
    }
  });

  for (var property in query) {

    switch (property) {
      case 'search':
        if (query[property] != '') {
          createQuery.push({
            nfcId: {
              contains: query[property],
              mode: 'insensitive'
            }
          });
        }
        break;

      case 'gender':
        if (query[property] != '') {
          createQuery.push({
            gender: {
              in: query[property]
            }
          });
        }
        break;

      case 'nfcIdSearch':
        if (query[property] != '') {
          createQuery.push({
            nfcId: {
              contains: query[property],
              mode: 'insensitive'
            }
          });
        }
        break;

      case 'status':
        if (query[property] != '') {
          createQuery.push({
            status: {
              in: query[property].split(",")
            }
          });
        }
        break;

      case 'familyIdSearch':
        if (query[property] != '') {
          createQuery.push({
            familyId: query[property]
          });
        }
        break;

      case 'farmIdSearch':
        if (query[property] != '') {
          createQuery.push({
            farmId: query[property]
          });
        }
        break;

      case 'farm':
        if (query[property] != '') {
          createQuery.push({
            farm: {
              is: {
                name: {
                  in: query[property]
                }
              }
            }
          });
        }
        break;

      case 'filterFarm':
        const userFarms = user.farms;
        const userCountries = user.countries;

        query[property] = parseToBoolean(query[property]);
        const toIncludeDispersal = parseToBoolean(query["includeDispersalCows"]);


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

      case 'isAliveOnly':
        query[property] = parseToBoolean(query[property])

        if (query[property] == true) {

          createQuery.push({
            status: {
              not: 'Dead' || 'Sold'
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