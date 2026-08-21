import mongoose from "mongoose";

const applicationStatusHistorySchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
      index: true,
    },
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
      index: true,
    },
    oldStatus: {
      type: String,
      default: null,
    },
    newStatus: {
      type: String,
      required: true,
      enum: [
        "Applied",
        "Under Review",
        "Shortlisted",
        "Interview",
        "Selected",
        "Rejected",
      ],
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
    },
    changedByRole: {
      type: String,
      default: "college",
    },
    remarks: {
      type: String,
      trim: true,
      default: "",
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

applicationStatusHistorySchema.index({ application: 1, changedAt: -1 });
applicationStatusHistorySchema.index({ college: 1, changedAt: -1 });

export default mongoose.model(
  "ApplicationStatusHistory",
  applicationStatusHistorySchema
);
