// models/Event.js
import mongoose from 'mongoose';

// Define the Event schema structure
const eventSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true  // Event title is mandatory, e.g. "Art Fair 2025"
  },
  startDate: { 
    type: Date, 
    required: true  // Start date of the event is mandatory
  },
  endDate: { 
    type: Date  // Optional end date; if missing, assume single-day event
  },
  location: { 
    type: String  // Event location (optional)
  },
  contact: { 
    type: String  // Contact info, can be email, phone number, or a contact person’s name
  },
  schedule: { 
    type: String  // Event schedule details, e.g., "10:00–18:00 daily"
  },
  costs: { 
    type: String  // Cost information, e.g., "Free", "€10", etc.
  },
  source: { 
    type: String  // Source or external link for the event, like a website URL
  },
  iconURL: { 
    type: String  // URL to a small icon image representing the event (optional)
  },
  imageURL: { 
    type: String  // URL to a main image or visual for the event (optional)
  },
  description: { 
    type: String  // Optional detailed description of the event
  },
  relatedPostId: { 
    type: mongoose.Schema.Types.ObjectId,  // Reference to related Post document (optional)
    ref: 'Post'  
  }, 
  deleted: {
    type: Boolean,
    default: false
  }
}, { 
  timestamps: true  // Automatically add createdAt and updatedAt fields
});

// Export the Event model based on the schema
export default mongoose.model('Event', eventSchema);
