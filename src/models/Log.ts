import mongoose from 'mongoose'
import mongoosePaginate from "mongoose-paginate-v2";

export interface ILog {
  _id?: string,
  user: object,
  method: string,
  oldObject : object,
  editedObject : object,
  editedFields : string[],
  message : string,
  collectionName : string,
}

export const logSchema = new mongoose.Schema<ILog>({
  user : {type : Object},
  method: {type : String},
  oldObject: {type : Object},
  editedObject : {type : Object},
  editedFields : {type : [String]},
  message : {type : String},
  collectionName : {type : String} 
},{
    timestamps : true
});
logSchema.plugin(mongoosePaginate);
export default (mongoose.models.Log as mongoose.Model<ILog>) || mongoose.model<ILog>('Log', logSchema);