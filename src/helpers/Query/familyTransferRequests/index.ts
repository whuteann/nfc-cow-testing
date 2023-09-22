import { parseToBoolean, pluck } from "@/helpers/app";
import { COORDINATOR_ROLE, SUPERVISOR_ROLE, TEAM_LEAD_ROLE } from "@/types/Common";
import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/react";

export const familyTransferRequestsQuery = async (req: any, prisma: PrismaClient, query: object, operator: string = 'AND') => {
  let createQuery = [];

  const session:any = await getSession({ req });

  for (var property in query) {
    switch (property) {
      case 'search':
        if (query[property] != '') {
          createQuery.push({
            'OR': [
              {
                family1: {
                  is: {
                    name: {
                      contains: query[property],
                      mode: 'insensitive'
                    }
                  }
                }
              },
              {
                family2: {
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

      case 'filterFamily':
        query[property] = parseToBoolean(query[property])

        if(query[property] == true) {
          createQuery.push(await getFamilyFilter(session, prisma));
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
                  family1: {
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
                  family2: {
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
                }
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
          OR: [
            {
              family1: {
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
                    }
                  ]
                }
              }
            },
            {
              family2: {
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
                    }
                  ]
                }
              }
            },
          ]
        };
      break;

    case SUPERVISOR_ROLE:
      filter = {
        OR: [
          {
            family1: {
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
          },
          {
            family2: {
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
          },

        ]
      }
      break;

    case COORDINATOR_ROLE:
      filter = {
        OR: [
          {
            family1: {
              is: {
                coordinatorId: user?._id
              }
            }
          },
          {
            family2: {
              is: {
                coordinatorId: user?._id
              }
            }
          }
        ]
      };
      break;

    default:
      break;    
  }

  return filter;
}