
import { getToken } from "next-auth/jwt";
import { prismaClient } from "@/utils/Prisma";
import { getData as getVisitations } from "../../familyVisitation";
import moment from "moment-timezone";

const secret = process.env.NEXTAUTH_SECRET
const prisma = prismaClient;

interface queryProps {
  req: any;

  coordinatorId?: string;
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
  coordinatorId = '',
}: queryProps) => {
  await prisma.$connect();

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

    const visitations = await getVisitations({
      req: req,
      familyIds: [coordinatorId],
      fromDate: moment().startOf('month').subtract(2, 'months').toISOString(),
      toDate: moment().endOf('month').toISOString() 
    })

    // console.log('visitations, mushrooms')
    // console.log(visitations)

    //process data based on date
    let visitationCount = {
      currentMonth: 0,
      lastMonth: 0,
      monthBeforeLastMonth: 0
    }

    if (visitations){
      console.log('dates')
      visitations.map((visitation) => {

        const monthDifference = Math.floor(moment().endOf('month').diff(visitation.visitationDate, 'months', true));

        switch (monthDifference){
          case 0:
            visitationCount.currentMonth += 1
            break;
          case 1:
            visitationCount.lastMonth += 1
            break;
          case 2:
            visitationCount.monthBeforeLastMonth += 1
          break;
          default:
            console.log('error value: ', monthDifference)
            break;
        }
      })
    }

    console.log(visitationCount)

    const counts = {
      cowCount: cowCount,
      familyCount: familyCount,
      visitationCount: visitationCount 
    }

    return counts
  }

}

const index = async (req: any, res: any) => {
  const { coordinatorId } = req.query
  
  const result = await getData({
    req: req,
    coordinatorId: coordinatorId,
  });

  if(result) {
    res.status(200).json({ data: result });
  } else {
    res.status(422).json({ data: result });
  }
}