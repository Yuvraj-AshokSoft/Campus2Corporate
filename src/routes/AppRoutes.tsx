import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { LandingPage } from "../pages/LandingPage";
import { StudentDashboard } from "../pages/StudentDashboard";
import { AdminDashboard } from "../pages/AdminDashboard";
import { CollegeDashboard } from "../pages/CollegeDashboard";
import { RecruiterDashboard } from "../pages/RecruiterDashboard";
import { MentorDashboard } from "../pages/MentorDashboard";

import { DashboardLayout } from "../components/layout/DashboardLayout";

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route
          path="/admin-dashboard"
          element={
            <DashboardLayout>
              <AdminDashboard />
            </DashboardLayout>
          }
        />

        <Route
          path="/student-dashboard"
          element={
            <DashboardLayout>
              <StudentDashboard />
            </DashboardLayout>
          }
        />

        <Route
          path="/college-dashboard"
          element={
            <DashboardLayout>
              <CollegeDashboard />
            </DashboardLayout>
          }
        />

        <Route
          path="/recruiter-dashboard"
          element={
            <DashboardLayout>
              <RecruiterDashboard />
            </DashboardLayout>
          }
        />

        <Route
          path="/mentor-dashboard"
          element={
            <DashboardLayout>
              <MentorDashboard />
            </DashboardLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};