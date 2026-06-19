import express from 'express';
import {
  addMedicine,
  getMedicines,
  getTodayMedicines,
  updateMedicine,
  deleteMedicine
} from '../controllers/medicineController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.get('/today/all', getTodayMedicines);
router.post('/', addMedicine);
router.get('/:memberId', getMedicines);
router.put('/:id', updateMedicine);
router.delete('/:id', deleteMedicine);

export default router;