// backend/routes/admin.js
import express from 'express';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Cleaner and reusable: only admin can access this route
router.get('/dashboard', verifyToken, requireRole('admin'), (req, res) => {
  res.json({ message: 'Welcome to the admin dashboard!' });
});

export default router;

