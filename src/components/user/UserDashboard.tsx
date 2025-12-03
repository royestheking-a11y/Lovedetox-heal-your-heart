import { useState, useEffect } from 'react';
import { LayoutDashboard, CheckSquare, MessageCircle, Heart, BookOpen, Shield, Users, User, LogOut, Sparkles, Menu, X, Wind, Mail, Trophy, Award, Palette, Music } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../AuthContext';
import { DashboardHome } from './DashboardHome';
import { DailyTasks } from './DailyTasks';
import { AIChat } from './AIChat';
import { MoodTracker } from './MoodTracker';
import { Journal } from './Journal';
import { SoundTherapy } from './SoundTherapy';
import { NoContactJourney } from './NoContactJourney';

import { Community } from './Community';
import { Profile } from './Profile';
import { BreathingExercise } from './BreathingExercise';
import { LetterTherapy } from './LetterTherapy';
import { Achievements } from './Achievements';
import { SuccessStories } from './SuccessStories';
import { MindCanvas } from './MindCanvas';
import { UpgradeModal } from './UpgradeModal';
import { NotificationSystem } from '../NotificationSystem';

interface UserDashboardProps {
  onLogout: () => void;
}

export function UserDashboard({ onLogout }: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tasks' | 'ai' | 'mood' | 'journal' | 'guard' | 'community' | 'profile' | 'breathing' | 'letters' | 'achievements' | 'stories' | 'mind-canvas' | 'sound'>('dashboard');

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, updateUser } = useAuth();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [modalType, setModalType] = useState<'trial' | 'payment' | 'expired'>('trial');

  // Check for trial expiration
  useEffect(() => {
    if (user?.plan === 'PRO_TRIAL' && user.trialEndDate) {
      const end = new Date(user.trialEndDate);
      const now = new Date();
      if (now > end) {
        // Trial expired
        updateUser({ isPro: false, plan: 'FREE' });
        setModalType('expired');
        setShowUpgradeModal(true);
      }
    }

    // Auto-redirect if on Pro tab and not Pro
    const proTabs = ['ai', 'mind-canvas', 'breathing', 'guard', 'sound'];
    if (activeTab && proTabs.includes(activeTab) && !user?.isPro) {
      setActiveTab('dashboard');
      toast.info('This feature is locked for Pro members.');
    }
  }, [user, activeTab]);

  const handleLogout = () => {
    logout();
    onLogout();
  };

  // Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  const navigation = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', color: 'from-[#6366F1] to-[#8B5CF6]' },
    { id: 'tasks', icon: CheckSquare, label: 'Daily Tasks', color: 'from-[#8B5CF6] to-[#FB7185]' },
    { id: 'ai', icon: MessageCircle, label: 'AI Support', color: 'from-[#6366F1] to-[#8B5CF6]', pro: true },
    { id: 'mind-canvas', icon: Palette, label: 'Mind Canvas', color: 'from-[#FB7185] to-[#F472B6]', pro: true },
    { id: 'sound', icon: Music, label: 'Sound Therapy', color: 'from-[#6366F1] to-[#8B5CF6]' }, // New
    { id: 'mood', icon: Heart, label: 'Mood Tracker', color: 'from-[#FB7185] to-[#F472B6]' },
    { id: 'journal', icon: BookOpen, label: 'Journal', color: 'from-[#8B5CF6] to-[#FB7185]' },
    { id: 'breathing', icon: Wind, label: 'Breathing', color: 'from-[#6366F1] to-[#8B5CF6]', pro: true },
    { id: 'letters', icon: Mail, label: 'Letter Therapy', color: 'from-[#FB7185] to-[#F472B6]' },
    { id: 'guard', icon: Shield, label: 'No-Contact', color: 'from-[#6366F1] to-[#8B5CF6]', pro: true },
    { id: 'achievements', icon: Trophy, label: 'Achievements', color: 'from-[#8B5CF6] to-[#FB7185]' },
    { id: 'stories', icon: Award, label: 'Success Stories', color: 'from-[#FB7185] to-[#F472B6]' },
    { id: 'community', icon: Users, label: 'Community', color: 'from-[#FB7185] to-[#F472B6]' },
    { id: 'profile', icon: User, label: 'Profile', color: 'from-[#8B5CF6] to-[#FB7185]' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardHome onNavigate={(tab) => setActiveTab(tab as any)} />;
      case 'tasks':
        return <DailyTasks />;
      case 'ai':
        return <AIChat />;
      case 'mind-canvas':
        return <MindCanvas />;
      case 'sound':
        return <SoundTherapy />;
      case 'mood':
        return <MoodTracker onNavigate={(tab) => setActiveTab(tab)} />;
      case 'journal':
        return <Journal onNavigate={(tab) => setActiveTab(tab)} />;
      case 'breathing':
        return <BreathingExercise />;
      case 'letters':
        return <LetterTherapy />;
      case 'guard':
        return <NoContactJourney />; // Replaced NoContactGuard
      case 'achievements':
        return <Achievements />;
      case 'stories':
        return <SuccessStories />;
      case 'community':
        return <Community />;
      case 'profile':
        return <Profile />;
      default:
        return <DashboardHome onNavigate={(tab) => setActiveTab(tab as any)} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-gray-900 transition-colors duration-300">
      {/* Top Navigation */}
      <nav className="glass sticky top-0 z-40 border-b border-white/20 dark:border-gray-700/50">
        <div className="max-w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Mobile Menu */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6 text-gray-700" />
              </button>

              <button
                onClick={() => setActiveTab('dashboard')}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center shadow-lg">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold gradient-text hidden sm:block">LoveDetox</span>
              </button>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-2 sm:gap-4">
              {user?.isPro && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-full">
                  <Sparkles className="w-4 h-4 text-white" />
                  <span className="text-sm text-white font-medium">
                    {user.plan === 'PRO_TRIAL' ? 'Pro Trial' : 'Pro'}
                  </span>
                </div>
              )}

              {/* Notification Bell */}
              <NotificationSystem />

              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-[#6366F1] dark:hover:text-[#8B5CF6] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-72 h-[calc(100vh-4rem)] sticky top-16 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors duration-300 overflow-y-auto custom-scrollbar">
          <nav className="p-6 space-y-2">
            <div className="mb-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Navigation</p>
            </div>

            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                disabled={item.pro && !user?.isPro}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative overflow-hidden ${activeTab === item.id
                  ? 'bg-gradient-to-r from-[#6366F1]/10 to-[#8B5CF6]/10 text-[#6366F1] dark:text-[#8B5CF6] shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  } ${item.pro && !user?.isPro ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {activeTab === item.id && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#6366F1] to-[#8B5CF6] rounded-r-full" />
                )}

                <div className={`p-2 rounded-lg transition-all ${activeTab === item.id
                  ? `bg-gradient-to-br ${item.color}`
                  : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600'
                  }`}>
                  <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`} />
                </div>

                <span className="font-medium whitespace-nowrap">{item.label}</span>

                {item.pro && !user?.isPro && (
                  <span className="ml-auto text-xs bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white px-2 py-1 rounded-full font-medium">
                    PRO
                  </span>
                )}

              </button>
            ))}

            {/* Upgrade Card */}
            {!user?.isPro && (
              <div className="mt-8 p-4 bg-gradient-to-br from-[#6366F1]/10 to-[#8B5CF6]/10 rounded-xl border border-[#6366F1]/20 dark:border-[#8B5CF6]/30">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-[#6366F1] dark:text-[#8B5CF6]" />
                  <h5 className="font-semibold text-gray-900 dark:text-white">Upgrade to Pro</h5>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  Unlock all features and accelerate your healing journey.
                </p>
                <button
                  onClick={() => {
                    setModalType('trial');
                    setShowUpgradeModal(true);
                  }}
                  className="w-full btn-primary text-sm py-2"
                >
                  Start Free Trial
                </button>
              </div>
            )}
          </nav>
        </aside>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}>
            <aside className="w-72 h-full bg-white dark:bg-gray-800 shadow-2xl transition-colors duration-300 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold gradient-text">LoveDetox</span>
                  </div>
                  <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <X className="w-6 h-6 text-gray-600" />
                  </button>
                </div>

                <nav className="space-y-2 pb-20"> {/* Added padding bottom for mobile safe area */}
                  {navigation.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as any);
                        setSidebarOpen(false);
                      }}
                      disabled={item.pro && !user?.isPro}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id
                        ? 'bg-gradient-to-r from-[#6366F1]/10 to-[#8B5CF6]/10 text-[#6366F1]'
                        : 'text-gray-600 hover:bg-gray-50'
                        } ${item.pro && !user?.isPro ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className={`p-2 rounded-lg ${activeTab === item.id
                        ? `bg-gradient-to-br ${item.color}`
                        : 'bg-gray-100'
                        }`}>
                        <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'text-gray-600'}`} />
                      </div>
                      <span className="font-medium whitespace-nowrap">{item.label}</span>
                      {item.pro && !user?.isPro && (
                        <span className="ml-auto text-xs bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white px-2 py-1 rounded-full">
                          PRO
                        </span>
                      )}

                    </button>
                  ))}
                </nav>
              </div>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        type={modalType}
      />
    </div>
  );
}