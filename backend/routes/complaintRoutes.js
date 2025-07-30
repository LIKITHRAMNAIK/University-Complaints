import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { createComplaint, getAllComplaints, likeComplaint, commentComplaint } from '../controllers/complaintController.js';

const router = express.Router();

router.post('/', protect, upload.single('image'), createComplaint);
router.get('/', getAllComplaints);
router.post('/:id/like', protect, likeComplaint);
router.post('/:id/comment', protect, commentComplaint);

export default router;
