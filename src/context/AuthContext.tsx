import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth as useClerkAuth, useUser as useClerkUser, useSignIn, useSignUp } from '@clerk/clerk-react';

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
  verifyOtp: (code: string, role: string) => Promise<any>;
  forgotPassword: (email: string) => Promise<any>;
  resetPassword: (code: string, newPassword: string) => Promise<any>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoaded: isAuthLoaded, isSignedIn, signOut } = useClerkAuth();
  const { isLoaded: isUserLoaded, user } = useClerkUser();
  const { isLoaded: isSignInLoaded, signIn, setActive: setSignInActive } = useSignIn();
  const { isLoaded: isSignUpLoaded, signUp, setActive: setSignUpActive } = useSignUp();

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Map Clerk user to our custom User format
  useEffect(() => {
    if (isUserLoaded && isSignedIn && user) {
      setCurrentUser({
        id: user.id,
        fullName: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
        email: user.primaryEmailAddress?.emailAddress || '',
        phone: (user.unsafeMetadata?.phone as string) || user.primaryPhoneNumber?.phoneNumber || '',
        role: (user.unsafeMetadata?.role as any) || 'student',
        isVerified: user.emailAddresses.find(e => e.emailAddress === user.primaryEmailAddress?.emailAddress)?.verification.status === 'verified',
      });
    } else {
      setCurrentUser(null);
    }
  }, [isUserLoaded, isSignedIn, user]);

  const login = async (email: string, password: string) => {
    if (!isSignInLoaded) {
      return { success: false, message: 'Clerk login engine is loading...' };
    }
    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === 'complete') {
        await setSignInActive({ session: result.createdSessionId });
        return { success: true };
      }
      return { success: false, message: 'Additional verification required.' };
    } catch (error: any) {
      const msg = error.errors?.[0]?.message || 'Authentication failed';
      return { success: false, message: msg };
    }
  };

  const register = async (userData: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    role: string;
  }) => {
    if (!isSignUpLoaded) {
      return { success: false, message: 'Clerk registration engine is loading...' };
    }
    try {
      // Create user details in Clerk
      await signUp.create({
        emailAddress: userData.email,
        password: userData.password,
        firstName: userData.fullName.split(' ')[0],
        lastName: userData.fullName.split(' ').slice(1).join(' ') || '',
        unsafeMetadata: {
          role: userData.role.toLowerCase(),
          phone: userData.phone
        }
      });

      // Send OTP email verification
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      return { success: true };
    } catch (error: any) {
      const msg = error.errors?.[0]?.message || 'Account creation failed';
      return { success: false, message: msg };
    }
  };

  const verifyOtp = async (code: string, _role: string) => {
    if (!isSignUpLoaded) {
      return { success: false, message: 'Clerk engine is loading...' };
    }
    try {
      const result = await signUp.attemptEmailAddressVerification({ code });

      if (result.status === 'complete') {
        await setSignUpActive({ session: result.createdSessionId });
        return { success: true };
      }
      return { success: false, message: 'OTP verification failed.' };
    } catch (error: any) {
      const msg = error.errors?.[0]?.message || 'Verification failed';
      return { success: false, message: msg };
    }
  };

  const forgotPassword = async (email: string) => {
    if (!isSignInLoaded) {
      return { success: false, message: 'Clerk engine is loading...' };
    }
    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      });
      return { success: true };
    } catch (error: any) {
      const msg = error.errors?.[0]?.message || 'Verification dispatcher failed';
      return { success: false, message: msg };
    }
  };

  const resetPassword = async (code: string, newPassword: string) => {
    if (!isSignInLoaded) {
      return { success: false, message: 'Clerk engine is loading...' };
    }
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password: newPassword,
      });

      if (result.status === 'complete') {
        await setSignInActive({ session: result.createdSessionId });
        return { success: true };
      }
      return { success: false, message: 'Password reset failed.' };
    } catch (error: any) {
      const msg = error.errors?.[0]?.message || 'Failed to update password';
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    signOut().then(() => {
      window.location.href = '/';
    });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: isSignedIn || false,
        loading: !isAuthLoaded || !isUserLoaded,
        login,
        register,
        verifyOtp,
        forgotPassword,
        resetPassword,
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
