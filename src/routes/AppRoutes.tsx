import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { ClerkProvider } from "@clerk/clerk-react";

// Public pages
import { LandingPage } from "../pages/LandingPage";

// Student pages
import { StudentDashboard } from "../pages/student/StudentDashboard";
import Profile from "../pages/student/Profile";
import ProjectList from "../pages/student/ProjectList";
import AppliedProjects from "../pages/student/AppliedProjects";
import StudentApplication from "../pages/student/Applications";
import ApplicationSubmission from "../pages/student/ApplicationSubmission";
import Notifications from "../pages/student/Notifications";
import StudentSettings from "../pages/student/Settings";
import Certificates from "../pages/student/Certificates";
import StudentAIResume from "../pages/student/AIResume";
import StudentPlacementPrep from "../pages/student/PlacementPrep";
import StudentRoadmap from "../pages/student/StudentRoadmap";
import StudentBroadcast from "../pages/student/StudentBroadcast";
import StudentHiring from "../pages/student/HiringProcess";
import AIInterview from "../pages/student/AIInterview";
import FinalScoreCard from "../pages/student/FinalScoreCard";

// Admin pages
import { AdminDashboard } from "../pages/AdminDashboard";
import { AdminPortalIndex } from "../pages/admin/AdminPortalIndex";

// College pages
import { CollegeDashboard } from "../pages/college/CollegeDashboard";
import CollegeProfile from "../pages/college/Profile";
import CollegeSettings from "../pages/college/Settings";
import CollegeStudentManagement from "../pages/college/StudentManagement";
import CollegeRecruiterManagement from "../pages/college/RecruiterManagement";

// Recruiter pages
import RecruiterDashboardNew from "../pages/recruiter/RecruiterDashboard";
import RecruiterPostJob from "../pages/recruiter/PostJob";
import RecruiterMyPostings from "../pages/recruiter/MyJobPostings";
import RecruiterApplications from "../pages/recruiter/ApplicationsReports";
import RecruiterCandidateDossier from "../pages/recruiter/CandidateDossier";
import RecruiterPipeline from "../pages/recruiter/PipelineManagement";
import RecruiterMessages from "../pages/recruiter/Messages";
import RecruiterSettings from "../pages/recruiter/RecruiterSettings";

// Mentor
import { MentorDashboard } from "../pages/MentorDashboard";

// Auth
import { AuthProvider } from "../context/AuthContext";
import { ProtectedRoute } from "./ProtectedRoute";
import { ProtectedAdminRoute } from "../components/auth/ProtectedAdminRoute";

