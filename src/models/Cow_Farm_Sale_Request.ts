import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2';
import mongooseDelete from 'mongoose-delete';
import { FarmSchemaEmbeddedStructure, IFarm } from './Farm';
import Counter from '@/models/Counter';
import { CreatedBySchemaStructure, ICreatedBy } from './Created_By';
import { ICow, CowSchemaEmbeddedStructure } from './Cow';

const Double = require('@mongoosejs/double');

export interface ICowFarmSaleRequest {
  _id?: mongoose.Schema.Types.ObjectId,
  secondaryId: string,
  farm: IFarm,
  cows: ICow[],
  status: string,
  rejectedReason: string,
  quantity: number,
  createdAt: Date,
  updatedAt: Date,
  createdBy: ICreatedBy
}

export const CowFarmSaleRequestSchemaStructure = {
  secondaryId: String,
  farm: FarmSchemaEmbeddedStructure,
  quantity: Double,
  status: String,
  rejectedReason: String,
  cows: [CowSchemaEmbeddedStructure],
}

export const CowFarmSaleRequestSchemaEmbeddedStructure = {
  _id: mongoose.Schema.Types.ObjectId,
  ...CowFarmSaleRequestSchemaStructure
}

const requestSchema = new mongoose.Schema<ICowFarmSaleRequest>({
  ...CowFarmSaleRequestSchemaStructure,
  createdAt: Date,
  updatedAt: Date,
  createdBy: CreatedBySchemaStructure
}, { timestamps: true });

requestSchema.plugin(mongoosePaginate);

requestSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });

export default (mongoose.models.Cow_Farm_Sale_Request as mongoose.Model<ICowFarmSaleRequest>) || mongoose.model<ICowFarmSaleRequest>('Cow_Farm_Sale_Request', requestSchema);