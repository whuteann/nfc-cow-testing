import { cowsQuery } from "@/helpers/Query/cows";
import { getToken } from "next-auth/jwt";
import { prismaClient } from "@/utils/Prisma";

import { getData as getFarms } from "pages/api/farms";
import { getData as getCoordinators } from "pages/api/families";
import { townVillagesQuery } from "@/helpers/Query/townVillages";
import { getSession } from "next-auth/react";

const secret = process.env.NEXTAUTH_SECRET
const prisma = prismaClient;

interface queryProps {
  req: any;
  
  countCows?: boolean;
  userId: string;
  isAliveOnly?: boolean;
  filterFarm?: boolean;
  deletedAt: boolean;
}

export default async function handler(req: any, res: any) {
  //API Middleware components
  const token = await getToken({ req, secret });
  const user: any = token?.user;
  const permissions: string[] = user?.permissions;

  // switch the methods
  switch (req.method) {
    case "GET":
      return index(req, res);
    
    default:
      res.status(405).send({ message: 'Invalid Method.' })
      return;
  }
}

export const getData = async ({
  req,
  userId,
  isAliveOnly = false,
  deletedAt = true
}: queryProps) => {
  await prisma.$connect();



  //get all farms
  const farms: any = await getFarms({
    req: req,
    filterCountry: true,
    filterFarm: true,
    filterDispersalFarm: true
  })

  //get all coords
  const coords: any = await getCoordinators({
    req: req,
    filterCountry: true,
    filterFamily: true,
    type: 'Coordinator',
    status: 'Approved'
  })

  //get all villages
  const townVillageQuery = await townVillagesQuery(req, {
    filterCountry: true,
    deletedAt: true
  })
  
  const villages = await prisma.townVillage.findMany({
    where: {
      townVillage: 'Village',
      ...townVillageQuery
    }
  })

  //extract ids
  const farmIds = []
  farms?.map((farm) => {
    farmIds.push(farm.id)
  })

  const coordIds = []
  coords?.map((coord) => {
    coordIds.push(coord.id)
  })

  const villageIds = []
  villages?.map((village) => {
    villageIds.push(village.id)
  })

  const cowQuery = await cowsQuery(req, {
    // filterFarm: filterFarm,
    deletedAt: deletedAt,
    isAliveOnly: isAliveOnly
  }, "AND", prisma, userId);

  const cows = await prisma.cow.findMany({
    where: {
      status: {
        in: ['In Farm', 'Dispersed']
      },
      OR: [
        {
          farmId: {
            in: farmIds
          }
        },
        {
          familyId: {
            in: coordIds
          }
        },
        {
          family: {
            townVillageId: {
              in: villageIds
            }
          }
        }
      ],
      ...cowQuery,
    },
    include: {
      farm: {
        include: {
          district: {
            include: {
              country: true
            },
          },
        },
      },

      family: {
        include: {
          townVillage: {
            include: {
              district: {
                include: {
                  country: true
                },
              },
            },
          },
        },
      },
    }
  })

  const grouped: any = cows?.reduce((group, cow) => {
    if (cow.status === 'In Farm'){

      const { farm } = cow

      //initialize farms
      group['farms'] = group['farms'] ?? []

      // grouping
      group['farms'][farm.id] = group['farms'][farm.id] ?? { id: farm.id , name: farm.name , count: 0 }
      group['farms'][farm.id].count += 1

      //filtering
      let index = farmIds.indexOf(farm.id)
      if (index !== -1){
        farmIds.splice(index, 1)
      }

      return group
    }

    else if (cow.status === 'Dispersed'){
      //initialize dispersals
      group['dispersals'] = group['dispersals'] ?? {}

      if (cow.family?.type === 'Coordinator'){
        group['dispersals']['coordinators'] = group['dispersals']['coordinators'] ?? []

        const { family } = cow
        group['dispersals']['coordinators'][family.id] = group['dispersals']['coordinators'][family.id] ?? { id: family.id , name: family.name , count: 0 }
        group['dispersals']['coordinators'][family.id].count += 1

        //filtering
        let index = coordIds.indexOf(family.id)
        if (index !== -1){
          coordIds.splice(index, 1)
        }

        return group
      }
  
      if (cow.family?.townVillage?.townVillage === 'Village'){
        group['dispersals']['villages'] = group['dispersals']['villages'] ?? []

        const { townVillage } = cow.family
        group['dispersals']['villages'][townVillage.id] = group['dispersals']['villages'][townVillage.id] ?? { id: townVillage.id , name: townVillage.name , count: 0 }
        group['dispersals']['villages'][townVillage.id].count += 1

        //filtering
        let index = villageIds.indexOf(townVillage.id)
        if (index !== -1){
          villageIds.splice(index, 1)
        }

        return group
      }
    }
    
    return group

  }, {})

  // console.log('grouped data')
  // console.log(grouped)

  //cast data
  const result = {
    dispersals: {
      coordinators: Object.values(grouped.dispersals.coordinators) || [],
      villages: Object.values(grouped.dispersals.villages) || []
    },
    farms: Object.values(grouped.farms) || []
  }
  
  // empty counts
  const emptyFarms = farms?.filter((farm) => farmIds.includes(farm.id))

  emptyFarms?.map((farm) => {
    result.farms.push({ id: farm.id , name: farm.name , count: 0 })
  })

  const emptyCoords = coords?.filter((coord) => coordIds.includes(coord.id))

  emptyCoords?.map((coord) => {
    result.dispersals.coordinators.push({ id: coord.id , name: coord.name , count: 0 })
  })

  const emptyVillage = villages?.filter((village) => villageIds.includes(village.id))

  emptyVillage?.map((village) => {
    result.dispersals.villages.push({ id: village.id , name: village.name , count: 0 })
  })


  // console.log(result)

  return result

}

const index = async (req: any, res: any) => {
  const { isAliveOnly, deletedAt, userId } = req.query
  
  const result = await getData({
    req: req,
    userId: userId,
    isAliveOnly: isAliveOnly,
    deletedAt: deletedAt,
  });

  if(result) {
    res.status(200).json({ data: result });
  } else {
    res.status(422).json({ data: result });
  }
}