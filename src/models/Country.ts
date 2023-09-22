import mongoose, { plugin } from 'mongoose'
import uniqueValidator  from 'mongoose-unique-validator';
import mongoosePaginate from 'mongoose-paginate-v2';
import mongooseDelete from 'mongoose-delete';
import Counter from '@/models/Counter'
import { ICreatedBy, CreatedBySchemaStructure } from './Created_By';

export interface ICountry {
  _id?: mongoose.Schema.Types.ObjectId,
  secondaryId: string,
  name: string,
  createdAt: Date,
  updatedAt: Date,
  createdBy: ICreatedBy,
}

export const CountrySchemaStructure = {
  secondaryId: String,
  name: String,
}

export const CountrySchemaEmbeddedStructure = {
  _id: mongoose.Schema.Types.ObjectId,
  ...CountrySchemaStructure,
}

export const countrySchema = new mongoose.Schema<ICountry>({
  ...CountrySchemaStructure,
  name: {
    type: String, 
    unique : true
  },
  createdAt: Date,
  updatedAt: Date,
  createdBy: CreatedBySchemaStructure
}, {timestamps: true});

countrySchema.plugin(uniqueValidator);
countrySchema.plugin(mongoosePaginate);
countrySchema.plugin(mongooseDelete, { deletedAt : true, overrideMethods: 'all' });

export default (mongoose.models.Country as mongoose.Model<ICountry>) || mongoose.model<ICountry>('Country', countrySchema);