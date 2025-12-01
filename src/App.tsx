import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Features } from './pages/Features';
import { Pricing } from './pages/Pricing';
import { FAQ } from './pages/FAQ';
import { HowItWorks } from './pages/HowItWorks';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { UserDashboard } from './components/user/UserDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AuthProvider, useAuth } from './components/AuthContext';
import { DarkModeProvider } from './components/DarkModeContext';
import { OnboardingTutorial } from './components/OnboardingTutorial';
import { Toaster } from 'sonner';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

function ProtectedRoute({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
}

// Wait, the above structure is a bit messy with multiple Routes. 
// Let's create a Layout component for public pages.

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
}

function AppRoutes() {
  const { user } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (user) {
      const hasSeenOnboarding = localStorage.getItem(`hasSeenOnboarding_${user.id}`);
      if (!hasSeenOnboarding) {
        setShowOnboarding(true);
      }
    }
  }, [user]);

  return (
    <Router>
      <div className="min-h-screen bg-[#FAFAFA] transition-colors duration-300 flex flex-col">
        <Routes>
          {/* Public Routes with Layout */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/features" element={<PublicLayout><Features /></PublicLayout>} />
          <Route path="/pricing" element={<PublicLayout><Pricing /></PublicLayout>} />
          <Route path="/how-it-works" element={<PublicLayout><HowItWorks /></PublicLayout>} />
          <Route path="/faq" element={<PublicLayout><FAQ /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

          {/* Auth Pages (No Navbar/Footer or maybe yes?) Let's keep them clean or with layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <UserDashboard onLogout={() => window.location.href = '/'} />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard onLogout={() => window.location.href = '/'} />
            </ProtectedRoute>
          } />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        {showOnboarding && user && (
          <OnboardingTutorial
            onComplete={() => {
              localStorage.setItem(`hasSeenOnboarding_${user.id}`, 'true');
              setShowOnboarding(false);
            }}
          />
        )}
        <Toaster position="top-center" richColors />
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <DarkModeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </DarkModeProvider>
  );
}
