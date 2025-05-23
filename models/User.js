//models/User.js

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

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
  },
  password: { type: String, required: true }

}, { 
  timestamps: true      // Automatically add createdAt and updatedAt timestamps
});
// Pre-save hook to hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next(); // only hash if password changed or new

  try {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare password during login
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
// Export the User model based on userSchema
export default mongoose.model('User', userSchema);

