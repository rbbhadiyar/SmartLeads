import { Router } from 'express';
import {
  getLeads, getLead, createLead, updateLead, deleteLead,
  exportLeadsCSV, getLeadsStats, leadValidation, createLeadValidation,
} from '../controllers/leadController';
import { protect, restrictTo } from '../middleware/auth';

const router = Router();

router.use(protect);

router.get('/export/csv', restrictTo('admin'), exportLeadsCSV);
router.get('/stats', getLeadsStats);
router.get('/', getLeads);
router.get('/:id', getLead);
router.post('/', createLeadValidation, createLead);
router.put('/:id', leadValidation, updateLead);
router.delete('/:id', deleteLead);

export default router;
