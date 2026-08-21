import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const collegeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "College name is required"],
      trim: true,
      minlength: [3, "College name must be at least 3 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
        "Please enter a valid email address",
      ],
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },

    university: {
      type: String,
      trim: true,
      default: "",
    },

    code: {
      type: String,
      trim: true,
      uppercase: true,
      default: "",
    },

    website: {
      type: String,
      trim: true,
      default: "",
    },

    address: {
      type: String,
      trim: true,
      default: "",
    },

    city: {
      type: String,
      trim: true,
      default: "",
    },

    state: {
      type: String,
      trim: true,
      default: "",
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    placementOfficerName: {
      type: String,
      trim: true,
      default: "",
    },

    placementOfficerEmail: {
      type: String,
      trim: true,
      default: "",
    },

    placementOfficerPhone: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Hash Password Before Saving
collegeSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare Password
collegeSchema.methods.comparePassword = async function (enteredPassword) {
  if (!this.password) {
    return false;
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("College", collegeSchema);