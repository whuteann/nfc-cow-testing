import { COORDINATOR_ROLE, SUPERVISOR_ROLE, TEAM_LEAD_ROLE } from "@/types/Common";
import { PrismaClient } from "@prisma/client";
import { parseToBoolean, pluck, withCountryQuery } from "@/helpers/app";
import { getSession } from "next-auth/react";

export const usersQuery = async (req: any, prisma: PrismaClient, role: string, query: object, operator: string = 'AND') => {
  let createQuery = [];
  const session:any = await getSession({ req });
  
  for (var property in query) {
    switch(property) {
      case 'search':
        createQuery.push({
          'OR': [
            {
              email: {
                contains: query[property],
                mode: 'insensitive'
              }
            },
            {
              firstName: {
                contains: query[property],
                mode: 'insensitive'
              }
            },
            {
              lastName: {
                contains: query[property],
                mode: 'insensitive'
              }
            },
          ]
        });
        break;

      case 'firstName': 
        createQuery.push({
          email: {
            contains: query[property],
            mode: 'insensitive'
          }
        });
        break;

      case 'lastName': 
        createQuery.push({
          lastName: {
            contains: query[property],
            mode: 'insensitive'
          }
        });
        break;

      case 'role':
        if(query[property] != '') {
          createQuery.push({
            role: {
              equals: query[property],
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
              countryIds: {
                hasSome: filteredCountries 
              }
            });
          }
        } else if (query[property] == true && userCountries?.length <= 0) {
          createQuery.push({
            countryIds: {
              hasSome: [] 
            }
          });
        }
        break;

      case 'filterRole': 

        if(query[property] == true) {
          createQuery.push(await getRoleFilter(session, prisma, role));
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
      
        case 'status':
          const statuses = query[property];

          createQuery.push({
            status:{
              in: statuses.length > 0 ? statuses : ["Active", "Inactive"] 
            }
          })
        break;

      default:    
        break;
    }
  }

  return {
    [operator]: createQuery 
  } as any
}

const getRoleFilter = async (session: any, prisma: PrismaClient, role: string) => {
  const user = session?.currentUser;
  let filter = {};
  
  switch (user?.role) {
    case TEAM_LEAD_ROLE:
      if (role == TEAM_LEAD_ROLE){
        filter = {
          id: user?._id
        };
      } else if (role == SUPERVISOR_ROLE){
        filter = {
          teamLeadId: user?._id
        };
      } else if (role == COORDINATOR_ROLE) {
        const supervisorsTiedWithTeamLead = await prisma.user.findMany({
          where: {
            role: SUPERVISOR_ROLE,
            teamLeadId: user?._id
          },
          select: {
            id: true
          }
        });
  
        const supervisorIds = supervisorsTiedWithTeamLead?.map((supervisor) => supervisor.id);
  
        filter = {
          supervisorId: {
            in: supervisorIds
          }
        };
      }
      break;
      
    case SUPERVISOR_ROLE:
      if (role == SUPERVISOR_ROLE){
        filter = {
          id: user?._id
        };
      } if (role == COORDINATOR_ROLE) {
        filter = {
          supervisorId: user?._id
        };
      }
      break;

    case COORDINATOR_ROLE:
      filter = {
        id: user?._id
      };
      break;

    default:
      break;    
  }


  return filter;
}