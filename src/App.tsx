import { useState, useEffect } from 'react';
import { Homepage } from './components/Homepage';
import { UserDashboard } from './components/user/UserDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AuthProvider, useAuth } from './components/AuthContext';
import { DarkModeProvider } from './components/DarkModeContext';
import { OnboardingTutorial } from './components/OnboardingTutorial';
import { Toaster } from 'sonner';

function AppContent() {
  const { user, isAdmin, updateUser } = useAuth();
  const [currentPage, setCurrentPage] = useState<'home' | 'user' | 'admin'>('home');
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    console.log('📄 Page check - User:', user?.email, 'isAdmin:', isAdmin);

    if (user && isAdmin) {
      console.log('🔑 Redirecting to ADMIN panel');
      setCurrentPage('admin');
    } else if (user) {
      console.log('👤 Redirecting to USER dashboard');
      setCurrentPage('user');
      // Show onboarding for new users if they haven't seen it
      if (user.hasSeenTutorial === false) {
        setShowOnboarding(true);
      }
    } else {
      console.log('🏠 Showing HOMEPAGE');
      setCurrentPage('home');
    }
  }, [user, isAdmin]);

  const renderPage = () => {
    if (currentPage === 'admin' && isAdmin) {
      return <AdminDashboard onLogout={() => setCurrentPage('home')} />;
    }
    if (currentPage === 'user' && user) {
      return <UserDashboard onLogout={() => setCurrentPage('home')} />;
    }
    return <Homepage />;
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] transition-colors duration-300">
      {renderPage()}
      {showOnboarding && user && (
        <OnboardingTutorial
          onComplete={() => {
            updateUser({ hasSeenTutorial: true });
            setShowOnboarding(false);
          }}
        />
      )}
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default function App() {
  console.log('🚀 LoveDetox App v1.1.0 - Loaded');
  return (
    <DarkModeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </DarkModeProvider>
  );
}
