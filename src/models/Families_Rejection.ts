import mongoose from 'mongoose'
import { ICreatedBy } from './Created_By';

export interface IFamiliesRejection {
  _id?: mongoose.Schema.Types.ObjectId,
  familyID : string,
  rejectedReason : string,
  createdAt: Date,
  updatedAt: Date,
  createdBy: ICreatedBy,
}

export const familiesRejectionSchema = new mongoose.Schema<IFamiliesRejection>({
  familyID : mongoose.Schema.Types.ObjectId,
  rejectedReason: {type : String},
  createdAt: Date,
  updatedAt: Date,
  createdBy: {type: Object}
}, { timestamps: true });

export default (mongoose.models.Families_Rejection as mongoose.Model<IFamiliesRejection>) || mongoose.model<IFamiliesRejection>('Families_Rejection', familiesRejectionSchema);