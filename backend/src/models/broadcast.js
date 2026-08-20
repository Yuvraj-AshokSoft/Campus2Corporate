import mongoose from "mongoose";

const broadcastSchema = new mongoose.Schema(
  {
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: [true, "College reference is required"],
    },

    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },

    message: {
      type: String,
      required: [true, "Message content is required"],
      trim: true,
    },

    content: {
      type: String,
      trim: true,
    },

    snippet: {
      type: String,
      trim: true,
    },

    targetAudience: {
      type: String,
      default: "All",
      trim: true,
    },

    priority: {
      type: String,
      enum: ["Low", "Normal", "High", "Urgent"],
      default: "Normal",
    },

    isUrgent: {
      type: Boolean,
      default: false,
    },

    category: {
      type: String,
      default: "General",
      trim: true,
    },

    status: {
      type: String,
      enum: ["Draft", "Sent", "Archived"],
      default: "Sent",
    },

    readCount: {
      type: Number,
      default: 0,
    },

    totalCount: {
      type: Number,
      default: 0,
    },

    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Broadcast", broadcastSchema);
