import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recruiter",
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },

    placementDrive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlacementDrive",
    },

    drive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlacementDrive",
    },

    status: {
      type: String,
      enum: [
        "Applied",
        "Under Review",
        "Shortlisted",
        "Interview",
        "Interviewed",
        "Offered",
        "Selected",
        "Placed",
        "Rejected",
      ],
      default: "Applied",
    },

    resume: {
      type: String,
    },

    coverLetter: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

applicationSchema.index({ student: 1 });
applicationSchema.index({ recruiter: 1 });
applicationSchema.index({ company: 1 });
applicationSchema.index({ project: 1 });
applicationSchema.index({ placementDrive: 1 });
applicationSchema.index({ drive: 1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ createdAt: -1 });

export default mongoose.model("Application", applicationSchema);