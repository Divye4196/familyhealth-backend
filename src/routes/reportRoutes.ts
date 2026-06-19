import express from 'express';
import { uploadReport, getReports, getAllReports, deleteReport } from '../controllers/reportController';
import { protect } from '../middleware/auth';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = /pdf|png|jpg|jpeg/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, PNG, JPG files are allowed'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter
});

router.use(protect);

router.get('/all', getAllReports);
router.post('/', upload.single('file'), uploadReport);
router.get('/:memberId', getReports);
router.delete('/:id', deleteReport);

export default router;