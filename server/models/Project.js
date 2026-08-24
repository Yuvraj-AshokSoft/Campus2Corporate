import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    techStack: [
      {
        type: String,
      },
    ],
    category: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Open', 'Closed', 'Completed', 'In Progress'],
      default: 'Open',
    },
    stipend: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model('Project', projectSchema);
export default Project;
