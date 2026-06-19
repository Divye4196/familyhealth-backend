import express from 'express';
import {
  addFamilyMember,
  getFamilyMembers,
  getFamilyMember,
  updateFamilyMember,
  deleteFamilyMember
} from '../controllers/familyController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .get(getFamilyMembers)
  .post(addFamilyMember);

router.route('/:id')
  .get(getFamilyMember)
  .put(updateFamilyMember)
  .delete(deleteFamilyMember);

export default router;