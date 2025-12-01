import { useState } from 'react';
import { X, Mail, Lock as LockIcon, User, Heart, Sparkles } from 'lucide-react';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

import { OTPInput } from './ui/OTPInput';
import { useGoogleLogin } from '@react-oauth/google';

interface AuthModalProps {
  initialMode: 'login' | 'register';
  onClose: () => void;
  prefillEmail?: string;
  prefillPassword?: string;
}

export function AuthModal({ initialMode, onClose, prefillEmail = '', prefillPassword = '' }: AuthModalProps) {
  const [mode, setMode] = useState(initialMode);
  const [view, setView] = useState<'auth' | 'otp' | 'forgot-password' | 'reset-otp' | 'new-password'>('auth');
  const [email, setEmail] = useState(prefillEmail);
  const [password, setPassword] = useState(prefillPassword);
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register, sendOTP, verifyOTP, resetPassword, googleLogin } = useAuth();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const success = await googleLogin(tokenResponse.access_token);
      if (success) onClose();
    },
    onError: () => {
      toast.error('Google Login Failed');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (view === 'auth') {
        if (mode === 'register') {
          // Send OTP for registration
          const sent = await sendOTP(email, 'register');
          if (sent) {
            setView('otp');
            toast.success('Verification code sent to your email');
          }
        } else {
          // Login
          const success = await login(email, password);
          if (success) {
            toast.success('Welcome back!');
            onClose();
          } else {
            toast.error('Invalid email or password.');
          }
        }
      } else if (view === 'otp') {
        // Verify Registration OTP
        const verified = await verifyOTP(email, otp);
        if (verified) {
          const success = await register(email, password, name);
          if (success) {
            toast.success('Welcome to LoveDetox! Your healing journey begins now.');
            onClose();
          } else {
            toast.error('Email already exists. Please login instead.');
            setView('auth');
            setMode('login');
          }
        }
      } else if (view === 'forgot-password') {
        // Send OTP for password reset
        const sent = await sendOTP(email, 'reset');
        if (sent) {
          setView('reset-otp');
          toast.success('Reset code sent to your email');
        }
      } else if (view === 'reset-otp') {
        // Verify Reset OTP
        const verified = await verifyOTP(email, otp);
        if (verified) {
          setView('new-password');
          toast.success('Code verified. Please set a new password.');
        }
      } else if (view === 'new-password') {
        // Set new password
        const success = await resetPassword(email, password);
        if (success) {
          toast.success('Password reset successfully. Please login.');
          setView('auth');
          setMode('login');
          setPassword('');
        } else {
          toast.error('Failed to reset password.');
        }
      }
    } catch (error) {
      console.error('❌ Form submission error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300"
      onClick={() => {
        console.log('🖱️ Clicked outside auth modal');
        onClose();
      }}
    >
      <div className="card-3d rounded-3xl max-w-md w-full p-8 relative overflow-hidden bg-white dark:bg-gray-800" onClick={(e) => e.stopPropagation()}>
        {/* Background Gradient */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-[#FB7185] to-[#F472B6] rounded-full blur-3xl" />
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            console.log('❌ AuthModal X button clicked');
            onClose();
          }}
          className="absolute top-6 right-6 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all hover:scale-110 z-50"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>

        <div className="relative z-10">
          {/* Icon & Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] mb-4 shadow-lg icon-3d">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="gradient-text mb-2">
              {view === 'auth' && (mode === 'register' ? 'Start Your Healing Journey' : 'Welcome Back')}
              {view === 'otp' && 'Verify Your Email'}
              {view === 'forgot-password' && 'Reset Password'}
              {view === 'reset-otp' && 'Enter Reset Code'}
              {view === 'new-password' && 'Set New Password'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {view === 'auth' && (mode === 'register'
                ? 'Create your account and begin your path to emotional freedom'
                : 'Sign in to continue your recovery journey')}
              {(view === 'otp' || view === 'reset-otp') && `Enter the code sent to ${email}`}
              {view === 'forgot-password' && 'Enter your email to receive a reset code'}
              {view === 'new-password' && 'Choose a strong password for your account'}
            </p>

            {prefillEmail && mode === 'login' && (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#6366F1]/10 dark:bg-[#8B5CF6]/20 border border-[#6366F1]/30 dark:border-[#8B5CF6]/30 rounded-full">
                <LockIcon className="w-4 h-4 text-[#6366F1] dark:text-[#8B5CF6]" />
                <span className="text-xs font-semibold text-[#6366F1] dark:text-[#8B5CF6]">Admin credentials pre-filled</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {view === 'auth' && (
              <>
                {mode === 'register' && (
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <User className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-[#8B5CF6] focus:outline-none transition-all bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm dark:text-white"
                    />
                  </div>
                )}

                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-[#8B5CF6] focus:outline-none transition-all bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm dark:text-white"
                  />
                </div>

                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <LockIcon className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-[#8B5CF6] focus:outline-none transition-all bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm dark:text-white"
                  />
                </div>

                {mode === 'login' && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setView('forgot-password')}
                      className="text-sm text-[#6366F1] hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}
              </>
            )}

            {(view === 'otp' || view === 'reset-otp') && (
              <div className="py-4">
                <OTPInput length={6} onComplete={(code) => setOtp(code)} />
              </div>
            )}

            {view === 'forgot-password' && (
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-[#8B5CF6] focus:outline-none transition-all bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm dark:text-white"
                />
              </div>
            )}

            {view === 'new-password' && (
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <LockIcon className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-[#8B5CF6] focus:outline-none transition-all bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm dark:text-white"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ripple"
            >
              {loading ? (
                <div className="spinner w-5 h-5 border-2" />
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>
                    {view === 'auth' && (mode === 'register' ? 'Sign Up' : 'Sign In')}
                    {(view === 'otp' || view === 'reset-otp') && 'Verify Code'}
                    {view === 'forgot-password' && 'Send Reset Code'}
                    {view === 'new-password' && 'Reset Password'}
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">or</span>
            </div>
          </div>

          {/* Google Login */}
          {view === 'auth' && (
            <div className="mb-6">
              <button
                type="button"
                onClick={() => handleGoogleLogin()}
                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all group bg-white dark:bg-gray-800"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span className="text-gray-700 dark:text-gray-200 font-medium group-hover:text-gray-900 dark:group-hover:text-white">
                  Continue with Google
                </span>
              </button>
            </div>
          )}

          {/* Switch Mode */}
          {view === 'auth' && (
            <div className="text-center">
              <button
                type="button"
                onClick={() => setMode(mode === 'register' ? 'login' : 'register')}
                className="text-[#6366F1] dark:text-[#8B5CF6] hover:text-[#8B5CF6] dark:hover:text-[#6366F1] transition-colors font-medium text-sm"
              >
                {mode === 'register'
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Create one"}
              </button>
            </div>
          )}

          {view !== 'auth' && (
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => {
                  setView('auth');
                  setMode('login');
                }}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-sm"
              >
                Back to Login
              </button>
            </div>
          )}

          {/* Admin hint for login */}

        </div>
      </div>
    </div>
  );
}
