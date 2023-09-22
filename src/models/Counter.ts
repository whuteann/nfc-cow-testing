import mongoose from 'mongoose';

export interface ICounters {
  _id?: mongoose.Schema.Types.ObjectId
  id: string,
  seq : number,
}

const CounterSchema = new mongoose.Schema({
  id: {type: String, required: true},
  seq: { type: Number, default: 0 }
}, { timestamps: true });

export default (mongoose.models.Counter as mongoose.Model<ICounters>) || mongoose.model<ICounters>('Counter', CounterSchema);