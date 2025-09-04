import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserBalance } from '../models/UserBalance';

export async function getBalance(req: Request, res: Response) {
  const userId = (req as any).userId as string;
  const doc = await UserBalance.findOne({ userId }).lean();
  res.json({ credits: doc?.credits ?? 0 });
}

export async function adjustBalance(req: Request, res: Response) {
  const userId = (req as any).userId as string;
  const { delta } = req.body as { delta: number };
  if (typeof delta !== 'number') return res.status(StatusCodes.BAD_REQUEST).json({ error: 'delta must be number' });
  const doc = await UserBalance.findOneAndUpdate(
    { userId },
    { $inc: { credits: delta } },
    { upsert: true, new: true }
  ).lean();
  res.json({ credits: doc!.credits });
}
