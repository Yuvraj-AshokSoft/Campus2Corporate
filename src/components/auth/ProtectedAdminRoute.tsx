import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';

export const ProtectedAdminRoute: React.FC = () => {
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyAdminToken = async () => {
      const token = localStorage.getItem('c2c_admin_token');

      if (!token) {
        setIsAuthenticated(false);
        setIsValidating(false);
        return;
      }

      try {
        // Validate with backend profile endpoint
        const response = await axios.get('/api/admin/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.success) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('c2c_admin_token');
          localStorage.removeItem('c2c_admin_session');
          setIsAuthenticated(false);
        }
      } catch (error) {
        // Token is invalid, expired, or admin is deactivated
        localStorage.removeItem('c2c_admin_token');
        localStorage.removeItem('c2c_admin_session');
        setIsAuthenticated(false);
      } finally {
        setIsValidating(false);
      }
    };

    verifyAdminToken();
  }, []);

  if (isValidating) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-slate-500">Verifying Administrative Privileges...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate replace to="/admin/login" />;
  }

  return <Outlet />;
};

export default ProtectedAdminRoute;
