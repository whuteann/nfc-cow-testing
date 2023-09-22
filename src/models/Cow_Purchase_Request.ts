import mongoose from 'mongoose'
import { FarmSchemaEmbeddedStructure, IFarm } from './Farm';
import mongoosePaginate from 'mongoose-paginate-v2';
import mongooseDelete from 'mongoose-delete';
import Counter from '@/models/Counter';
import { CreatedBySchemaStructure, ICreatedBy } from './Created_By';

const Int32 = require("mongoose-int32").loadType(mongoose);
const Double = require('@mongoosejs/double');

export interface ICowPurchaseRequest {
  _id?: mongoose.Schema.Types.ObjectId,
  secondaryId: string,
  farm: IFarm,
  noOfCows: number,
  pricePerCow: number,
  reasonForPurchase: string,
  calculatedPurchasePrice: number,
  status: string,
  rejectedReason: string,
  createdAt: Date,
  updatedAt: Date,
  createdBy: ICreatedBy
}

export const RequestSchemaStructure = {
  secondaryId: String,
  farm: FarmSchemaEmbeddedStructure,
  noOfCows: Int32,
  pricePerCow: Double,
  reasonForPurchase: String,
  calculatedPurchasePrice: Double,
  status: String,
  rejectedReason: String,
}

export const RequestSchemaEmbeddedStructure = {
  _id: mongoose.Schema.Types.ObjectId,
  ...RequestSchemaStructure
}

const requestSchema = new mongoose.Schema<ICowPurchaseRequest>({
  ...RequestSchemaStructure,
  createdAt: Date,
  updatedAt: Date,
  createdBy: CreatedBySchemaStructure
}, { timestamps: true });

requestSchema.plugin(mongoosePaginate);

requestSchema.plugin(mongooseDelete, { deletedAt : true, overrideMethods: 'all' });

export default (mongoose.models.Cow_Purchase_Request as mongoose.Model<ICowPurchaseRequest>) || mongoose.model<ICowPurchaseRequest>('Cow_Purchase_Request', requestSchema);