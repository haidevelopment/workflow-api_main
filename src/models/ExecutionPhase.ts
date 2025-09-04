import mongoose, { Schema, InferSchemaType } from 'mongoose';

const phaseSchema = new Schema({
  userId: { type: String, required: true, index: true },
  status: { type: String, required: true },
  number: { type: Number, required: true },
  node: { type: String, required: true },
  name: { type: String, required: true },
  startedAt: { type: Date },
  completedAt: { type: Date },
  inputs: { type: String },
  outputs: { type: String },
  creditsConsumed: { type: Number },
  workflowExecutionId: { type: String, required: true, index: true },
}, { timestamps: false });

phaseSchema.index({ workflowExecutionId: 1, number: 1 }, { unique: true });

export type ExecutionPhaseDoc = InferSchemaType<typeof phaseSchema> & { _id: string };
export const ExecutionPhase = mongoose.model('ExecutionPhase', phaseSchema);
