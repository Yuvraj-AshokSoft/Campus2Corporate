import User from '../models/User.js';
import Project from '../models/Project.js';
import Application from '../models/Application.js';
import Notification from '../models/Notification.js';
import Certificate from '../models/Certificate.js';

// =======================
// Profile
// =======================

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { fullName, phone, college, branch, semester, location, bio, github, linkedIn, portfolio, skills } = req.body;

    user.fullName = fullName || user.fullName;
    user.phone = phone || user.phone;
    user.college = college || user.college;
    user.branch = branch || user.branch;
    user.semester = semester || user.semester;
    user.location = location || user.location;
    user.bio = bio || user.bio;
    user.github = github || user.github;
    user.linkedIn = linkedIn || user.linkedIn;
    user.portfolio = portfolio || user.portfolio;
    
    if (skills) {
      user.skills = skills;
    }

    const updatedUser = await user.save();
    res.json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// Dashboard
// =======================

export const getDashboard = async (req, res) => {
  try {
    const applicationsCount = await Application.countDocuments({ studentId: req.user._id });
    const certificatesCount = await Certificate.countDocuments({ studentId: req.user._id, status: 'earned' });
    
    const recentApplications = await Application.find({ studentId: req.user._id })
      .sort({ appliedOn: -1 })
      .limit(5)
      .populate('projectId', 'title company location');

    res.json({
      success: true,
      data: {
        stats: {
          applications: applicationsCount,
          certificates: certificatesCount,
          placementReadiness: 75,
        },
        recentActivity: recentApplications,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// Projects & Applications
// =======================

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({});
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const applyForProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const alreadyApplied = await Application.findOne({ studentId: req.user._id, projectId });
    if (alreadyApplied) {
      return res.status(400).json({ message: 'You have already applied for this project' });
    }

    const application = await Application.create({
      studentId: req.user._id,
      projectId,
      status: 'Applied',
    });

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ studentId: req.user._id }).populate('projectId');
    
    // Format the applications to match what the frontend expects
    const formatted = applications.map(app => ({
      id: app._id,
      title: app.projectId?.title || 'Unknown Project',
      company: app.projectId?.company || 'Unknown Company',
      location: app.projectId?.location || 'Remote',
      appliedOn: app.appliedOn,
      status: app.status,
      stipend: app.projectId?.stipend || 'Unpaid',
      skills: app.projectId?.techStack || [],
    }));

    res.json({ success: true, data: { applications: formatted } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getApplicationDetails = async (req, res) => {
  try {
    const application = await Application.findOne({ _id: req.params.id, studentId: req.user._id }).populate('projectId');
    if (!application) return res.status(404).json({ message: 'Application not found' });
    res.json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const withdrawApplication = async (req, res) => {
  try {
    const application = await Application.findOneAndDelete({ _id: req.params.id, studentId: req.user._id });
    if (!application) return res.status(404).json({ message: 'Application not found' });
    res.json({ success: true, message: 'Application withdrawn' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// Notifications
// =======================

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ studentId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, studentId: req.user._id },
      { isRead: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany({ studentId: req.user._id }, { isRead: true });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({ _id: req.params.id, studentId: req.user._id });
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// Certificates
// =======================

export const getCertificates = async (req, res) => {
  try {
    const earned = await Certificate.find({ studentId: req.user._id, status: 'earned' });
    const inProgress = await Certificate.find({ studentId: req.user._id, status: 'in-progress' });
    
    // Map _id to id for the frontend
    const mapToId = (cert) => ({ ...cert.toObject(), id: cert._id });

    res.json({ success: true, data: { earned: earned.map(mapToId), inProgress: inProgress.map(mapToId) } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadCertificate = async (req, res) => {
  try {
    const cert = await Certificate.create({ ...req.body, studentId: req.user._id });
    res.status(201).json({ success: true, data: cert });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCertificate = async (req, res) => {
  try {
    const cert = await Certificate.findOneAndUpdate(
      { _id: req.params.id, studentId: req.user._id },
      req.body,
      { new: true }
    );
    if (!cert) return res.status(404).json({ message: 'Certificate not found' });
    res.json({ success: true, data: cert });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCertificate = async (req, res) => {
  try {
    const cert = await Certificate.findOneAndDelete({ _id: req.params.id, studentId: req.user._id });
    if (!cert) return res.status(404).json({ message: 'Certificate not found' });
    res.json({ success: true, message: 'Certificate deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// Settings
// =======================

export const getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('email settings');
    res.json({ success: true, data: { email: user.email, settings: user.settings } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (req.body.settings) {
      // Merge settings to avoid overwriting nested objects completely if they only pass partial
      user.settings = {
        ...user.settings,
        ...req.body.settings,
      };
      await user.save();
    }
    
    res.json({ success: true, data: user.settings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
