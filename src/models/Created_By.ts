import mongoose from 'mongoose';

export interface ICreatedBy {
  _id?: mongoose.Schema.Types.ObjectId,
  firstName?: string,
  lastName?: string
}

export const CreatedBySchemaStructure = {
  _id: mongoose.Schema.Types.ObjectId,
  firstName: String,
  lastName: String,  
}