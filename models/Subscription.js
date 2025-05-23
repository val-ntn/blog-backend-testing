//models/Subscription.js

import mongoose from 'mongoose';

// Define the Subscription schema structure
const subscriptionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, // Reference to the User model by ID
    ref: 'User'                           // This allows population with user details if needed
  },
  email: { 
    type: String,                         // Subscriber's email address, required
    required: true
  },
  subscribedAt: { 
    type: Date,                          // Timestamp of subscription
    default: Date.now                    // Defaults to the current date/time when created
  }
});

// Export the Subscription model based on subscriptionSchema
export default mongoose.model('Subscription', subscriptionSchema);

