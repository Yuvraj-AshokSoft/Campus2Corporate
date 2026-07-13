import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    technology: [
      {
        type: String,
      },
    ],
    githubLink: {
      type: String,
    },
    liveLink: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Ongoing"],
      default: "Pending",
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Project", projectSchema);