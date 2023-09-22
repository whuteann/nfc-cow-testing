import { parseToBoolean, pluck, withCountryQuery } from "@/helpers/app";
import { COORDINATOR_ROLE, SUPERVISOR_ROLE, TEAM_LEAD_ROLE } from "@/types/Common";
import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/react";

export const deathRecordsQuery = async (req: any, query: object, operator: string = 'AND', prisma) => {
  let createQuery = [];

  const session: any = await getSession({ req });

  for (var property in query) {
    switch (property) {
      case 'search':
        if (query[property] != '') {
          createQuery.push({
            cow: {
              is: {
                nfcId: {
                  contains: query[property],
                  mode: 'insensitive'
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

          if (userFarms?.length > 0) {
            const filteredFarms = pluck(userFarms, 'id');

            createQuery.push({
              'OR': [
                {
                  cow: {
                    is: {
                      farm: {
                        is: {
                          id: {
                            in: filteredFarms
                          },
                        }
                      }
                    }
                  }
                },
                {
                  cow: {
                    is: {
                      farm: {
                        is: {
                          name: {
                            contains: 'Dispersal',
                            mode: 'insensitive'
                          },
                        }
                      }
                    }
                  }
                },
              ]
            });
          }

        } else if (query[property] == true && userFarms?.length <= 0) {
          createQuery.push({
            'OR': [
              {
                cow: {
                  is: {
                    farm: {
                      is: {
                        id: {
                          in: []
                        },
                      }
                    }
                  }
                }
              },
              {
                cow: {
                  is: {
                    farm: {
                      is: {
                        name: {
                          contains: 'Dispersal',
                          mode: 'insensitive'
                        },
                      }
                    }
                  }
                }
              },
            ]
          });
        }
        break;

      case 'filterCountry':
        const userCountries = (session as any)?.currentUser?.countries;

        query[property] = parseToBoolean(query[property])

        if (query[property] == true && userCountries?.length > 0) {
          const filteredCountries = pluck(userCountries, 'id');

          createQuery.push({
            'OR': [
              {
                family: {
                  is: {
                    townVillage: {
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
                  }
                }
              },
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
              }
            ]
          });
        }
        break;

      case 'filterFamily':
        query[property] = parseToBoolean(query[property])

        if (query[property] == true) {
          createQuery.push(await getFamilyFilter(session, prisma));
        }
        break;

      case 'status':
        if (query[property] != '') {
          createQuery.push({
            status: query[property]
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

export const getFamilyFilter = async (session: any, prisma: PrismaClient) => {
  const user = session?.currentUser;
  let filter = {};

  switch (user?.role) {
    case TEAM_LEAD_ROLE:
      const supervisorsTiedWithTeamLead = await prisma.user.findMany({
        where: {
          teamLeadId: user?._id
        },
        select: {
          id: true
        }
      });

      const supervisorIds = supervisorsTiedWithTeamLead?.map((supervisor) => supervisor.id);

      filter = {
        family: {
          is: {
            OR: [
              {
                coordinator: {
                  is: {
                    supervisorId: {
                      in: supervisorIds
                    }
                  }
                }
              },

              {
                supervisorId: {
                  in: supervisorIds
                }
              },
            ]
          }
        }
      };
      break;

    case SUPERVISOR_ROLE:
      filter = {
        family: {
          is: {
            OR: [
              {
                coordinator: {
                  is: {
                    supervisorId: user?._id
                  }
                }
              },

              {
                supervisorId: user?._id
              }

            ]
          }
        }
      }
      break;

    case COORDINATOR_ROLE:
      filter = {
        family: {
          is: {
            coordinatorId: user?._id
          }
        }
      };
      break;

    default:
      break;
  }

  return filter;
}