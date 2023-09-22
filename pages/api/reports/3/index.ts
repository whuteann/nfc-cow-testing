import { getToken } from "next-auth/jwt";
import { prismaClient } from "@/utils/Prisma";
import { getData as getVisitations } from "../../familyVisitation";
import moment from "moment-timezone";
import { cowDispersalsQuery } from "@/helpers/Query/cowDispersals";
import { familiesQuery } from "@/helpers/Query/families";

const secret = process.env.NEXTAUTH_SECRET
const prisma = prismaClient;

interface queryProps {
  req: any;
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
      return index(req, res);

    // case 'POST':
    //   return create(req, res);

    default:
      res.status(405).send({ message: 'Invalid Method.' })
      return;
  }
}

export const getData = async ({
  req,
  fromDate = null,
  toDate = null
}: queryProps) => {
  await prisma.$connect();

  //Initialize query with Filter.
  const cowDispersalQuery = await cowDispersalsQuery(req, prisma, {
    statuses: ['Completed', 'Sub-Completed'],
    filterFamily: true,
    filterCountry: true,
    deletedAt: true
  });

  //report #3
  if (fromDate != '' || toDate != '') {

    //get active dispersals of family
    const cowDispersal = await prisma.cowDispersal.groupBy({
      where: {
        date: {
          lte: new Date(toDate),
          gte: new Date(fromDate)
        },
        family: {
          type: 'Family'
        },
        ...cowDispersalQuery
      },
      by: ['familyId'],
      orderBy: {
        familyId: 'desc'
      }
    })

    const familyIds = []
    cowDispersal?.map((item) => {
      familyIds.push(item.familyId)
    })

    //get families with active dispersal
    const familyQuery = await familiesQuery(req, prisma, 'Family', {
      type: 'Family',
      filterCountry: true,
      filterFamily: true,
      deletedAt: true
    });

    if (familyIds.length >= 0) {
      const families = await prisma.family.findMany({
        where: {
          id: {
            in: familyIds
          },
          ...familyQuery,
        },
        include: {
          coordinator: true
        }
      })

      //get visitations of families with active dispersal
      const visitations = await getVisitations({
        req: req,
        familyIds: familyIds,
        fromDate: moment().startOf('month').subtract(1, 'months').toISOString(),
        toDate: moment().endOf('month').toISOString()
      })

      if (visitations) {
        const familiesByCoordinator = families?.reduce((group, family) => {
          // pack family and visitation
          let cumulativeVisits = 0
          let visitsCurrentMonth = 0
          let visitsLastMonth = 0

          visitations.map((visitation) => {
            if (visitation.familyId === family.id) {
              const monthDifference = Math.floor(moment().endOf('month').diff(visitation.visitationDate, 'months', true));
              monthDifference === 0 ? visitsCurrentMonth += 1 : visitsLastMonth += 1
              cumulativeVisits += 1
            }
          })

          const familyVisit = {
            family: family,
            visitsCurrentMonth: visitsCurrentMonth,
            visitsLastMonth: visitsLastMonth
          }

          //grouping
          const { coordinator } = family;
          group[coordinator.id] = group[coordinator.id] ?? { name: coordinator.name, families: [], count: 0 };
          group[coordinator.id].families.push(familyVisit);

          //accumulated visits
          group[coordinator.id].count ? (group[coordinator.id].count += cumulativeVisits) : group[coordinator.id].count = 0
          return group;
        }, {})

        const result = Object.values(familiesByCoordinator);

        // console.log('grouped Data')
        // console.log(result)

        //return coordinators and count
        return result
      }

    }

  }

}

const index = async (req: any, res: any) => {
  const { fromDate, toDate } = req.query

  console.log(fromDate, toDate);
  const result = await getData({
    req: req,
    fromDate: fromDate,
    toDate: toDate,
  });

  if (result) {
    res.status(200).json({ data: result });
  } else {
    res.status(422).json({ data: result });
  }
}