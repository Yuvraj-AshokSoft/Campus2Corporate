import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ClerkProvider } from '@clerk/clerk-react';

import { LandingPage } from '../pages/LandingPage';
import { StudentDashboard } from '../pages/student/StudentDashboard';
import { AdminDashboard } from '../pages/AdminDashboard';
import { CollegeDashboard } from '../pages/college/CollegeDashboard';
import { RecruiterDashboard } from '../pages/RecruiterDashboard';
import { MentorDashboard } from '../pages/MentorDashboard';

import { AdminPortalIndex } from '../pages/admin/AdminPortalIndex';

import { AuthProvider } from '../context/AuthContext';
import { ProtectedRoute } from './ProtectedRoute';
import { ProtectedAdminRoute } from '../components/auth/ProtectedAdminRoute';

import Profile from "../pages/student/Profile";
import ProjectList from "../pages/student/ProjectList";
import AppliedProjects from "../pages/student/AppliedProjects";
import Notifications from "../pages/student/Notifications";
import StudentSettings from "../pages/student/Settings";
import Certificates from "../pages/student/Certificates";

import CollegeProfile from "../pages/college/Profile";
import CollegeSettings from "../pages/college/Settings";
import CollegeStudentManagement from "../pages/college/StudentManagement";
import CollegeRecruiterManagement from "../pages/college/RecruiterManagement";
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export const AppRoutes: React.FC = () => {
  if (!PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key. Please set VITE_CLERK_PUBLISHABLE_KEY in .env");
  }

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Landing route */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/admin" element={<AdminPortalIndex />} />
            <Route path="/admin/login" element={<AdminPortalIndex />} />
            <Route path="/admin-login" element={<AdminPortalIndex />} />


            {/* Protected Admin Workspace Sub-Routes under /admin/* */}
            <Route path="/admin/*" element={<ProtectedAdminRoute />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminDashboard />} />
              <Route path="user-management" element={<AdminDashboard />} />
              <Route path="content" element={<AdminDashboard />} />
              <Route path="content-hub" element={<AdminDashboard />} />
              <Route path="placement" element={<AdminDashboard />} />
              <Route path="placement-oversight" element={<AdminDashboard />} />
              <Route path="verification" element={<AdminDashboard />} />
              <Route path="verification-queue" element={<AdminDashboard />} />
              <Route path="broadcast" element={<AdminDashboard />} />
              <Route path="broadcast-control" element={<AdminDashboard />} />
              <Route path="analytics" element={<AdminDashboard />} />
              <Route path="support" element={<AdminDashboard />} />
              <Route path="settings" element={<AdminDashboard />} />
              <Route path="*" element={<AdminDashboard />} />
            </Route>

            {/* Admin Dashboard routes */}
            <Route 
              path="/admin-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin-dashboard/*" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Student routes */}
            <Route 
              path="/student-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
            <Route
              path="/student/profile"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/projects"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <ProjectList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/applied-projects"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <AppliedProjects />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/notifications"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <Notifications />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/settings"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/certificates"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <Certificates />
                </ProtectedRoute>
              }
            />

            {/* College routes */}
            <Route 
              path="/college-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['college']}>
                  <CollegeDashboard />
                </ProtectedRoute>
              } 
            />
            <Route
              path="/college/profile"
              element={
                <ProtectedRoute allowedRoles={["college"]}>
                  <CollegeProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/college/students-management"
              element={
                <ProtectedRoute allowedRoles={["college"]}>
                  <CollegeStudentManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/college/recruiter-management"
              element={
                <ProtectedRoute allowedRoles={["college"]}>
                  <CollegeRecruiterManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/college/settings"
              element={
                <ProtectedRoute allowedRoles={["college"]}>
                  <CollegeSettings />
                </ProtectedRoute>
              }
            />
            {/* Recruiter routes */}
            <Route 
              path="/recruiter-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['recruiter']}>
                  <RecruiterDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/recruiter/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['recruiter']}>
                  <RecruiterDashboard />
                </ProtectedRoute>
              } 
            />


            {/* Mentor routes */}
            <Route 
              path="/mentor-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['mentor']}>
                  <MentorDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/mentor/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['mentor']}>
                  <MentorDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ClerkProvider>
  );
};