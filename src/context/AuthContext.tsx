import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'student' | 'mentor' | 'college' | 'recruiter';
  isVerified?: boolean;
}

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (userData: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    role: string;
  }) => Promise<any>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Persist login after page refresh
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (token && savedUser) {
        try {
          // Verify token against /me endpoint
          const response = await API.get('/auth/me');
          if (response.data.success && response.data.user) {
            const userWithRole = response.data.user;
            // Standardize db _id field to id
            const userObj = {
              id: userWithRole._id || userWithRole.id,
              fullName: userWithRole.fullName,
              email: userWithRole.email,
              phone: userWithRole.phone,
              role: userWithRole.role,
              isVerified: userWithRole.isVerified,
            };
            setCurrentUser(userObj);
            setIsAuthenticated(true);
            localStorage.setItem('user', JSON.stringify(userObj));
          } else {
            handleLogoutClean();
          }
        } catch (error) {
          console.error('Failed to restore auth session:', error);
          handleLogoutClean();
        }
      } else {
        handleLogoutClean();
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const handleLogoutClean = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await API.post('/auth/login', { email, password });
      
      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setCurrentUser(user);
        setIsAuthenticated(true);
        return { success: true, user };
      }
      return { success: false, message: response.data.message || 'Login failed' };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login request failed';
      return { success: false, message };
    }
  };

  const register = async (userData: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    role: string;
  }) => {
    try {
      const response = await API.post('/auth/register', userData);
      
      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setCurrentUser(user);
        setIsAuthenticated(true);
        return { success: true, user };
      }
      return { success: false, message: response.data.message || 'Registration failed' };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration request failed';
      return { success: false, message };
    }
  };

  const logout = () => {
    handleLogoutClean();
    // Redirect to landing page to login
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
