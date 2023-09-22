import mongoose, { plugin } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2';
import mongooseDelete from 'mongoose-delete';
import mongooseUniqueValidator from 'mongoose-unique-validator';
import { FarmSchemaEmbeddedStructure, IFarm } from './Farm';
import { FamilyCoordinatorSchemaEmbeddedStructure, IFamilyCoordinator } from './Family';
import { CowDispersalCowSchemaEmbeddedStructure, ICow } from './Cow';
import Counter from '@/models/Counter';
import { CreatedBySchemaStructure } from './Created_By';

const Int32 = require("mongoose-int32").loadType(mongoose);

//STATUS
//Pending - When it is created and can proceed with Process 3.2
//Approved - When it is approved and can proceed with Process 3.3
//Rejected - Rejected loh
//Completed - When the cow is assigned to family
//Sold - When all cows in the record are all sold

export interface ICowDispersal {
  _id?: mongoose.Schema.Types.ObjectId,
  secondaryId: string,
  status: string,
  farm: IFarm,
  date: Date,
  family: IFamilyCoordinator,
  noOfCows: number,
  rejectedReason?: String,
  cows: ICow[],
  createdAt: Date,
  updatedAt: Date,
  createdBy: object
} 

export const CowDispersalSchemaStructure = {
  secondaryId: String,
  status: String,
  farm: FarmSchemaEmbeddedStructure,
  date: Date,
  family: FamilyCoordinatorSchemaEmbeddedStructure,
  noOfCows: Int32,
  rejectedReason: String,
  cows: [CowDispersalCowSchemaEmbeddedStructure]
}

export const CowDispersalSchemaEmbeddedStructure = {
  _id: mongoose.Schema.Types.ObjectId,
  ...CowDispersalSchemaStructure
}

const cowDispersalSchema = new mongoose.Schema<ICowDispersal>({
  ...CowDispersalSchemaStructure,
  createdAt: Date,
  updatedAt: Date,
  createdBy: CreatedBySchemaStructure
}, { timestamps: true });

cowDispersalSchema.plugin(mongoosePaginate);
cowDispersalSchema.plugin(mongooseDelete, { deletedAt : true, overrideMethods: 'all' });
cowDispersalSchema.plugin(mongooseUniqueValidator);

export default (mongoose.models.Cow_Dispersal as mongoose.Model<ICowDispersal>) || mongoose.model<ICowDispersal>('Cow_Dispersal', cowDispersalSchema);