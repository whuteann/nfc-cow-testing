import { createOrUpdateCounter } from "@/helpers/Counter";
import { createLogHelper } from "@/helpers/LogHelper";
import prismaPaginator from "@/helpers/Paginator/PrismaPaginator";
import { cowsQuery } from "@/helpers/Query/cows";
import { getToken } from "next-auth/jwt";
import { prismaClient } from "@/utils/Prisma";
import { getData as getVisitationCount } from "../../api/familyVisitation";
import { getData as getFarm } from "../farms/[id]";
import { getSession } from "next-auth/react";

const secret = process.env.NEXTAUTH_SECRET
const prisma = prismaClient;

interface queryProps {
  req: any;
  deletedAt: boolean;

  isAliveOnly?: boolean;
  countCows?: boolean;
  groupBy?: boolean;

  filterFarm?: boolean;

  coordinatorId?: string;
  fromDate?: any;
  toDate?: any;
}

export default async function handler(req: any, res: any) {
  //API Middleware components
  const token = await getToken({ req, secret });
  const user: any = token?.user;
  const permissions: string[] = user?.permissions;

  // switch the methods
  switch (req.method) {
    case "GET":
      if(token){
        return index(req, res);
      }
      return res.status(422).json({ data: "CowAPI: Access Denied" });
    
    // case 'POST':
    //   return create(req, res);
    
    default:
      res.status(405).send({ message: 'Invalid Method.' })
      return;
  }
}

export const getData = async ({
  req,
  countCows = false,
  groupBy = false,
  filterFarm = false,
  isAliveOnly = false,
  deletedAt = true,
  coordinatorId = '',
  fromDate = '',
  toDate = '',
}: queryProps) => {
  await prisma.$connect();

  const session: any = await getSession({ req });
  //report #1
    //Initialize query with Current User Country Filter.
    const cowCountQuery = await cowsQuery(req, {
      countCows: countCows,
      filterFarm: filterFarm,
      isAliveOnly: isAliveOnly,
      deletedAt: true,
    }, "AND", prisma, session.currentUser._id);

  if (countCows){
    if(groupBy) {
      const cowCountByFarmId = await prisma.cow.groupBy({
        where: cowCountQuery,
        by: ["farmId"],
        _count: {
          _all: true,
        },
        orderBy: {
          farmId: "desc",
        }
      })

      await prisma.farm.findMany({
        where: {
          id: {
            in: []
          }
        }
      })

      //cast data into pair value
      const dataArray = []

      if (cowCountByFarmId){
        cowCountByFarmId.map(async(item) => {
          await getFarm(item.farmId).then(
            (result) => {
              const data = {
                farm: result,
                count: item._count._all
              }
    
              dataArray.push(data)
            }
          )

        })

        console.log('dataArray')
        console.log(dataArray)
        
        return dataArray
      }
    }
  }
  
  //report #2
  if (coordinatorId != ''){
    const cowCount = await prisma.cow.aggregate({
      where: {
        family: {
          id: coordinatorId
        }
      },
      _count: {
        _all: true,
      }
    })

    const familyCount = await prisma.family.aggregate({
      where: {
        type: 'Family',
        coordinator: {
          id: coordinatorId
        }
      },
      _count: {
        _all: true,
      }
    })

    const visitationCount = await getVisitationCount({
      req: req,
      familyIds: [coordinatorId]
    })

    //process data based on date
    if (visitationCount){

    }

    const counts = {
      cowCount: cowCount,
      familyCount: familyCount
    }

    return counts
  }

    //report #3
  if (fromDate != '' || toDate != ''){

      //get active dispersals of family
      const cowDispersal = await prisma.cowDispersal.groupBy({
        where: {
          status: 'Completed',
          deletedAt: null,
          date: {
            lte: new Date(toDate),
            gte: new Date(fromDate)
          },
          family: {
            type: 'Family'
          }
        },
        by: ['familyId'],
        _count: {
          _all: true,
        },
        orderBy: {
          familyId: 'desc'
        }
      })
  
      const coordinatorIds = []
      cowDispersal.map((item) => {
        coordinatorIds.push(item.familyId)
      })
  
      //get coordinators
      if (coordinatorIds.length >= 0){
        const coordinators = await prisma.family.findMany({
          where: {
            id: {
              in: coordinatorIds
            }
          },
          orderBy: {
            id: 'desc'
          }
        })
  
        //return coordinators and count
        return cowDispersal
      }
  
  }

}

const index = async (req: any, res: any) => {
  const { countCows, groupBy, filterFarm, isAliveOnly, coordinatorId, fromDate, toDate, deletedAt } = req.query
  
  const result:any = await getData({
    req: req,

    countCows: countCows,
    groupBy: groupBy,
    isAliveOnly: isAliveOnly,
    deletedAt: deletedAt,

    filterFarm: filterFarm,

    coordinatorId: coordinatorId,
    fromDate: fromDate,
    toDate: toDate,
  });

  if(result || result == 0) {
    res.status(200).json({ data: result });
  } else {
    res.status(422).json({ data: result });
  }
}