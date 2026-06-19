import express from 'express';
import {
  addVaccination,
  getVaccinations,
  getDueVaccinations,
  updateVaccination,
  deleteVaccination
} from '../controllers/vaccinationController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.get('/due/all', getDueVaccinations);
router.post('/', addVaccination);
router.get('/:memberId', getVaccinations);
router.put('/:id', updateVaccination);
router.delete('/:id', deleteVaccination);

export default router;