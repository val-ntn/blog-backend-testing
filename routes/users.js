// routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get all users (this will be used in the dashboard)
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);  // This will return all users in the database
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router;
