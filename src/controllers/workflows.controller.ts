import { Request, Response } from 'express';
import { Workflow } from '../models/Workflow';
import { StatusCodes } from 'http-status-codes';

export async function listWorkflows(req: Request, res: Response) {
  const userId = (req as any).userId as string;
  const items = await Workflow.find({ userId }).sort({ updatedAt: -1 }).lean();
  res.json({ items });
}

export async function getWorkflow(req: Request, res: Response) {
  const userId = (req as any).userId as string;
  const { id } = req.params;
  const item = await Workflow.findOne({ _id: id, userId }).lean();
  if (!item) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Not found' });
  res.json({ item });
}

export async function createWorkflow(req: Request, res: Response) {
  const userId = (req as any).userId as string;
  const { name, description, definition, executionPlan, creditsCost, cron, status } = req.body;
  const created = await Workflow.create({
    userId,
    name,
    description,
    definition,
    executionPlan,
    creditsCost,
    cron,
    status,
  });
  res.status(StatusCodes.CREATED).json({ id: created._id.toString() });
}

export async function updateWorkflow(req: Request, res: Response) {
  const userId = (req as any).userId as string;
  const { id } = req.params;
  const update = req.body;
  const result = await Workflow.findOneAndUpdate({ _id: id, userId }, update, { new: true }).lean();
  if (!result) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Not found' });
  res.json({ item: result });
}

export async function deleteWorkflow(req: Request, res: Response) {
  const userId = (req as any).userId as string;
  const { id } = req.params;
  const result = await Workflow.findOneAndDelete({ _id: id, userId }).lean();
  if (!result) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Not found' });
  res.json({ ok: true });
}
