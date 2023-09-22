import { parseToBoolean, pluck } from "@/helpers/app";
import { getSession } from "next-auth/react";

export const cowsQuery = async (req: any, query: object, operator: string = 'AND') => {
  let createQuery = [];
  
  const session:any = await getSession({ req });
  for (var property in query) {

    switch(property) {
      case 'search':
        if(query[property] != '') {
          createQuery.push({
            nfcId: {
              contains: query[property],
              mode: 'insensitive'
            }
          });
        }
        break;

      case 'gender':
        if(query[property] != '') {
          createQuery.push({
            gender: {
              in: query[property]
            }
          });
        }
        break;

      case 'nfcIdSearch':
        if(query[property] != '') {
          createQuery.push({
            nfcId: {
              contains: query[property],
              mode: 'insensitive'
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

      case 'familyIdSearch':
        if(query[property] != '') {
          createQuery.push({
            familyId: query[property]
          });
        }
        break;

      case 'farmIdSearch':
        if(query[property] != '') {
          createQuery.push({
            farmId: query[property]
          });
        }
        break;

      case 'farm': 
        if(query[property] != '') {
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
        const userFarms = (session as any)?.currentUser?.farms;

        query[property] = parseToBoolean(query[property])

        if(query[property] == true && userFarms?.length > 0) {

          if(userFarms?.length > 0) {
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

    case 'isAliveOnly':
      query[property] = parseToBoolean(query[property])
      
      if(query[property] == true) {
        createQuery.push({
          status: {
            not: 'Dead' || 'Sold'
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

    default:    
      break;
    }
  }

  return {
    [operator]: createQuery 
  } as any
}