import mongoose, { Schema, InferSchemaType } from 'mongoose';

const logSchema = new Schema({
  logLevel: { type: String, required: true },
  message: { type: String, required: true },
  time: { type: Date, default: Date.now },
  executionPhaseId: { type: String, required: true, index: true },
}, { timestamps: false });

export type ExecutionLogDoc = InferSchemaType<typeof logSchema> & { _id: string };
export const ExecutionLog = mongoose.model('ExecutionLog', logSchema);
