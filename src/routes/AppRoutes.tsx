import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";

// ─────────────────────────────────────────────────────────────────────────────
// Public
// ─────────────────────────────────────────────────────────────────────────────

import { LandingPage } from "../pages/LandingPage";

// ─────────────────────────────────────────────────────────────────────────────
// Dashboards
// ─────────────────────────────────────────────────────────────────────────────

import { StudentDashboard } from "../pages/student/StudentDashboard";
import { CollegeDashboard } from "../pages/college/CollegeDashboard";
import { RecruiterDashboard } from "../pages/RecruiterDashboard";
import { MentorDashboard } from "../pages/MentorDashboard";

// ─────────────────────────────────────────────────────────────────────────────
// Authentication
// ─────────────────────────────────────────────────────────────────────────────

import { AuthProvider } from "../context/AuthContext";
import { ProtectedRoute } from "./ProtectedRoute";

// ─────────────────────────────────────────────────────────────────────────────
// Admin Pages
// ─────────────────────────────────────────────────────────────────────────────


// ─────────────────────────────────────────────────────────────────────────────
// Student Pages
// ─────────────────────────────────────────────────────────────────────────────

import Profile from "../pages/student/Profile";
import ProjectList from "../pages/student/ProjectList";
import StudentApplication from "../pages/student/Applications";
import Notifications from "../pages/student/Notifications";
import StudentSettings from "../pages/student/Settings";
import Certificates from "../pages/student/Certificates";
import StudentAIResume from "../pages/student/AIResume";
import StudentPlacementPrep from "../pages/student/PlacementPrep";
import StudentRoadmap from "../pages/student/StudentRoadmap";
import StudentBroadcast from "../pages/student/StudentBroadcast"
import StudentHiring from "../pages/student/HiringProcess";
// ─────────────────────────────────────────────────────────────────────────────
// College Pages
// ─────────────────────────────────────────────────────────────────────────────

import CollegeProfile from "../pages/college/Profile";
import CollegeSettings from "../pages/college/Settings";
import CollegeStudentManagement from "../pages/college/StudentManagement";
import CollegeRecruiterManagement from "../pages/college/RecruiterManagement";

// ─────────────────────────────────────────────────────────────────────────────
// Clerk
// ─────────────────────────────────────────────────────────────────────────────

const PUBLISHABLE_KEY =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export const AppRoutes: React.FC = () => {
  if (!PUBLISHABLE_KEY) {
    throw new Error(
      "Missing Publishable Key. Please set VITE_CLERK_PUBLISHABLE_KEY in .env"
    );
  }

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>

            {/* ═══════════════════════════════════════════════════════════════
                PUBLIC ROUTES
            ═══════════════════════════════════════════════════════════════ */}

            <Route
              path="/"
              element={<LandingPage />}
            />

            {/* ═══════════════════════════════════════════════════════════════
                ADMIN ROUTES
            ═══════════════════════════════════════════════════════════════ */}
{/* 
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin-dashboard/analytics"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Analytics />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin-dashboard/users"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <UserManagement />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin-dashboard/companies"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <CompanyManagement />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin-dashboard/settings"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Settings />
                </ProtectedRoute>
              }
            /> */}

            {/* ═══════════════════════════════════════════════════════════════
                STUDENT ROUTES
            ═══════════════════════════════════════════════════════════════ */}

            {/* Student Dashboard */}
            <Route
              path="/student-dashboard"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />

            {/* Alternate Dashboard URL */}
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />

            {/* Student Profile */}
            <Route
              path="/student/profile"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Project List */}
            <Route
              path="/student/projects"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <ProjectList />
                </ProtectedRoute>
              }
            />

            {/* Applied Projects */}
            <Route
              path="/student/applications"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentApplication />
                </ProtectedRoute>
              }
            />

            {/* AI Hiring */}
            <Route
              path="/student/placementprep"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentPlacementPrep  />
                </ProtectedRoute>
              }
            />

            {/* Notifications */}
            <Route
              path="/student/notifications"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <Notifications />
                </ProtectedRoute>
              }
            />

            {/* Certificates */}
            <Route
              path="/student/certificates"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <Certificates />
                </ProtectedRoute>
              }
            />

            {/* AI Resume */}
            <Route
              path="/student/ai-resume"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentAIResume />
                </ProtectedRoute>
              }
            />

            {/* Student Roadmap */}
            <Route
              path="/student/roadmap"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentRoadmap />
                </ProtectedRoute>
              }
            />

            {/* Student Settings */}
            <Route
              path="/student/settings"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentSettings />
                </ProtectedRoute>
              }
            />
            {/* Student Broadcast */}
            <Route
              path="/student/broadcast"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentBroadcast />
                </ProtectedRoute>
              }
            />
            {/* Student Hiring */}
            <Route
              path="/student/hiring-process"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentHiring />
                </ProtectedRoute>
              }
            />
            {/* ═══════════════════════════════════════════════════════════════
                COLLEGE ROUTES
            ═══════════════════════════════════════════════════════════════ */}

            {/* College Dashboard */}
            <Route
              path="/college-dashboard"
              element={
                <ProtectedRoute allowedRoles={["college"]}>
                  <CollegeDashboard />
                </ProtectedRoute>
              }
            />

            {/* College Profile */}
            <Route
              path="/college/profile"
              element={
                <ProtectedRoute allowedRoles={["college"]}>
                  <CollegeProfile />
                </ProtectedRoute>
              }
            />

            {/* College Student Management */}
            <Route
              path="/college/students-management"
              element={
                <ProtectedRoute allowedRoles={["college"]}>
                  <CollegeStudentManagement />
                </ProtectedRoute>
              }
            />

            {/* College Recruiter Management */}
            <Route
              path="/college/recruiter-management"
              element={
                <ProtectedRoute allowedRoles={["college"]}>
                  <CollegeRecruiterManagement />
                </ProtectedRoute>
              }
            />

            {/* College Settings */}
            <Route
              path="/college/settings"
              element={
                <ProtectedRoute allowedRoles={["college"]}>
                  <CollegeSettings />
                </ProtectedRoute>
              }
            />

            {/* ═══════════════════════════════════════════════════════════════
                RECRUITER ROUTES
            ═══════════════════════════════════════════════════════════════ */}

            <Route
              path="/recruiter-dashboard"
              element={
                <ProtectedRoute allowedRoles={["recruiter"]}>
                  <RecruiterDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/recruiter/dashboard"
              element={
                <ProtectedRoute allowedRoles={["recruiter"]}>
                  <RecruiterDashboard />
                </ProtectedRoute>
              }
            />

            {/* ═══════════════════════════════════════════════════════════════
                MENTOR ROUTES
            ═══════════════════════════════════════════════════════════════ */}

            <Route
              path="/mentor-dashboard"
              element={
                <ProtectedRoute allowedRoles={["mentor"]}>
                  <MentorDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/mentor/dashboard"
              element={
                <ProtectedRoute allowedRoles={["mentor"]}>
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