import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { LandingPage } from '../pages/LandingPage';
import { AdminDashboard } from '../pages/AdminDashboard';
import { StudentDashboard } from '../pages/StudentDashboard';
import { MentorDashboard } from '../pages/MentorDashboard';
import { CollegeDashboard } from '../pages/CollegeDashboard';
import { RecruiterDashboard } from '../pages/RecruiterDashboard';

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        {/* Hyphenated routes */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/mentor-dashboard" element={<MentorDashboard />} />
        <Route path="/college-dashboard" element={<CollegeDashboard />} />
        <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />

        {/* Non-hyphenated legacy routes */}
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/studentdashboard" element={<StudentDashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

