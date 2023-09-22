import prismaPaginator from "@/helpers/Paginator/PrismaPaginator";
import { prismaClient } from "@/utils/Prisma";

type queryProps = {
  id: string,
  cursor?: string,
  limit?: number,
  page?: number,
}
const prisma = prismaClient;

export default async function handler(req: any, res: any) {

  switch (req.method) {
    case "GET":
      return index(req, res);

    default:
      res.status(405).send({ message: "Invalid Method." });
      return;
  }
}

export const getData = async ({
  id,
  cursor = '',
  limit = 10,
  page = 1,
}: queryProps) => {

  const searchQuery = {
    documentId: id
  }

  return await prismaPaginator({
    model: { name: 'log' },
    cursor: cursor,
    size: parseInt(limit.toString()),
    buttonNum: 5,
    orderBy: 'createdAt',
    where: searchQuery,
    orderDirection: 'desc',
    prisma: prisma
  });
}

export const getOne = async ({
  id
}: any) =>{
  
  const log = await prisma.log.findFirst({
    where: {
      id: id
    },
  })

  return log
}

const index = async (req: any, res: any) => {
  const { id, page, limit, cursor } = req.query;


  const result = await getData({
    page: page,
    limit: limit,
    id: id,
    cursor: cursor
  });


  if (result) {
    res.status(200).json({ data: result });
  } else {
    res.status(422).json({ data: result });
  }
}