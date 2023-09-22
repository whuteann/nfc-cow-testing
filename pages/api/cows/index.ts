import prismaPaginator from "@/helpers/Paginator/PrismaPaginator";
import { cowsQuery } from "@/helpers/Query/cows";
import { getToken } from "next-auth/jwt";
import { prismaClient } from "@/utils/Prisma";
import Cow from "@/models/Cow";
import { getSession } from "next-auth/react";

const secret = process.env.NEXTAUTH_SECRET
const prisma = prismaClient;

interface queryProps {
  req: any,
  status?: any,
  cursor?: string,
  search?: string,
  sort?: string;
  page?: number;
  pageSize?: number;
  limit?: number;
  paginate?: boolean;

  gender?: string;
  noFamilySearch?: boolean;
  nfcIdSearch?: string;

  familyIdSearch?: string;
  farmIdSearch?: string;

  isAliveOnly?: boolean;
  countCows?: boolean;
  groupBy?: boolean;

  farm?: string;
  filterCountry?: boolean;
  filterFarm?: boolean;
  filterCountryFarm?: boolean;

  includeDispersalCows?: boolean;
}

export default async function handler(req: any, res: any) {
  //API Middleware components
  const token = await getToken({ req, secret });
  const user: any = token?.user;
  const permissions: string[] = user?.permissions;

  // switch the methods
  switch (req.method) {
    case "GET":
      if (token) {
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
  status = '',
  cursor = '',
  search = '',
  sort = '',
  limit = 10,
  paginate = false,
  gender = '',
  noFamilySearch = false,
  nfcIdSearch = '',
  familyIdSearch = '',
  farmIdSearch = '',
  countCows = false,
  groupBy = false,
  farm = '',
  filterCountry = false,
  filterFarm = false,
  isAliveOnly = false,
  filterCountryFarm = false,
  includeDispersalCows = false,
}: queryProps, res: any) => {
  await prisma.$connect();

  const session: any = await getSession({ req });

  //Initialize query with Current User Country Filter.
  var searchQuery = await cowsQuery(req, {
    status: status,
    search: search,
    gender: gender,
    noFamilySearch: noFamilySearch,
    nfcIdSearch: nfcIdSearch,
    familyIdSearch: familyIdSearch,
    farmIdSearch: farmIdSearch,
    countCows: countCows,
    farm: farm,
    filterCountry: filterCountry,
    filterFarm: filterFarm,
    isAliveOnly: isAliveOnly,
    deletedAt: true,
    filterCountryFarm: filterCountryFarm,
    includeDispersalCows: includeDispersalCows
  }, "AND", prisma, session.currentUser._id);

  if (countCows) {
    if (groupBy) {
      return await prisma.cow.groupBy({
        where: searchQuery,
        by: ["status"],
        _count: {
          _all: true,
        },
        orderBy: {
          status: "desc",
        }
      })
    }

    return await prisma.cow.count({
      where: searchQuery
    })
  }

  const relations = {
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
  }





  if (!paginate) {
    return await prisma.cow.findMany({
      where: searchQuery,
      ...relations
    })
  }

  // return res.status(200).json({ data: searchQuery });

  return await prismaPaginator({
    model: { name: 'cow' },
    cursor: cursor,
    size: parseInt(limit.toString()),
    buttonNum: 5,
    orderBy: 'secondaryId',
    where: searchQuery,
    ...relations,
    orderDirection: 'desc',
    prisma: prisma
  });
}

const index = async (req: any, res: any) => {
  const { status, cursor, limit, search, page, paginate, farm, gender, noFamilySearch, nfcIdSearch, familyIdSearch, farmIdSearch, countCows, groupBy, filterCountry, filterFarm, isAliveOnly, filterCountryFarm, includeDispersalCows } = req.query

  const result = await getData({
    req: req,
    status: status,
    cursor: cursor,
    page: page,
    limit: limit,
    search: search,
    paginate: paginate,

    farm: farm,
    gender: gender,
    noFamilySearch: noFamilySearch,
    nfcIdSearch: nfcIdSearch,
    familyIdSearch: familyIdSearch,
    farmIdSearch: farmIdSearch,
    countCows: countCows,
    groupBy: groupBy,
    // country: country,
    isAliveOnly: isAliveOnly,

    filterCountry: filterCountry,
    filterFarm: filterFarm,
    filterCountryFarm: filterCountryFarm,
    includeDispersalCows: includeDispersalCows,
  }, res);

  if (result || result == 0) {
    res.status(200).json({ data: result });
  } else {
    res.status(422).json({ data: result });
  }
}

const create = async (req: any, res: any) => {
  const data = req.body;
  const cows = data.cows;
  let newCows: any = [];
  cows.forEach((cow: any) => {
    if (cow.createCow == true) {
      //Remove empty properties in cow object.
      var filteredCow = JSON.parse(JSON.stringify(cow, function (key, value) { return (value === "") ? undefined : value }));
      newCows.push(filteredCow)
    }
  })

  //If there's no new cows then return.
  if (newCows.length == 0) {
    res.status(200).json({ data: "No New Cows" });
  }

  //Insert an array of cows to Database
  await Cow.insertMany(newCows)
    .then((data: any) => {
      res.status(200).json({ data: data });
    })
    .catch((error: any) => {
      res.status(422).json({ nfcID: "Please enter a unique National ID.", value: error.errors.nfcID.value });
    });
}