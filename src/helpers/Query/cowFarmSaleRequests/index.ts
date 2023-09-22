import { parseToBoolean, pluck } from "@/helpers/app";
import { getSession } from "next-auth/react";

export const cowFarmSaleRequestsQuery = async (req: any, query: object, operator: string = 'AND') => {
  let createQuery = [];
  
  const session:any = await getSession({ req });

  for (var property in query) {
    switch (property) {
      case 'search': 
        if(query[property] != '') {
          createQuery.push({
            farm: {
              is: {
                name: {
                  contains: query[property],
                  mode: 'insensitive'
                }
              }
            }
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

        case 'filterFarm': 
        const userFarms = (session as any)?.currentUser?.farms;
        query[property] = parseToBoolean(query[property])
        
        if(query[property] == true && userFarms?.length > 0) {

          if (userFarms?.length > 0){
            const filteredFarms = pluck(userFarms, 'id');
          
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

        } else if (query[property] == true && userFarms?.length <= 0) {         
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