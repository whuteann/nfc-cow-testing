import mongoose, { Date } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import mongooseUniqueValidator from 'mongoose-unique-validator';
import mongooseDelete from 'mongoose-delete';
import { CountrySchemaEmbeddedStructure, ICountry } from './Country';
import { FarmSchemaEmbeddedStructure, IFarm } from './Farm';
import { ICreatedBy, CreatedBySchemaStructure } from './Created_By';

export interface IUser {
  _id?: mongoose.Schema.Types.ObjectId,
  secondaryId?: string,
  firstName?: string,
  lastName?: string,
  email?: string,
  password?: string,
  role?: string,  
  farm_role?: string,  
  team_lead?: mongoose.Schema.Types.ObjectId,
  countries?: ICountry[],
  farms?: IFarm[],
  permissions?: string[],
  changedPassword?: boolean,
  image?: string,
  joinedAt?: Date,
  createdAt?: Date,
  updatedAt?: Date,
  createdBy?: ICreatedBy
}

export const UserSchemaStructure = {
  secondaryId: String,
  firstName: String,
  lastName: String,
  email: String,
  role: String, 
  farm_role: String,  
  team_lead: mongoose.Schema.Types.ObjectId, 
  countries: [CountrySchemaEmbeddedStructure],
  farms: [FarmSchemaEmbeddedStructure],
  permissions: [String],
  image: String,
  joinedAt: Date
}

export const TownVillageSchemaEmbeddedStructure = {
  _id: mongoose.Schema.Types.ObjectId,
  ...UserSchemaStructure
}
const UserSchema = new mongoose.Schema<IUser>({
  ...UserSchemaStructure,
  email: { type: String, required: true, unique: true},
  password: { type: String, select: false},
  createdAt: Date,
  updatedAt: Date,
  createdBy: CreatedBySchemaStructure
}, {timestamps: true});

UserSchema.plugin(mongoosePaginate);

UserSchema.plugin(mongooseUniqueValidator);

UserSchema.plugin(mongooseDelete, { deletedAt : true, overrideMethods: 'all' });

export default (mongoose.models.User as mongoose.Model<IUser>) || mongoose.model<IUser>('User', UserSchema);