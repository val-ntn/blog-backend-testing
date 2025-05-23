// routes/admin.js
import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Example protected route - Admin dashboard data
router.get('/dashboard', verifyToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied, admins only' });
  }

  res.json({ message: 'Welcome to the admin dashboard!' });
});

export default router;
