import mongoose, { Schema, InferSchemaType } from 'mongoose';

const executionSchema = new Schema({
  workflowId: { type: String, required: true, index: true },
  userId: { type: String, required: true, index: true },
  strigger: { type: String, required: true },
  status: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  startedAt: { type: Date },
  completedAt: { type: Date },
  definition: { type: String, default: '{}' },
  creditsConsumed: { type: Number, default: 0 },
}, { timestamps: false });

export type WorkflowExecutionDoc = InferSchemaType<typeof executionSchema> & { _id: string };
export const WorkflowExecution = mongoose.model('WorkflowExecution', executionSchema);
