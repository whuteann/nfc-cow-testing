import { Prisma } from "@prisma/client";
import _ from "lodash";

export const createLogHelper = async (
  user: any,
  newData: any,
  method: any,
  collection: any,
  prisma: Prisma.TransactionClient,
  oldData: any = undefined, approval: any = undefined
) => {

  let fields: any = undefined;
  let message: string = "";
  const ignoreOldDataFields = ["deleted", "updatedAt", "__v"]

  const getDiff = (newDt: any, oldDt: any) => {
    return _.reduce(newDt, function (result, value, key) {
      return _.isEqual(value, oldDt[key]) ?
        result : result.concat({"field": key});
    }, []);
  }

  if (approval) {
    //Filter oldData
    ignoreOldDataFields.forEach((field) => {
      delete oldData[field]
      delete newData[field]
    })
    // Filter out fields that are not needed
    const ignoreFields = ["password"]
    fields = getDiff(newData, oldData);
    ignoreFields.map((field) => {
      fields = fields.filter((e: any) => e.field !== field);
    })
    //Message generator
    const id = (oldData.id).toString()
    const lowercaseApproval = approval.toLowerCase()
    message = `${user.name} has ${lowercaseApproval} ID ${id} from ${collection?.replace("_", " ").toLowerCase()}`
  }

  else if (method === "PUT") {
    //Filter oldData

    ignoreOldDataFields.forEach((field) => {
      delete oldData[field]
      delete newData[field]
    })
    // Filter out fields that are not needed
    const ignoreFields = ["changedPassword", "password"]
    fields = getDiff(newData, oldData);
    ignoreFields.map((field) => {
      fields = fields.filter((e: any) => e.field !== field);
    })

    //Message generator
    message = `${user.name} has edited `
    fields.map((item: any, index: any) => {
      if (index === fields.length - 2) {
        message = message + item.field.replace("Id", "") + ",and "
      }
      else if (index === fields.length - 1) {
        message = message + item.field.replace("Id", "")
      }
      else {
        message = message + item.field.replace("Id", "") + ", "
      }
    })
  }

  else if (method === "POST") {
    //Message generator
    message = `${user.name} has created a new ${collection?.replace("_", " ").toLowerCase()} document`
  }

  else if (method === "DELETE") {
    //Message generator
    const id = (newData.id).toString()
    message = `${user.name} has deleted ID ${id} from ${collection?.replace("_", " ").toLowerCase()}`
  }

  const data = {
    user: user,
    method: method,
    oldObject: oldData,
    editedObject: newData,
    documentId: newData.id,
    editedFields: fields || [],
    message: message,
    collectionName: collection.toLowerCase()
  }

  const log = await prisma.log.create({
    data: {
      ...data,
      user: {
        connect: {
          id: user._id
        }
      }
    }
  });


}