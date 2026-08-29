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
      required: true,
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },

    status: {
      type: String,
      enum: [
        "Applied",
        "Under Review",
        "Shortlisted",
        "Interview",
        "Selected",
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
applicationSchema.index({ company: 1 });
applicationSchema.index({ project: 1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ createdAt: -1 });

export default mongoose.model("Application", applicationSchema);