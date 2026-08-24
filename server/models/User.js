import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      enum: {
        values: ['student', 'mentor', 'college', 'recruiter'],
        message: '{VALUE} is not a valid role',
      },
    },
    college: { type: String, trim: true },
    branch: { type: String, trim: true },
    semester: { type: String, trim: true },
    location: { type: String, trim: true },
    bio: { type: String },
    github: { type: String, trim: true },
    linkedIn: { type: String, trim: true },
    portfolio: { type: String, trim: true },
    resume: { type: String },
    resumeUrl: { type: String },
    status: { type: String, default: 'Placement track active' },
    skills: [{ type: String }],
    education: [
      {
        institution: String,
        degree: String,
        year: String,
        score: String,
      }
    ],
    settings: {
      notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        assignments: { type: Boolean, default: true },
        mentorSessions: { type: Boolean, default: true },
        marketing: { type: Boolean, default: false },
      },
      privacy: {
        recruiterVisible: { type: Boolean, default: true },
        leaderboard: { type: Boolean, default: true },
        twoFactor: { type: Boolean, default: false },
      },
      theme: { type: String, enum: ['light', 'dark', 'system'], default: 'light' },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
