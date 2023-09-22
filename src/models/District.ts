import mongoose from 'mongoose'
import uniqueValidator  from 'mongoose-unique-validator';
import mongoosePaginate from 'mongoose-paginate-v2';
import mongooseDelete from 'mongoose-delete';
import { CountrySchemaEmbeddedStructure, ICountry } from './Country';
import Counter from '@/models/Counter'
import { ICreatedBy, CreatedBySchemaStructure } from './Created_By';

export interface IDistrict {
  _id?: mongoose.Schema.Types.ObjectId,
  name : string,
  secondaryId : string,
  country: ICountry,
  createdAt: Date,
  updatedAt: Date,
  createdBy: ICreatedBy
}

export const DistrictSchemaStructure = {
  name: String,
  secondaryId : String,
  country: CountrySchemaEmbeddedStructure
}

export const DistrictSchemaEmbeddedStructure = {
  _id: mongoose.Schema.Types.ObjectId,
  ...DistrictSchemaStructure
}

export const districtSchema = new mongoose.Schema<IDistrict>({
  ...DistrictSchemaStructure,
  createdAt: Date,
  updatedAt: Date,
  createdBy: CreatedBySchemaStructure
}, {timestamps: true});

districtSchema.index({ name: 1, country: 1}, { unique: true });

districtSchema.plugin(uniqueValidator);

districtSchema.plugin(mongoosePaginate);

districtSchema.plugin(mongooseDelete, { deletedAt : true, overrideMethods: 'all' });

export default (mongoose.models.District as mongoose.Model<IDistrict>) || mongoose.model<IDistrict>('District', districtSchema);