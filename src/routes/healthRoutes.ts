import express from 'express';
import {
  addHealthRecord,
  getHealthRecords,
  getLatestVitals,
  deleteHealthRecord
} from '../controllers/healthController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.post('/', addHealthRecord);
router.get('/:memberId', getHealthRecords);
router.get('/:memberId/latest', getLatestVitals);
router.delete('/:id', deleteHealthRecord);

export default router;