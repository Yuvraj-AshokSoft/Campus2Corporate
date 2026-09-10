import mongoose from "mongoose";

const broadcastSchema = new mongoose.Schema(
  {
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },

    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },

    message: {
      type: String,
      required: [true, "Message content is required"],
      trim: true,
      maxlength: [3000, "Message cannot exceed 3000 characters"],
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
      enum: ["Low", "Normal", "High", "Urgent", "Critical", "low", "standard", "high", "urgent", "critical"],
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
      enum: ["Draft", "Sent", "Delivered", "Scheduled", "Archived"],
      default: "Sent",
    },

    openRate: {
      type: String,
      default: "--",
    },

    clickRate: {
      type: String,
      default: "--",
    },

    sentAt: {
      type: Date,
      default: Date.now,
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

broadcastSchema.index({ college: 1, createdAt: -1 });
broadcastSchema.index({ createdBy: 1, createdAt: -1 });
broadcastSchema.index({ targetAudience: 1, createdAt: -1 });
broadcastSchema.index({ status: 1 });

export default mongoose.model("Broadcast", broadcastSchema);
