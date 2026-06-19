import express from 'express';
import {
  addAppointment,
  getAppointments,
  getUpcomingAppointments,
  updateAppointment,
  deleteAppointment
} from '../controllers/appointmentController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.get('/upcoming', getUpcomingAppointments);
router.route('/').get(getAppointments).post(addAppointment);
router.route('/:id').put(updateAppointment).delete(deleteAppointment);

export default router;