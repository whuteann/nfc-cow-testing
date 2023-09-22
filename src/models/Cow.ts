import mongoose from 'mongoose'
import uniqueValidator  from 'mongoose-unique-validator';
import mongoosePaginate from 'mongoose-paginate-v2';
import mongooseDelete from 'mongoose-delete';
import { FarmSchemaEmbeddedStructure, IFarm } from './Farm';
import { FamilyCoordinatorSchemaEmbeddedStructure, IFamilyCoordinator } from './Family';
import { CreatedBySchemaStructure, ICreatedBy } from './Created_By';

const Int32 = require("mongoose-int32").loadType(mongoose);
const Double = require('@mongoosejs/double');


export interface ICow {
  _id?: mongoose.Schema.Types.ObjectId,
  secondaryId?: string,
  farm: IFarm,
  family?: IFamilyCoordinator,
  nfcID?: string,
  cowPhoto?: string,
  weight: number,
  gender: string,
  type?: string,
  status?: string,
  birthDate?: string,
  dispersalDate?: Date,
  deathDate?: Date,
  cowWithFamilyPhoto: string,
  cowPrice: number,
  isFrom: string,
  hasBred?: boolean,

  //Pakistan Exclusive
  taxPrice?: number,
  coordinatorHelperExpenses?: number,
  signedLegalDoc?: string,
  signedLegalDocFilename?: string,

  transportPrice?: number,

  //Bangladesh Exclusive
  ageYear?: number,
  ageMonth?: number,
  height?: number,
  purchaseDate?: Date,
  signedDispersalAgreement?: string,
  signedDispersalAgreementFilename?: string,

  colour?: string,
  createdAt: Date,
  updatedAt: Date,
  createdBy: ICreatedBy
}

export const CowSchemaStructure = {
  secondaryId: String,
  farm: FarmSchemaEmbeddedStructure,
  family: FamilyCoordinatorSchemaEmbeddedStructure,
  nfcID: String,
  cowPhoto: String,
  cowPrice: Double,
  weight: Double,
  gender: String,
  dispersalDate: Date,
  deathDate: Date,
  cowWithFamilyPhoto: String,
  status: String,
  isFrom: String,
  country: String,
  hasBred: Boolean,

  //Pakistan Exclusive
  transportPrice: Double,
  taxPrice: Double,
  coordinatorHelperExpenses: Double,
  signedLegalDoc: String,
  signedLegalDocFilename: String,

  //Bangladesh Exclusive
  ageYear: Int32,
  ageMonth: Int32,
  // age: Int32,
  height: Double,
  purchaseDate: Date,
  signedDispersalAgreement: String,
  signedDispersalAgreementFilename: String,
  colour: String
}

export const CowSchemaEmbeddedStructure = {
  _id: mongoose.Schema.Types.ObjectId,
  ...CowSchemaStructure
}

export const {
  farm,
  family,  
  ...CowDispersalCowSchemaEmbeddedStructure 
} = CowSchemaEmbeddedStructure;

const cowSchema = new mongoose.Schema<ICow>({
  ...CowSchemaStructure,
  nfcID: { type: String, unique : true },
  createdAt: Date,
  updatedAt: Date,
  createdBy: CreatedBySchemaStructure
}, { timestamps: true });

cowSchema.plugin(uniqueValidator);

cowSchema.plugin(mongoosePaginate);

cowSchema.plugin(mongooseDelete, { deletedAt : true, overrideMethods: 'all' });

export default (mongoose.models.Cow as mongoose.Model<ICow>) || mongoose.model<ICow>('Cow', cowSchema);