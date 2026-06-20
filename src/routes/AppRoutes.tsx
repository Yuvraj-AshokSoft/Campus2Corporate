import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { LandingPage } from '../pages/LandingPage';

export const AppRoutes: React.FC = () => {
  return <LandingPage />;
};