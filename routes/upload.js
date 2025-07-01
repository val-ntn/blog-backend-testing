// routes/upload.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // directory where files are stored
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName); // e.g., 1628751234567-image.png
  }
});

const upload = multer({ storage });

// Upload route
router.post('/', verifyToken, requireRole('admin'), upload.single('image'), (req, res) => {
  const imagePath = `/uploads/${req.file.filename}`;
  res.status(200).json({ location: imagePath });
});

export default router;
