// backend/routes/upload.js

import express from 'express';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';
import uploadMiddleware from '../middleware/uploadMiddleware.js';
import {
  uploadPicture,
  listPictures,
  deletePicture
} from '../controllers/uploadController.js';

const router = express.Router();

// Upload image (admin only)
router.post('/', verifyToken, requireRole('admin'), uploadMiddleware.single('image'), uploadPicture);

// List uploaded images (admin only)
router.get('/', verifyToken, requireRole('admin'), listPictures);

// Delete image by name (admin only)
router.delete('/:imageName', verifyToken, requireRole('admin'), deletePicture);

export default router;
