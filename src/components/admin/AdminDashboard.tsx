import { useState, useEffect } from 'react';
import { LayoutDashboard, Users, CheckSquare, MessageCircle, Heart, AlertTriangle, DollarSign, Bell, Mail, Settings, LogOut, Lock, Shield, Menu, X, Sparkles, Trophy, Palette } from 'lucide-react';
import { AdminHome } from './AdminHome';
import { UserManagement } from './UserManagement';
import { TaskManagement } from './TaskManagement';
import { AIControl } from './AIControl';
import { MindCanvasControl } from './MindCanvasControl';
import { MoodMonitor } from './MoodMonitor';
import { CommunityModeration } from './CommunityModeration';
import { PaymentManagement } from './PaymentManagement';
import { NotificationManagement } from './NotificationManagement';
import { SupportInbox } from './SupportInbox';
import { SystemSettings } from './SystemSettings';
import { SuccessStoryManagement } from './SuccessStoryManagement';
import { NoContactMonitor } from './NoContactMonitor';
import { AchievementsManagement } from './AchievementsManagement';

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'tasks' | 'ai' | 'mood' | 'community' | 'payments' | 'notifications' | 'support' | 'settings' | 'stories' | 'nocontact' | 'achievements' | 'mind-canvas'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Initialize admin user if doesn't exist
  // Admin user initialization is now handled by the backend
  useEffect(() => {
    // Optional: Check if admin exists via API or just rely on backend seeding
  }, []);

  // Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  const navigation = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', color: 'from-[#6366F1] to-[#8B5CF6]' },
    { id: 'users', icon: Users, label: 'User Management', color: 'from-[#8B5CF6] to-[#FB7185]' },
    { id: 'tasks', icon: CheckSquare, label: 'Task Management', color: 'from-[#6366F1] to-[#8B5CF6]' },
    { id: 'ai', icon: MessageCircle, label: 'AI Control', color: 'from-[#FB7185] to-[#F472B6]' },
    { id: 'mind-canvas', icon: Palette, label: 'Mind Canvas', color: 'from-[#6366F1] to-[#8B5CF6]' },
    { id: 'mood', icon: Heart, label: 'Mood Monitor', color: 'from-[#8B5CF6] to-[#FB7185]' },
    { id: 'community', icon: AlertTriangle, label: 'Moderation', color: 'from-[#6366F1] to-[#8B5CF6]' },
    { id: 'payments', icon: DollarSign, label: 'Payments', color: 'from-[#FB7185] to-[#F472B6]' },
    { id: 'notifications', icon: Bell, label: 'Notifications', color: 'from-[#8B5CF6] to-[#FB7185]' },
    { id: 'support', icon: Mail, label: 'Support Inbox', color: 'from-[#6366F1] to-[#8B5CF6]' },
    { id: 'settings', icon: Settings, label: 'Settings', color: 'from-[#FB7185] to-[#F472B6]' },
    { id: 'stories', icon: Sparkles, label: 'Success Stories', color: 'from-[#FB7185] to-[#F472B6]' },
    { id: 'nocontact', icon: Trophy, label: 'No Contact Monitor', color: 'from-[#FB7185] to-[#F472B6]' },
    { id: 'achievements', icon: Trophy, label: 'Achievements', color: 'from-[#FB7185] to-[#F472B6]' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminHome onNavigate={(tab) => setActiveTab(tab as any)} />;
      case 'users':
        return <UserManagement />;
      case 'tasks':
        return <TaskManagement />;
      case 'ai':
        return <AIControl />;
      case 'mind-canvas':
        return <MindCanvasControl />;
      case 'mood':
        return <MoodMonitor />;
      case 'community':
        return <CommunityModeration />;
      case 'payments':
        return <PaymentManagement />;
      case 'notifications':
        return <NotificationManagement />;
      case 'support':
        return <SupportInbox />;
      case 'settings':
        return <SystemSettings />;
      case 'stories':
        return <SuccessStoryManagement />;
      case 'nocontact':
        return <NoContactMonitor />;
      case 'achievements':
        return <AchievementsManagement />;
      default:
        return <AdminHome onNavigate={(tab) => setActiveTab(tab as any)} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-gray-900 transition-colors duration-300">
      {/* Top Navigation with Admin Theme */}
      <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 border-b border-gray-700 dark:border-gray-800 sticky top-0 z-40 shadow-xl">
        <div className="max-w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Mobile Menu */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6 text-white" />
              </button>

              <button
                onClick={() => setActiveTab('dashboard')}
                className="flex items-center gap-3 hover:opacity-90 transition-opacity text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="hidden sm:block">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-xl font-bold">LoveDetox</span>
                    <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded text-xs text-white font-medium">Admin</span>
                  </div>
                  <p className="text-white/60 text-xs">System Control Panel</p>
                </div>
              </button>
            </div>

            {/* Admin Info & Logout */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full">
                <Lock className="w-4 h-4 text-white" />
                <span className="text-sm text-white font-medium">Secure Access</span>
              </div>

              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all hover:scale-105"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-72 min-h-[calc(100vh-4rem)] sticky top-16 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg transition-colors duration-300">
          <nav className="p-6 space-y-2">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="w-4 h-4 text-gray-400" />
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Admin Controls</p>
              </div>
            </div>

            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative overflow-hidden ${activeTab === item.id
                  ? 'bg-gradient-to-r from-gray-900 to-gray-800 dark:from-[#6366F1] dark:to-[#8B5CF6] text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
              >
                {activeTab === item.id && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#6366F1] to-[#8B5CF6] rounded-r-full" />
                )}

                <div className={`p-2 rounded-lg transition-all ${activeTab === item.id
                  ? `bg-gradient-to-br ${item.color} shadow-md`
                  : 'bg-gray-100 group-hover:bg-gray-200'
                  }`}>
                  <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'text-gray-600'}`} />
                </div>

                <span className="font-medium text-sm">{item.label}</span>
              </button>
            ))}

            {/* Admin Info Card */}
            <div className="mt-8 p-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl text-white">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-[#6366F1]" />
                <h5 className="font-semibold">Admin Status</h5>
              </div>
              <p className="text-xs text-gray-300 mb-3">
                Full system access granted. All features unlocked.
              </p>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-400">System Operational</span>
              </div>
            </div>
          </nav>
        </aside>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}>
            <aside className="w-72 h-full bg-white dark:bg-gray-800 shadow-2xl transition-colors duration-300" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <span className="text-lg font-bold text-gray-900">Admin Panel</span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Lock className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-400">Secure</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <X className="w-6 h-6 text-gray-600" />
                  </button>
                </div>

                <nav className="space-y-2">
                  {navigation.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as any);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id
                        ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white'
                        : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      <div className={`p-2 rounded-lg ${activeTab === item.id
                        ? `bg-gradient-to-br ${item.color}`
                        : 'bg-gray-100'
                        }`}>
                        <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'text-gray-600'}`} />
                      </div>
                      <span className="font-medium text-sm">{item.label}</span>
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

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Shield className="w-4 h-4 text-[#6366F1]" />
              <span>LoveDetox Admin Panel</span>
              <span className="text-gray-400">•</span>
              <span>© 2024 All Rights Reserved</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <button onClick={() => setActiveTab('stories')} className="hover:text-[#6366F1] transition-colors">Success Stories</button>
              <span className="text-gray-400">•</span>
              <button onClick={() => setActiveTab('mood')} className="hover:text-[#6366F1] transition-colors">Mood Monitor</button>
              <span className="text-gray-400">•</span>
              <button onClick={() => setActiveTab('support')} className="hover:text-[#6366F1] transition-colors">Support Inbox</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}