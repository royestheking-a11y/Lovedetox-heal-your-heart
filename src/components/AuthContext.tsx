import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import emailjs from '@emailjs/browser';
import { toast } from 'sonner';
import authService from '../services/authService';
import dataService from '../services/dataService';


interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  isPro: boolean;
  createdAt: string;
  profileImage?: string;
  phase: string;
  noContactDays: number;
  streak: number;
  recoveryProgress: number;
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  sendOTP: (email: string, type: 'register' | 'reset') => Promise<boolean>;
  verifyOTP: (email: string, otp: string) => Promise<boolean>;

  resetPassword: (email: string, newPassword: string) => Promise<boolean>;
  googleLogin: (accessToken: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [otpState, setOtpState] = useState<{
    code: string;
    email: string;
    expiry: number;
    verified: boolean;
  } | null>(null);

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init("LmneJ-zfVltASVP1f");
  }, []);

  // Check for logged in user on mount and fetch fresh data
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      // Fetch fresh data from API
      dataService.getProfile()
        .then(freshUser => {
          // Preserve the token from local storage
          const token = parsedUser.token;
          const userWithId = { ...freshUser, id: freshUser._id, token };
          setUser(userWithId);
          localStorage.setItem('currentUser', JSON.stringify(userWithId));
        })
        .catch(err => {
          console.error('Failed to fetch fresh profile:', err);
          // If 401, maybe logout? For now just log error.
        });
    }
  }, []);

  const migrateLocalData = async (user: User) => {
    try {
      const localUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const oldUser = localUsers.find((u: any) => u.email === user.email);

      if (oldUser) {
        const oldId = oldUser.id;
        const tasks = JSON.parse(localStorage.getItem(`tasks_${oldId}`) || '[]');
        const moods = JSON.parse(localStorage.getItem(`moods_${oldId}`) || '[]');
        const journal = JSON.parse(localStorage.getItem(`journal_${oldId}`) || '[]');
        const chat = JSON.parse(localStorage.getItem(`chat_${oldId}`) || '[]');
        const notifications = JSON.parse(localStorage.getItem(`notifications_${oldId}`) || '[]');

        if (tasks.length || moods.length || journal.length || chat.length || notifications.length) {
          toast.info('Migrating your data to the cloud...');
          await dataService.migrateData({
            tasks,
            moods,
            journal,
            chat,
            notifications
          });
          toast.success('Data migration complete!');

          // Clear old data to prevent re-migration
          localStorage.removeItem(`tasks_${oldId}`);
          localStorage.removeItem(`moods_${oldId}`);
          localStorage.removeItem(`journal_${oldId}`);
          localStorage.removeItem(`chat_${oldId}`);
          localStorage.removeItem(`notifications_${oldId}`);
        }
      }
    } catch (error) {
      console.error('Migration error:', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const data = await authService.login({ email, password });
      const user = { ...data, id: data._id };
      setUser(user);
      await migrateLocalData(user);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Invalid email or password');
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const data = await authService.register({ email, password, name });
      const user = { ...data, id: data._id };
      setUser(user);
      await migrateLocalData(user);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. User may already exist.');
      return false;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    try {
      const updatedUser = await dataService.updateProfile(updates);
      setUser({ ...updatedUser, id: updatedUser._id });
      toast.success('Profile updated');
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update profile');
    }
  };

  const sendOTP = async (email: string, type: 'register' | 'reset'): Promise<boolean> => {
    try {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setOtpState({
        code: otp,
        email: email,
        expiry: Date.now() + 10 * 60 * 1000,
        verified: false
      });

      const templateParams = {
        to_email: email,
        email: email,
        user_email: email,
        recipient: email,
        reply_to: email,
        passcode: otp,
        time: new Date(Date.now() + 5 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        message: type === 'register'
          ? 'Welcome to LoveDetox! Here is your verification code.'
          : 'Here is your password reset code.'
      };

      const templateId = type === 'register' ? 'template_fobwfn5' : 'template_8g5puvp';
      await emailjs.send('service_zgpn2ys', templateId, templateParams, 'LmneJ-zfVltASVP1f');
      return true;
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.error('Failed to send OTP');
      return false;
    }
  };

  const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
    if (!otpState) return false;
    if (otpState.email !== email || Date.now() > otpState.expiry || otpState.code !== otp) {
      toast.error('Invalid or expired OTP');
      return false;
    }
    setOtpState({ ...otpState, verified: true });
    return true;
  };

  const resetPassword = async (email: string, newPassword: string): Promise<boolean> => {
    // For now, we'll just update the user if they are logged in or if we can find them via API
    // Since we don't have a reset password endpoint yet, we'll skip this or implement it later.
    // But to keep the interface satisfied:
    toast.info('Password reset feature coming soon to cloud version.');
    return true;
  };

  const googleLogin = async (accessToken: string): Promise<boolean> => {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const userInfo = await response.json();
      const { email, name, picture, sub } = userInfo;

      const data = await authService.googleLogin({
        email,
        name,
        googleId: sub,
        picture
      });

      const user = { ...data, id: data._id };
      setUser(user);
      await migrateLocalData(user);
      return true;
    } catch (error) {
      console.error('Google Login error:', error);
      toast.error('Google Login failed.');
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAdmin: user?.isAdmin || false,
      login,
      register,
      logout,
      updateUser,
      sendOTP,
      verifyOTP,
      resetPassword,
      googleLogin
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
