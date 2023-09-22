import Counter from "@/models/Counter"

export const createOrUpdateCounter = async (prisma: any, name: string) => {
  return await prisma.counter.upsert({
    where: {
      name: name,
    },
    update: {
      seq: {
        increment: 1
      }
    },
    create: {
      name: name,
      seq: 1
    },
  })
}

export const updateArraySecondaryID = async(idName:string, idSeq:string, array:any, database: any) => {
  const forLoop = array.map(async(data: any) => {
    const result = await Counter.findOne({id: idName})
    if(result){
      await Counter.findOneAndUpdate({id: idName}, {$inc: { seq: 1 } }, {new: true})
      .then(async(counter) => {
        const incremented_number = counter.seq
        const secondaryID = idSeq + incremented_number.toString()
        await database.findByIdAndUpdate(data._id, { "$set": {"secondaryId": secondaryID}})
      })
    } 
    else{
      const counterData = {
        id : idName,
        seq : 1
      }
      await Counter.create(counterData)
      const secondaryID = idSeq + "1" 
      await database.findByIdAndUpdate(data._id, { "$set": { "secondaryId": secondaryID}})
    } 
  })
  await Promise.all(forLoop)
}