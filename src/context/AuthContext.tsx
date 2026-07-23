import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getApiErrorMessage,
  studentApi,
  type StudentProfile,
} from "../services/studentApi";

interface User extends StudentProfile {
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
  verifyOtp: (code: string, role: string) => Promise<any>;
  forgotPassword: (email: string) => Promise<any>;
  resetPassword: (code: string, newPassword: string) => Promise<any>;
  refreshUser: () => Promise<void>;
  updateCurrentUser: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "c2c_student_token";
const USER_KEY = "c2c_student_user";

const normalizeStudent = (student: StudentProfile): User => ({
  ...student,
  id: student.id,
  fullName: student.fullName || student.name || "",
  name: student.name || student.fullName || "",
  email: student.email || "",
  phone: student.phone || "",
  role: "student",
  isVerified: true,
});

const saveSession = (token: string, student: StudentProfile) => {
  const user = normalizeStudent(student);

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  return user;
};

const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setCurrentUser(null);
      return;
    }

    try {
      const { data } = await studentApi.me();

      const student =
        data.student ||
        data.user ||
        data.data?.student;

      if (!student) throw new Error("Student not found");

      const user = normalizeStudent(student);

      localStorage.setItem(USER_KEY, JSON.stringify(user));
      setCurrentUser(user);
    } catch {
      clearSession();
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    const bootstrap = async () => {
      const savedUser = localStorage.getItem(USER_KEY);

      if (savedUser) {
        try {
          setCurrentUser(JSON.parse(savedUser));
        } catch {
          clearSession();
        }
      }

      await refreshUser();
      setLoading(false);
    };

    bootstrap();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await studentApi.login({
        email,
        password,
      });

      const token =
        data.token ||
        data.data?.token;

      const student =
        data.student ||
        data.user ||
        data.data?.student;

      const user = saveSession(token, student);

      setCurrentUser(user);

      return {
        success: true,
        user,
      };
    } catch (error) {
      return {
        success: false,
        message: getApiErrorMessage(error),
      };
    }
  };

  const register = async (userData: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    role: string;
  }) => {
    if (userData.role.toLowerCase() !== "student") {
      return {
        success: false,
        message: "Only student registration is supported.",
      };
    }

    try {
      const { data } = await studentApi.register(userData);

      const token =
        data.token ||
        data.data?.token;

      const student =
        data.student ||
        data.user ||
        data.data?.student;

      const user = saveSession(token, student);

      setCurrentUser(user);

      return {
        success: true,
        requiresOtp: false,
        user,
      };
    } catch (error) {
      return {
        success: false,
        message: getApiErrorMessage(error),
      };
    }
  };

  const verifyOtp = async (_code: string, _role: string) => ({
    success: false,
    message: "OTP verification is not implemented.",
  });

  const forgotPassword = async (_email: string) => ({
    success: false,
    message: "Forgot password is not implemented.",
  });

  const resetPassword = async (_code: string, _newPassword: string) => ({
    success: false,
    message: "Reset password is not implemented.",
  });

  const updateCurrentUser = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  };

  const logout = () => {
    studentApi.logout().catch(() => {});

    clearSession();

    setCurrentUser(null);

    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!(
          currentUser &&
          localStorage.getItem(TOKEN_KEY)
        ),
        loading,
        login,
        register,
        verifyOtp,
        forgotPassword,
        resetPassword,
        refreshUser,
        updateCurrentUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};