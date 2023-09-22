import mongoose from 'mongoose'
import uniqueValidator  from 'mongoose-unique-validator';
import mongoosePaginate from 'mongoose-paginate-v2';
import mongooseDelete from 'mongoose-delete';
import { DistrictSchemaStructure, DistrictSchemaEmbeddedStructure, IDistrict } from './District';
import Counter from '@/models/Counter';
import { CreatedBySchemaStructure, ICreatedBy } from './Created_By';

export interface ITownVillage {
  _id?: mongoose.Schema.Types.ObjectId,
  secondaryId: string,
  name: string,
  district: IDistrict,
  townVillage: string,
  createdAt: Date,
  updatedAt: Date,
  createdBy: ICreatedBy
}

export const TownVillageSchemaStructure = {
  secondaryId: String,
  name: String,
  district: DistrictSchemaEmbeddedStructure,
  townVillage: String
}

export const TownVillageSchemaEmbeddedStructure = {
  _id: mongoose.Schema.Types.ObjectId,
  ...TownVillageSchemaStructure
}

const townVillageSchema = new mongoose.Schema<ITownVillage>({
  ...TownVillageSchemaStructure,
  createdAt: Date,
  updatedAt: Date,
  createdBy: CreatedBySchemaStructure
}, { timestamps: true });

townVillageSchema.index({ name: 1, "district.name" : 1 }, { unique: true });

townVillageSchema.plugin(uniqueValidator);

townVillageSchema.plugin(mongoosePaginate);

townVillageSchema.plugin(mongooseDelete, { deletedAt : true, overrideMethods: 'all' });

export default (mongoose.models.TownVillage as mongoose.Model<ITownVillage>) || mongoose.model<ITownVillage>('TownVillage', townVillageSchema);