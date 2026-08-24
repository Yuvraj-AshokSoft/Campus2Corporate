import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    issuer: {
      type: String,
      required: true,
    },
    issuedOn: {
      type: Date,
    },
    credentialId: {
      type: String,
    },
    downloadUrl: {
      type: String,
    },
    shareUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: ['earned', 'in-progress'],
      default: 'earned',
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
    },
    icon: {
      type: String,
      default: 'award',
    },
    color: {
      type: String,
      default: '#5400D6',
    },
  },
  {
    timestamps: true,
  }
);

const Certificate = mongoose.model('Certificate', certificateSchema);
export default Certificate;
