import mongoose, { Schema, InferSchemaType } from 'mongoose';

const userBalanceSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  credits: { type: Number, default: 0 },
}, { timestamps: false });

export type UserBalanceDoc = InferSchemaType<typeof userBalanceSchema> & { _id: string };
export const UserBalance = mongoose.model('UserBalance', userBalanceSchema);
