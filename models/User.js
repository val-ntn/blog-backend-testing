//models/User.js

import mongoose from 'mongoose';

// Define the User schema structure
const userSchema = new mongoose.Schema({
  name: { 
    type: String,       // User's name as a required string
    required: true
  },
  email: { 
    type: String,       // User's email, required and unique to prevent duplicates
    required: true,
    unique: true
  },
  role: { 
    type: String,       // User role with restricted values, default is 'author'
    enum: ['admin', 'author', 'subscriber'],
    default: 'author'
  }
}, { 
  timestamps: true      // Automatically add createdAt and updatedAt timestamps
});

// Export the User model based on userSchema
export default mongoose.model('User', userSchema);

