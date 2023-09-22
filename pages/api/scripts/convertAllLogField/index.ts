import { prismaClient } from "@/utils/Prisma";

const prisma = prismaClient;

export default async function handler(req: any, res: any) {

  switch (req.method) {
    case "PUT":
      return convertAllLogField(req, res);

    default:
      res.status(405).send({ message: 'Invalid Method.' })
      return;
  }
}

const extractEditedFields = (str) => {
  const editedFields = str.match(/(?:edited\s)([\w\s,]+)/i);

  if (editedFields && editedFields[1]) {
    const fieldNames = editedFields[1]
      .split(',')
      .map((field) => {
        return { field: field.trim() };
      });

    return fieldNames;
  }

  return [];
};

const extractEditedFields2 = (str) => {
  const editedFields = str.match(/(?:from\s)([\w\s,]+)/i);

  if (editedFields && editedFields[1]) {
    const fieldNames = editedFields[1]
      .split(',')
      .map((field) => {
        return { field: field.trim() };
      });

    return fieldNames;
  }

  return [];
};


const convertAllLogField = async (req: any, res: any) => {

  const { passphrase } = req.query;

  if (passphrase !== "T3chy@123Hub") {
    return res.status(422).json({ data: `` });
  }

  const logs = await prisma.log.findMany();

  await Promise.all(logs.map(async (log) => {
    const regex = /\b(approved|rejected)\b/i;

    if (regex.test(log.message)) {
      log.editedFields = extractEditedFields2(log.message.replace(/\band\b/g, ","))
    } else {
      log.editedFields = extractEditedFields(log.message.replace(/\band\b/g, ","))
    }

    const newLog = {
      ...log
    }

    delete newLog.id;

    await prisma.log.update({
      where: {
        id: log.id
      },
      data: newLog
    })
  }));

  // const deleteResult = await prisma.log.deleteMany({
  //   where: {
  //     editedObject: undefined
  //   }
  // });



  return res.status(200).json({ data: "Success" })
}