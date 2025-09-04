import { Router } from 'express';
import { clerkRequireAuth, attachUser } from '../middleware/auth';
import { listWorkflows, getWorkflow, createWorkflow, updateWorkflow, deleteWorkflow } from '../controllers/workflows.controller';
import { createExecution, getExecution, appendPhase, addPhaseLog } from '../controllers/executions.controller';
import { getBalance, adjustBalance } from '../controllers/balance.controller';

export const router = Router();

router.use(clerkRequireAuth, attachUser);

// Workflows
router.get('/workflows', listWorkflows);
router.post('/workflows', createWorkflow);
router.get('/workflows/:id', getWorkflow);
router.put('/workflows/:id', updateWorkflow);
router.delete('/workflows/:id', deleteWorkflow);

// Executions
router.post('/workflows/:id/executions', (req, _res, next) => { (req as any).body.workflowId = req.params.id; next(); }, createExecution);
router.get('/executions/:id', getExecution);
router.post('/executions/:id/phases', appendPhase);
router.post('/phases/:id/logs', addPhaseLog);

// Balance
router.get('/user/balance', getBalance);
router.post('/user/balance/adjust', adjustBalance);
