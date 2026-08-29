import React from 'react';
import { Navigate } from 'react-router-dom';
import { AdminLogin } from './AdminLogin';

export const AdminPortalIndex: React.FC = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('c2c_admin_token') : null;

  if (token) {
    return <Navigate replace to="/admin/dashboard" />;
  }

  return <AdminLogin />;
};

export default AdminPortalIndex;
