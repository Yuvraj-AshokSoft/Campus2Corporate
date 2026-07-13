import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClerkProvider } from '@clerk/clerk-react';

import { LandingPage } from '../pages/LandingPage';
import { StudentDashboard } from '../pages/student/StudentDashboard';
import { AdminDashboard } from '../pages/AdminDashboard';
import { CollegeDashboard } from '../pages/college/CollegeDashboard';
import { RecruiterDashboard } from '../pages/RecruiterDashboard';
import { MentorDashboard } from '../pages/MentorDashboard';

import { AuthProvider } from '../context/AuthContext';
import { ProtectedRoute } from './ProtectedRoute';
import Analytics from "../pages/admin/analytics";
import UserManagement from "../pages/admin/userManagement";
import CompanyManagement from "../pages/admin/companyManagement";
import Settings from "../pages/admin/settings";

import Profile from "../pages/student/Profile";
import ProjectList from "../pages/student/ProjectList";
import AppliedProjects from "../pages/student/AppliedProjects";
import Notifications from "../pages/student/Notifications";
import StudentSettings from "../pages/student/Settings";
import Certificates from "../pages/student/Certificates";

import CollegeProfile from "../pages/college/Profile";
import CollegeSettings from "../pages/college/Settings";
import CollegeStudent from "../pages/college/Student";

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

            {/* Admin routes */}
            <Route 
              path="/admin-dashboard" 
              element={
                <ProtectedRoute>
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
              path="/college/dashboard" 
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
              path="/college/students"
              element={
                <ProtectedRoute allowedRoles={["college"]}>
                  <CollegeStudent />
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

            <Route path="/admin-dashboard/analytics" element={<Analytics />} />

<Route path="/admin-dashboard/users" element={<UserManagement />} />

<Route path="/admin-dashboard/companies" element={<CompanyManagement />} />

<Route path="/admin-dashboard/settings" element={<Settings />} />


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