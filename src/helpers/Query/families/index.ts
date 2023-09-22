import { parseToBoolean, pluck } from "@/helpers/app";
import { COORDINATOR_ROLE, SUPERVISOR_ROLE, TEAM_LEAD_ROLE } from "@/types/Common";
import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/react";

export const familiesQuery = async (req: any, prisma: PrismaClient, type: string, query: object, operator: string = 'AND') => {
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
          if(userCountries?.length > 0) {
            const filteredCountries = pluck(userCountries, 'id');

            createQuery.push({
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
            });
          }
        } else if (query[property] == true && userCountries?.length <= 0) {
          createQuery.push({
            townVillage: {
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

      case 'deletedAt':
        query[property] = parseToBoolean(query[property])

        if(query[property] == true) {
          createQuery.push({
            deleted: false
          });
        } 
        break;

      case 'type': 
        if(query[property] != '' && query[property] != "All" ) {
          createQuery.push({
            type: query[property]
          });
        }
        break;

      case 'townvillage': 
        if(query[property] != '') {
          createQuery.push({
            townVillage: {
              name: query[property]
            }
          });
        }
        break;

      case 'status': 
        if(query[property] != '') {
          createQuery.push({
            status: query[property]
          });
        }
        break;

      case 'hasNfcID':
        query[property] = parseToBoolean(query[property])

        if(query[property] == true) {
          createQuery.push({
            nfcID: {
              not: ""
            }
          });
        }
        break;

      case 'nfcID': 
        if(query[property] != '') {
          createQuery.push({
            nfcID: query[property]
          });
        }
        break;

      case 'filterFamily':
        query[property] = parseToBoolean(query[property])

        if(query[property] == true) {
          createQuery.push(await getFamilyFilter(session, prisma, type));
        }
        break;

      case 'coordinator': 
        if(query[property] != '') {
          createQuery.push({
            coordinator: {
              userId: query[property]
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

export const getFamilyFilter = async (session: any, prisma: PrismaClient, type: string) => {
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

      if (type == "Family"){
        filter = {
          coordinator: {
            is: {
              supervisorId: {
                in: supervisorIds
              }
            }
          }
        };
      } else if (type == "Coordinator") {
        filter = {
          supervisorId: {
            in: supervisorIds
          }
        };
      } else {
        filter = {
          OR: [
            {
              coordinator: {
                is: {
                  supervisorId: {
                    in: supervisorIds
                  }
                }
              },
            },
            {
              supervisorId: {
                in: supervisorIds
              }
            }
          ]
        };
      }
      break;
      
    case SUPERVISOR_ROLE:
      if (type == "Family"){
        filter = {
          coordinator: {
            is: {
              supervisorId: user?._id
            }
          }
        };
      } else if (type == "Coordinator") {
        filter = {
          supervisorId: user?._id
        }
      } else {
        filter = {
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
      break;

    case COORDINATOR_ROLE:
      const coordinator = await prisma.family.findFirst({
        where: {
          userId: user?._id
        },
        select: {
          id: true
        }
      });

      filter = {
        coordinatorId: coordinator?.id
      };
      break;

    default:
      break;    
  }

  return filter;
}