import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { WorkflowExecution } from '../models/WorkflowExecution';
import { ExecutionPhase } from '../models/ExecutionPhase';
import { ExecutionLog } from '../models/ExecutionLog';

export async function createExecution(req: Request, res: Response) {
  const userId = (req as any).userId as string;
  const { workflowId, strigger, status, definition } = req.body;
  const created = await WorkflowExecution.create({
    userId,
    workflowId,
    strigger,
    status: status || 'PENDING',
    definition: definition || '{}',
  });
  res.status(StatusCodes.CREATED).json({ id: created._id.toString() });
}

export async function getExecution(req: Request, res: Response) {
  const userId = (req as any).userId as string;
  const { id } = req.params;
  const exec = await WorkflowExecution.findOne({ _id: id, userId }).lean();
  if (!exec) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Not found' });
  const phases = await ExecutionPhase.find({ workflowExecutionId: id }).sort({ number: 1 }).lean();
  res.json({ execution: exec, phases });
}

export async function appendPhase(req: Request, res: Response) {
  const userId = (req as any).userId as string;
  const { id } = req.params; // execution id
  const { number, node, name, status, inputs, outputs, creditsConsumed, startedAt, completedAt } = req.body;
  const exec = await WorkflowExecution.findOne({ _id: id, userId }).select('_id').lean();
  if (!exec) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Execution not found' });
  const phase = await ExecutionPhase.create({
    workflowExecutionId: id,
    userId,
    number,
    node,
    name,
    status,
    inputs,
    outputs,
    creditsConsumed,
    startedAt,
    completedAt,
  });
  res.status(StatusCodes.CREATED).json({ id: phase._id.toString() });
}

export async function addPhaseLog(req: Request, res: Response) {
  const userId = (req as any).userId as string;
  const { id } = req.params; // phase id
  const { logLevel, message, time } = req.body;
  const phase = await ExecutionPhase.findOne({ _id: id, userId }).select('_id').lean();
  if (!phase) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Phase not found' });
  const log = await ExecutionLog.create({ executionPhaseId: id, logLevel, message, time });
  res.status(StatusCodes.CREATED).json({ id: log._id.toString() });
}
