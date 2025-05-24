//models/Post.js
import mongoose from 'mongoose';

// Define the Post schema structure
const postSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true  // Title is mandatory
  },
  content: { 
    type: String, 
    required: true  // Content is mandatory
  },
  author: { 
    type: mongoose.Schema.Types.ObjectId,  // Reference to the User model by ObjectId
    ref: 'User', 
    required: true  // Author must be specified
  },
  category: { 
    type: String  // Optional category string
  },
  tags: [{ 
    type: String  // Array of strings representing tags
  }],
  views: { 
    type: Number, 
    default: 0  // Number of views, default to 0
  },
  thumbnailURL: { 
    type: String  // URL string for a thumbnail image (optional)
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  externalLinks: [{ 
    type: String  // Array of external URLs (optional)
  }]
}, { 
  timestamps: true  // Automatically adds createdAt and updatedAt fields
});

// Export the Post model based on the schema
export default mongoose.model('Post', postSchema);

