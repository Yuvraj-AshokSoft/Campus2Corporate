import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { LandingPage } from '../pages/LandingPage';
import { StudentDashboard } from '../pages/StudentDashboard';
import { AdminDashboard } from '../pages/AdminDashboard';
import { CollegeDashboard } from '../pages/CollegeDashboard';
import { RecruiterDashboard } from '../pages/RecruiterDashboard';
import { MentorDashboard } from '../pages/MentorDashboard';

import { AuthProvider } from '../context/AuthContext';
import { PrivateRoute } from './PrivateRoute';

export const AppRoutes: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing route */}
          <Route path="/" element={<LandingPage />} />

          {/* Admin routes */}
          <Route 
            path="/admin-dashboard" 
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            } 
          />

          {/* Student routes */}
          <Route 
            path="/student-dashboard" 
            element={
              <PrivateRoute>
                <StudentDashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/student/dashboard" 
            element={
              <PrivateRoute>
                <StudentDashboard />
              </PrivateRoute>
            } 
          />

          {/* College routes */}
          <Route 
            path="/college-dashboard" 
            element={
              <PrivateRoute>
                <CollegeDashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/college/dashboard" 
            element={
              <PrivateRoute>
                <CollegeDashboard />
              </PrivateRoute>
            } 
          />

          {/* Recruiter routes */}
          <Route 
            path="/recruiter-dashboard" 
            element={
              <PrivateRoute>
                <RecruiterDashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/recruiter/dashboard" 
            element={
              <PrivateRoute>
                <RecruiterDashboard />
              </PrivateRoute>
            } 
          />

          {/* Mentor routes */}
          <Route 
            path="/mentor-dashboard" 
            element={
              <PrivateRoute>
                <MentorDashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/mentor/dashboard" 
            element={
              <PrivateRoute>
                <MentorDashboard />
              </PrivateRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};