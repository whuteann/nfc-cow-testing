import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import mongooseDelete from 'mongoose-delete';
import { CowSchemaEmbeddedStructure, ICow } from './Cow';
import { CreatedBySchemaStructure, ICreatedBy } from './Created_By';
import { FamilyCoordinatorSchemaEmbeddedStructure, IFamilyCoordinator } from './Family';
import {FarmSchemaEmbeddedStructure, IFarm} from './Farm';


const Int32 = require("mongoose-int32").loadType(mongoose);

//STATUS
//Pending - When it is created and can proceed with Process 10.2
//Completed - When the piglets are tied to a breeding record

export interface ICowDeath {
  _id?: mongoose.Schema.Types.ObjectId,
  secondaryId: string,

  type: "Farm" | "Family",
  farm: IFarm,
  option?: string,
  family?: IFamilyCoordinator
  cow: ICow,
  death_cause: string,
  date_of_death: Date,
  cow_pic: string,
  report: string,
  reportFilename: string,
  status: "Pending" | "Approved" | "Rejected",
  rejected_reason?: string,

  createdAt: Date,
  updatedAt: Date,
  createdBy: ICreatedBy
}

export const CowDeathSchemaStructure = {
  secondaryId: String,
  option: String,
  type: String,
  farm: FarmSchemaEmbeddedStructure,
  family: FamilyCoordinatorSchemaEmbeddedStructure,
  cow: CowSchemaEmbeddedStructure,
  rejected_reason: String,
  status: String,
  death_cause: String,
  date_of_death: Date,
  cow_pic: String,
  report: String,
  reportFilename: String,
}

export const CowDeathSchemaEmbeddedStructure = {
  _id: mongoose.Schema.Types.ObjectId,
  ...CowDeathSchemaStructure
}

export const cowDeathSchema = new mongoose.Schema<ICowDeath>({
  ...CowDeathSchemaStructure,
  createdAt: Date,
  updatedAt: Date,
  createdBy: CreatedBySchemaStructure
}, { timestamps: true });

cowDeathSchema.plugin(mongoosePaginate);

cowDeathSchema.plugin(mongooseDelete, { deletedAt : true, overrideMethods: 'all' });

export default (mongoose.models.Cow_Death as mongoose.Model<ICowDeath>) || mongoose.model<ICowDeath>('Cow_Death', cowDeathSchema);