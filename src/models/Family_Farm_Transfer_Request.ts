import mongoose from 'mongoose'
import { CowDispersalCowSchemaEmbeddedStructure, ICow } from './Cow';
import { FamilyCoordinatorSchemaEmbeddedStructure, IFamilyCoordinator } from './Family';
import { FarmSchemaEmbeddedStructure, IFarm } from './Farm';
import Counter from '@/models/Counter';
import mongoosePaginate from 'mongoose-paginate-v2';
import { CreatedBySchemaStructure } from './Created_By';

const Int32 = require("mongoose-int32").loadType(mongoose);

export interface IFamilyFarmTransferRequest {
  _id?: string,
  secondaryId: string,
  status: string,
  family: IFamilyCoordinator,
  farm: IFarm,
  noOfCows: number,
  cows: ICow[],
  rejectedReason: string,
  createdAt: Date,
  updatedAt: Date,
  createdBy : object,
}

export const FamilyFarmTransferRequestSchemaStructure = {
  secondaryId: String,
  status: String,
  farm: FarmSchemaEmbeddedStructure,
  date: Date,
  family: FamilyCoordinatorSchemaEmbeddedStructure,
  noOfCows: Int32,
  rejectedReason: String,
  cows: [CowDispersalCowSchemaEmbeddedStructure]
}

export const FamilyFarmTransferRequestSchemaEmbeddedStructure = {
  _id: mongoose.Schema.Types.ObjectId,
  ...FamilyFarmTransferRequestSchemaStructure
}

const FamilyFarmTransferRequestSchema = new mongoose.Schema<IFamilyFarmTransferRequest>({
  ...FamilyFarmTransferRequestSchemaStructure,
  createdAt: Date,
  updatedAt: Date,
  createdBy: CreatedBySchemaStructure
}, { timestamps: true });

FamilyFarmTransferRequestSchema.plugin(mongoosePaginate);

export default (mongoose.models.Family_Farm_Transfer_Request as mongoose.Model<IFamilyFarmTransferRequest>) || mongoose.model<IFamilyFarmTransferRequest>('Family_Farm_Transfer_Request', FamilyFarmTransferRequestSchema);