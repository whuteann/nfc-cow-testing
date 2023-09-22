import mongoose from 'mongoose';
import uniqueValidator  from 'mongoose-unique-validator';
import mongoosePaginate from 'mongoose-paginate-v2';
import mongooseDelete from 'mongoose-delete';
import { DistrictSchemaEmbeddedStructure, IDistrict } from './District';
import Counter from '@/models/Counter'
import { ICreatedBy, CreatedBySchemaStructure } from './Created_By';

export interface IFarm {
  _id?: mongoose.Schema.Types.ObjectId,
  secondaryId?: string,
  name : string,
  district: IDistrict,
  createdAt: Date,
  updatedAt: Date,
  createdBy?: ICreatedBy
}

export const FarmSchemaStructure = {
  secondaryId: String,
  name: String,
  district: DistrictSchemaEmbeddedStructure
}

export const FarmSchemaEmbeddedStructure = {
  _id: mongoose.Schema.Types.ObjectId,
  ...FarmSchemaStructure
}

const farmSchema = new mongoose.Schema<IFarm>({
  ...FarmSchemaStructure,
  createdAt: Date,
  updatedAt: Date,
  createdBy: CreatedBySchemaStructure
}, { timestamps: true });

farmSchema.index({ name: 1, "district._id" : 1 }, { unique: true });

farmSchema.plugin(uniqueValidator);

farmSchema.plugin(mongoosePaginate);

farmSchema.plugin(mongooseDelete, { deletedAt : true, overrideMethods: 'all' });

export default (mongoose.models.Farm as mongoose.Model<IFarm>) || mongoose.model<IFarm>('Farm', farmSchema);