import { totalFarmCowsQuery } from "@/helpers/Query/totalFarmCows";
import { prismaClient } from "@/utils/Prisma";

const prisma = prismaClient;

export default async function handler(req: any, res: any) {

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
  filterCountry,
  filterFarm,
}) => {
  await prisma.$connect();

  const searchQuery = await totalFarmCowsQuery(req, {
    filterCountry: filterCountry,
    filterFarm: filterFarm
  });

  const relations = {
    include: {
      farm: {
        include: {
          district: {
            include: {
              country: true
            }
          }
        }
      }
    }
  }

  return await prisma.totalFarmCows.findMany({
    where: {
      ...searchQuery,
      deletedAt: null
    },
    ...relations
  })
}


const index = async (req: any, res: any) => {

  const { filterCountry, filterFarm } = req.query;

  const result = await getData({ req: req, filterCountry: filterCountry, filterFarm: filterFarm })

  res.status(200).json({ data: result });
}