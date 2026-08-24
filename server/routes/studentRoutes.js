import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getProfile,
  updateProfile,
  getDashboard,
  getProjects,
  applyForProject,
  getApplications,
  getApplicationDetails,
  withdrawApplication,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  getCertificates,
  uploadCertificate,
  updateCertificate,
  deleteCertificate,
  getSettings,
  updateSettings
} from '../controllers/studentController.js';

const router = express.Router();

// Apply auth middleware to all student routes
router.use(protect);

// Profile routes
router.route('/profile')
  .get(getProfile)
  .put(updateProfile);

// Dashboard routes
router.get('/dashboard', getDashboard);

// Project & Application routes
router.get('/projects', getProjects);
router.post('/projects/:projectId/apply', applyForProject);

router.get('/applications', getApplications);
router.route('/applications/:id')
  .get(getApplicationDetails)
  .delete(withdrawApplication);

// Notification routes
router.get('/notifications', getNotifications);
router.patch('/notifications/all/read', markAllNotificationsRead);
router.route('/notifications/:id')
  .delete(deleteNotification);
router.patch('/notifications/:id/read', markNotificationRead);

// Certificate routes
router.route('/certificates')
  .get(getCertificates)
  .post(uploadCertificate);
router.route('/certificates/:id')
  .put(updateCertificate)
  .delete(deleteCertificate);

// Settings routes
router.route('/settings')
  .get(getSettings)
  .put(updateSettings);

export default router;
