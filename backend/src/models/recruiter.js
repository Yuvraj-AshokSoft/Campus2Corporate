import mongoose from "mongoose";

const recruiterSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    contactPerson: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
    },
    companyLogo: {
      type: String,
    },
    company: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Company",
},
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Recruiter", recruiterSchema);