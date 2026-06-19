import express from 'express';
import { addDoctor, getDoctors, getDoctor, updateDoctor, deleteDoctor } from '../controllers/doctorController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.route('/').get(getDoctors).post(addDoctor);
router.route('/:id').get(getDoctor).put(updateDoctor).delete(deleteDoctor);

export default router;