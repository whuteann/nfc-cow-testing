import mongoose, { plugin } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2';
import mongooseDelete from 'mongoose-delete';
import mongooseUniqueValidator from 'mongoose-unique-validator';
import { FamilyCoordinatorSchemaEmbeddedStructure, IFamilyCoordinator } from './Family';
import { CowSchemaEmbeddedStructure, ICow } from './Cow';
import Counter from '@/models/Counter';
import { CreatedBySchemaStructure } from './Created_By';

const Int32 = require("mongoose-int32").loadType(mongoose);

//STATUS
//Pending - When it is created and can proceed with Process 9.2
//Approved - When it is approved and can proceed with Process 9.3
//Rejected - Rejected loh
//Cows taken from Family 1 - When the cows are being transferred
//Cows transferred to Family 2 - When the cows are successfully transferred

export interface IFamilyTransferRequest {
  _id?: string,
  secondaryId: string,
  status: string,
  family1: IFamilyCoordinator,
  family2: IFamilyCoordinator,
  date: Date,
  noOfCows: number,
  cows: ICow[],
  rejectedReason?: String,
  createdAt: Date,
  updatedAt: Date,
  createdBy: object
}

export const FamilyTransferRequestSchemaStructure = {
  secondaryId: String,
  status: String,
  family1: FamilyCoordinatorSchemaEmbeddedStructure,
  family2: FamilyCoordinatorSchemaEmbeddedStructure,
  date: Date,
  noOfCows: Int32,
  cows: [CowSchemaEmbeddedStructure],
  rejectedReason: String,
  createdBy: Object,
}

export const FamilyTransferRequestSchemaEmbeddedStructure = {
  _id: mongoose.Schema.Types.ObjectId,
  ...FamilyTransferRequestSchemaStructure
}

const FamilyTransferRequestSchema = new mongoose.Schema<IFamilyTransferRequest>({
  ...FamilyTransferRequestSchemaStructure,
  createdAt: Date,
  updatedAt: Date,
  createdBy: CreatedBySchemaStructure,
}, { timestamps: true });

FamilyTransferRequestSchema.plugin(mongoosePaginate);

FamilyTransferRequestSchema.plugin(mongooseDelete, { deletedAt : true, overrideMethods: 'all' });

FamilyTransferRequestSchema.plugin(mongooseUniqueValidator);

export default (mongoose.models.Family_Transfer_Request as mongoose.Model<IFamilyTransferRequest>) || mongoose.model<IFamilyTransferRequest>('Family_Transfer_Request', FamilyTransferRequestSchema);