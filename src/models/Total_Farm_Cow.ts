import mongoose from 'mongoose'
import { CreatedBySchemaStructure, ICreatedBy } from './Created_By';
import { FarmSchemaEmbeddedStructure, IFarm } from './Farm';

const Int32 = require("mongoose-int32").loadType(mongoose);

export interface ITotalFarmCows {
  _id?: mongoose.Schema.Types.ObjectId,
  farm : IFarm,
  totalAmountOfCows : number,
  createdAt: Date,
  updatedAt: Date,
  createdBy: ICreatedBy,
}

export const TotalFarmCowSchemaStructure = {
  farm : FarmSchemaEmbeddedStructure,
  totalAmountOfCows : Int32
}

export const totalFarmCowsSchema = new mongoose.Schema<ITotalFarmCows>({
  ...TotalFarmCowSchemaStructure,
  createdAt: Date,
  updatedAt: Date,
  createdBy: CreatedBySchemaStructure
}, { timestamps: true });

export default (mongoose.models.Total_Farm_Cows as mongoose.Model<ITotalFarmCows>) || mongoose.model<ITotalFarmCows>('Total_Farm_Cows', totalFarmCowsSchema);