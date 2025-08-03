//models/Post.js
import mongoose from "mongoose";

// Define the Post schema structure
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true, // Title is mandatory
    },
    content: {
      type: String,
      required: true, // Content is mandatory
    },
    author: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the User model by ObjectId
      ref: "User",
      required: true, // Author must be specified
    },
    carousel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Carousel",
    },

    category: {
      type: String, // Optional category string
    },
    tags: [
      {
        type: String, // Array of strings representing tags
      },
    ],
    views: {
      type: Number,
      default: 0, // Number of views, default to 0
    },
    thumbnailURL: {
      type: String, // URL string for a thumbnail image (optional)
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    externalLinks: [
      {
        type: String, // Array of external URLs (optional)
      },
    ],
    excerpt: { type: String, default: "" },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

postSchema.index({ deleted: 1, createdAt: -1 });
postSchema.virtual("shortExcerpt").get(function () {
  const stripHTML = (html) => html.replace(/<[^>]+>/g, ""); // Simple HTML stripper
  const generateExcerpt = (text, wordLimit = 40) => {
    return text.split(" ").slice(0, wordLimit).join(" ") + "...";
  };

  if (this.excerpt && this.excerpt.trim()) {
    return this.excerpt;
  }

  const plainText = stripHTML(this.content || "");
  return generateExcerpt(plainText);
});
postSchema.pre("save", function (next) {
  if (!this.excerpt || !this.excerpt.trim()) {
    const plainText = this.content.replace(/<[^>]+>/g, "");
    this.excerpt = plainText.split(" ").slice(0, 40).join(" ") + "...";
  }
  next();
});

//Possible to remove later, is a fallback for now
postSchema.methods.getExcerpt = function (options = {}) {
  const stripHTML = (html) => html.replace(/<[^>]+>/g, "");
  const wordLimit = options.wordLimit || 40;

  if (typeof options.override === "function") {
    return options.override(this);
  }

  if (this.excerpt && this.excerpt.trim()) return this.excerpt;

  const plainText = stripHTML(this.content || "");
  return plainText.split(" ").slice(0, wordLimit).join(" ") + "...";
};

// Export the Post model based on the schema
export default mongoose.model("Post", postSchema);
