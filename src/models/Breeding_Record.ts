import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import mongooseDelete from 'mongoose-delete';
import Counter from '@/models/Counter';
import { CowSchemaEmbeddedStructure, ICow } from './Cow';
import { CreatedBySchemaStructure, ICreatedBy } from './Created_By';
import { FarmSchemaEmbeddedStructure, IFarm } from './Farm';

const Int32 = require("mongoose-int32").loadType(mongoose);

//STATUS
//Pending - When it is created and can proceed with Process 10.2
//Completed - When the piglets are tied to a breeding record

export interface IBreedingRecord {
  _id?: mongoose.Schema.Types.ObjectId,
  secondaryId: string,
  status: string,
  farm: IFarm,
  option: string,
  dateOfBirth: Date,
  aliveCalves: number,
  deadCalves: number,
  comment: string,
  cow: ICow,
  calves: ICow[],
  createdAt: Date,
  updatedAt: Date,
  createdBy: ICreatedBy
}

export const BreedingRecordSchemaStructure = {
  secondaryId: String,
  status: String,
  option: String,
  farm: FarmSchemaEmbeddedStructure,
  dateOfBirth: Date,
  aliveCalves: Int32,
  deadCalves: Int32,
  comment: String,
  cow: CowSchemaEmbeddedStructure,
  calves: [CowSchemaEmbeddedStructure]
}

export const BreedingRecordSchemaEmbeddedStructure = {
  _id: mongoose.Schema.Types.ObjectId,
  ...BreedingRecordSchemaStructure
}

export const breedingRecordSchema = new mongoose.Schema<IBreedingRecord>({
  ...BreedingRecordSchemaStructure,
  createdAt: Date,
  updatedAt: Date,
  createdBy: CreatedBySchemaStructure
}, { timestamps: true });

breedingRecordSchema.plugin(mongoosePaginate);

breedingRecordSchema.plugin(mongooseDelete, { deletedAt : true, overrideMethods: 'all' });

export default (mongoose.models.Breeding_Record as mongoose.Model<IBreedingRecord>) || mongoose.model<IBreedingRecord>('Breeding_Record', breedingRecordSchema);