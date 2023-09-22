import mongoose, { ObjectId, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import mongooseUniqueValidator from 'mongoose-unique-validator';
import mongooseDelete from 'mongoose-delete';
import { ITownVillage, TownVillageSchemaEmbeddedStructure } from './TownVillage';
import { CreatedBySchemaStructure, ICreatedBy } from './Created_By';
import { isString } from 'lodash';

const Int32 = require("mongoose-int32").loadType(mongoose);

export interface IChild {
  childGender: string,
}

const FileObject = new Schema({ filename: String, link: String});
const Any = new Schema({ any: {} });

export interface ICoordinatorEmbedded {
  _id?: mongoose.Schema.Types.ObjectId,
  secondaryId: string,
  type: string,
  status: string,
  rejectedReason: string,
  coordinatorType: string,
  supervisor: mongoose.Schema.Types.ObjectId,
  houseType: string,
  address: string,
  unionCouncil: string,
  town: string,
  province: string,
  nearestFamousLandmard: string,
  cityName: string,
  townVillage: ITownVillage,
  flatNumber: string,
  buildingName: string,
  areaName: string,
  policeStationThanaName: string,
  postOfficeName: string,
  name: string,
  nfcID: string,
  nationalID: string,
  notes?: string,
  contact: string,
  religion: string,
  headshot: string,
  overseeTownsVillages: [ITownVillage],
  spouseName: string,
  contractForm: any,
  familyPhoto: string,
  housePhoto: string,
  applicationForm: any,
  typeOfAnimalAllowed: string,
  noAnimalsAllocated: number,
  children: [IChild],
}

export interface IFamilyCoordinator {
  _id?: mongoose.Schema.Types.ObjectId,
  secondaryId?: string,
  type: string,
  status: string,
  rejectedReason: string,
  coordinatorType: string,
  houseType: string,
  address: string,
  unionCouncil: string,
  province: string,
  nearestFamousLandmard: string,
  cityName: string,
  townVillage: ITownVillage,
  flatNumber: string,
  buildingName: string,
  areaName: string,
  policeStationThanaName: string,
  postOfficeName: string,
  name: string,
  nfcID: string,
  nationalID: string,
  notes: string,
  contact: string,
  religion: string,
  headshot: string,
  overseeTownsVillages: [ITownVillage],
  spouseName?: string,
  contractForm: string,
  contractFormFilename?: string,

  familyPhoto: string,
  housePhoto: string,
  applicationForm: string,
  applicationFormFilename?: string,

  typeOfAnimalAllowed: string,
  noAnimalsAllocated: number,
  children: [IChild],
  supervisor: mongoose.Schema.Types.ObjectId,
  coordinator: ICoordinatorEmbedded,
  createdAt?: Date,
  updatedAt?: Date,
  createdBy?: ICreatedBy  
}

export const ChildEmbeddedSchemaStructure = {
  childGender: String,
}

export const CoordinatorSchemaEmbeddedStructure = {
  secondaryId: String,
  type: { type: String },
  status: String,
  rejectedReason: String,
  coordinatorType: String,
  supervisor: mongoose.Schema.Types.ObjectId,
  houseType: String,
  address: String,
  unionCouncil: String,
  province: String,
  nearestFamousLandmard: String,
  cityName: String,
  townVillage: TownVillageSchemaEmbeddedStructure,
  flatNumber: String,
  buildingName: String,
  areaName: String,
  policeStationThanaName: String,
  postOfficeName: String,
  name: String,
  nfcID: String,
  nationalID: String,
  notes: String,
  contact: String,
  religion: String,
  baptismDate: Date,
  headshot: String,
  overseeTownsVillages: [TownVillageSchemaEmbeddedStructure],
  spouseName: String,
  contractForm: String,
  contractFormFilename: String,

  familyPhoto: String,
  housePhoto: String,
  applicationForm: String,
  applicationFormFilename: String,

  typeOfAnimalAllowed: String,
  noAnimalsAllocated: Int32,
  children: [ChildEmbeddedSchemaStructure]
}

export const FamilyCoordinatorSchemaStructure = {
  coordinator: {
    _id: mongoose.Schema.Types.ObjectId,
    ...CoordinatorSchemaEmbeddedStructure
  },
  ...CoordinatorSchemaEmbeddedStructure
}

export const FamilyCoordinatorSchemaEmbeddedStructure = {
  _id: mongoose.Schema.Types.ObjectId,
  ...FamilyCoordinatorSchemaStructure
}

const FamilyCoordinatorSchema = new mongoose.Schema<IFamilyCoordinator>({
  ...FamilyCoordinatorSchemaStructure,
  nationalID: {type: String, unique: true},
  createdAt: Date,
  updatedAt: Date,
  createdBy: CreatedBySchemaStructure
}, {timestamps: true});

FamilyCoordinatorSchema.plugin(mongoosePaginate);

FamilyCoordinatorSchema.plugin(mongooseUniqueValidator);

FamilyCoordinatorSchema.plugin(mongooseDelete, { deletedAt : true, overrideMethods: 'all' });

export default (mongoose.models.Family as mongoose.Model<IFamilyCoordinator>) || mongoose.model<IFamilyCoordinator>('Family', FamilyCoordinatorSchema);