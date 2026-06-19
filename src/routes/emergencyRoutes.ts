import express from 'express';
import {
  addEmergencyContact,
  getEmergencyContacts,
  deleteEmergencyContact,
  getEmergencyOverview
} from '../controllers/emergencyController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.get('/overview', getEmergencyOverview);
router.route('/contacts').get(getEmergencyContacts).post(addEmergencyContact);
router.delete('/contacts/:id', deleteEmergencyContact);

export default router;