const PUBLISHABLE_KEY =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export const AppRoutes: React.FC = () => {
  if (!PUBLISHABLE_KEY) {
    throw new Error(
      "Missing Publishable Key. Please set VITE_CLERK_PUBLISHABLE_KEY in .env",
    );
  }

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
    >
      <AuthProvider>
        <BrowserRouter>
          <Routes>

            {/* =====================================================
                PUBLIC ROUTES
            ===================================================== */}

            <Route
              path="/"
              element={<LandingPage />}
            />

            {/* =====================================================
                ADMIN ROUTES
            ===================================================== */}

            <Route
              path="/admin"
              element={<AdminPortalIndex />}
            />

            <Route
              path="/admin/login"
              element={<AdminPortalIndex />}
            />

            <Route
              path="/admin-login"
              element={<AdminPortalIndex />}
            />

            {/* Protected Admin Workspace */}

            <Route
              path="/admin/*"
              element={<ProtectedAdminRoute />}
            >
              <Route
                index
                element={
                  <Navigate
                    to="dashboard"
                    replace
                  />
                }
              />

              <Route
                path="dashboard"
                element={<AdminDashboard />}
              />

              <Route
                path="users"
                element={<AdminDashboard />}
              />

              <Route
                path="user-management"
                element={<AdminDashboard />}
              />

              <Route
                path="content"
                element={<AdminDashboard />}
              />

              <Route
                path="content-hub"
                element={<AdminDashboard />}
              />

              <Route
                path="placement"
                element={<AdminDashboard />}
              />

              <Route
                path="placement-oversight"
                element={<AdminDashboard />}
              />

              <Route
                path="verification"
                element={<AdminDashboard />}
              />

              <Route
                path="verification-queue"
                element={<AdminDashboard />}
              />

              <Route
                path="broadcast"
                element={<AdminDashboard />}
              />

              <Route
                path="broadcast-control"
                element={<AdminDashboard />}
              />

              <Route
                path="analytics"
                element={<AdminDashboard />}
              />

              <Route
                path="support"
                element={<AdminDashboard />}
              />

              <Route
                path="settings"
                element={<AdminDashboard />}
              />

              <Route
                path="*"
                element={<AdminDashboard />}
              />
            </Route>

            {/* Admin Dashboard */}

            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute
                  allowedRoles={["admin"]}
                >
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin-dashboard/*"
              element={
                <ProtectedRoute
                  allowedRoles={["admin"]}
                >
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* =====================================================
                STUDENT ROUTES
            ===================================================== */}

            <Route
              path="/student-dashboard"
              element={
                <ProtectedRoute
                  allowedRoles={["student"]}
                >
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute
                  allowedRoles={["student"]}
                >
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/profile"
              element={
                <ProtectedRoute
                  allowedRoles={["student"]}
                >
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/projects"
              element={
                <ProtectedRoute
                  allowedRoles={["student"]}
                >
                  <ProjectList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/applied-projects"
              element={
                <ProtectedRoute
                  allowedRoles={["student"]}
                >
                  <AppliedProjects />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/notifications"
              element={
                <ProtectedRoute
                  allowedRoles={["student"]}
                >
                  <Notifications />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/settings"
              element={
                <ProtectedRoute
                  allowedRoles={["student"]}
                >
                  <StudentSettings />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/certificates"
              element={
                <ProtectedRoute
                  allowedRoles={["student"]}
                >
                  <Certificates />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/applications"
              element={
                <ProtectedRoute
                  allowedRoles={["student"]}
                >
                  <StudentApplication />
                </ProtectedRoute>
              }
            />

            {/* =====================================================
                PLACEMENT PREPARATION
            ===================================================== */}

            <Route
              path="/student/placementprep"
              element={
                <ProtectedRoute
                  allowedRoles={["student"]}
                >
                  <StudentPlacementPrep />
                </ProtectedRoute>
              }
            />

            {/* =====================================================
                APPLICATION SUBMISSION
            ===================================================== */}

            <Route
              path="/student/application-submission/:driveId"
              element={
                <ProtectedRoute
                  allowedRoles={["student"]}
                >
                  <ApplicationSubmission />
                </ProtectedRoute>
              }
            />

            {/* =====================================================
                AI RESUME
            ===================================================== */}

            <Route
              path="/student/ai-resume"
              element={
                <ProtectedRoute
                  allowedRoles={["student"]}
                >
                  <StudentAIResume />
                </ProtectedRoute>
              }
            />

            {/* =====================================================
                ROADMAP
            ===================================================== */}

            <Route
              path="/student/roadmap"
              element={
                <ProtectedRoute
                  allowedRoles={["student"]}
                >
                  <StudentRoadmap />
                </ProtectedRoute>
              }
            />

            {/* =====================================================
                BROADCAST
            ===================================================== */}

            <Route
              path="/student/broadcast"
              element={
                <ProtectedRoute
                  allowedRoles={["student"]}
                >
                  <StudentBroadcast />
                </ProtectedRoute>
              }
            />

            {/* =====================================================
                HIRING PROCESS
            ===================================================== */}

            <Route
              path="/student/hiring-process/:driveId"
              element={
                <ProtectedRoute
                  allowedRoles={["student"]}
                >
                  <StudentHiring />
                </ProtectedRoute>
              }
            />

            {/* =====================================================
                AI INTERVIEW
            ===================================================== */}

            <Route
              path="/student/ai-interview/:driveId"
              element={
                <ProtectedRoute
                  allowedRoles={["student"]}
                >
                  <AIInterview />
                </ProtectedRoute>
              }
            />

            {/* =====================================================
                FINAL SCORECARD
            ===================================================== */}

            <Route
              path="/student/final-scorecard"
              element={
                <ProtectedRoute
                  allowedRoles={["student"]}
                >
                  <FinalScoreCard />
                </ProtectedRoute>
              }
            />
            {/* =====================================================
                COLLEGE ROUTES
            ===================================================== */}

            <Route
              path="/college-dashboard"
              element={
                <ProtectedRoute
                  allowedRoles={["college"]}
                >
                  <CollegeDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/college/profile"
              element={
                <ProtectedRoute
                  allowedRoles={["college"]}
                >
                  <CollegeProfile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/college/students-management"
              element={
                <ProtectedRoute
                  allowedRoles={["college"]}
                >
                  <CollegeStudentManagement />
                </ProtectedRoute>
              }
            />

            <Route
              path="/college/recruiter-management"
              element={
                <ProtectedRoute
                  allowedRoles={["college"]}
                >
                  <CollegeRecruiterManagement />
                </ProtectedRoute>
              }
            />

            <Route
              path="/college/settings"
              element={
                <ProtectedRoute
                  allowedRoles={["college"]}
                >
                  <CollegeSettings />
                </ProtectedRoute>
              }
            />

            {/* =====================================================
                RECRUITER ROUTES
            ===================================================== */}

            <Route
              path="/recruiter-dashboard"
              element={
                <ProtectedRoute
                  allowedRoles={["recruiter"]}
                >
                  <RecruiterDashboardNew />
                </ProtectedRoute>
              }
            />

            <Route
              path="/recruiter/dashboard"
              element={
                <ProtectedRoute
                  allowedRoles={["recruiter"]}
                >
                  <RecruiterDashboardNew />
                </ProtectedRoute>
              }
            />

            <Route
              path="/recruiter/post-job"
              element={
                <ProtectedRoute
                  allowedRoles={["recruiter"]}
                >
                  <RecruiterPostJob />
                </ProtectedRoute>
              }
            />

            <Route
              path="/recruiter/my-postings"
              element={
                <ProtectedRoute
                  allowedRoles={["recruiter"]}
                >
                  <RecruiterMyPostings />
                </ProtectedRoute>
              }
            />

            <Route
              path="/recruiter/applications"
              element={
                <ProtectedRoute
                  allowedRoles={["recruiter"]}
                >
                  <RecruiterApplications />
                </ProtectedRoute>
              }
            />

            <Route
              path="/recruiter/candidate/:id"
              element={
                <ProtectedRoute
                  allowedRoles={["recruiter"]}
                >
                  <RecruiterCandidateDossier />
                </ProtectedRoute>
              }
            />

            <Route
              path="/recruiter/shortlisted-candidates"
              element={
                <ProtectedRoute
                  allowedRoles={["recruiter"]}
                >
                  <RecruiterPipeline />
                </ProtectedRoute>
              }
            />

            <Route
              path="/recruiter/pipeline"
              element={
                <ProtectedRoute
                  allowedRoles={["recruiter"]}
                >
                  <RecruiterPipeline />
                </ProtectedRoute>
              }
            />

            <Route
              path="/recruiter/messages"
              element={
                <ProtectedRoute
                  allowedRoles={["recruiter"]}
                >
                  <RecruiterMessages />
                </ProtectedRoute>
              }
            />

            <Route
              path="/recruiter/settings"
              element={
                <ProtectedRoute
                  allowedRoles={["recruiter"]}
                >
                  <RecruiterSettings />
                </ProtectedRoute>
              }
            />

            {/* =====================================================
                MENTOR ROUTES
            ===================================================== */}

            <Route
              path="/mentor-dashboard"
              element={
                <ProtectedRoute
                  allowedRoles={["mentor"]}
                >
                  <MentorDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/mentor/dashboard"
              element={
                <ProtectedRoute
                  allowedRoles={["mentor"]}
                >
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