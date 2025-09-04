import mongoose, { Schema, InferSchemaType } from 'mongoose';

const workflowSchema = new Schema({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  description: { type: String },
  definition: { type: String, required: true },
  executionPlan: { type: String },
  creditsCost: { type: Number, default: 0 },
  cron: { type: String },
  status: { type: String, required: true },
  lastRunAt: { type: Date },
  lastRunId: { type: String },
  lastRunStatus: { type: String },
  nextRunAt: { type: Date },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

workflowSchema.index({ name: 1, userId: 1 }, { unique: true });

export type WorkflowDoc = InferSchemaType<typeof workflowSchema> & { _id: string };
export const Workflow = mongoose.model('Workflow', workflowSchema);
