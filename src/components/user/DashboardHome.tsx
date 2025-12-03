import { useAuth } from '../AuthContext';
import { TrendingUp, Flame, Target, MessageCircle, CheckCircle, Sparkles, Award, Heart, ArrowRight, Zap, BookOpen, Check, Clock, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PremiumIcon } from '../PremiumIcon';
import { MindCanvasWidget } from './MindCanvasWidget';
import { NoContactWidget } from './NoContactWidget';
import { SoundEffects } from '../SoundEffects';
import { addNotification } from '../NotificationSystem';
import { UpgradeModal } from './UpgradeModal';

interface DashboardHomeProps {
  onNavigate?: (tab: string) => void;
}

export function DashboardHome({ onNavigate }: DashboardHomeProps) {
  const { user } = useAuth();
  const [todayTask, setTodayTask] = useState<any>(null);
  const [todayMood, setTodayMood] = useState<any>(null);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    totalMoods: 0,
    totalJournals: 0,
    aiMessages: 0
  });
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [modalType, setModalType] = useState<'trial' | 'payment' | 'expired' | 'upgrade_info'>('trial');

  useEffect(() => {
    if (!user) return;

    const loadDashboardData = async () => {
      try {
        const [tasks, moods, journals, chat] = await Promise.all([
          import('../../services/dataService').then(m => m.default.getTasks()),
          import('../../services/dataService').then(m => m.default.getMoods()),
          import('../../services/dataService').then(m => m.default.getJournalEntries()),
          import('../../services/dataService').then(m => m.default.getChatHistory())
        ]);

        // Get today's task
        const today = new Date().toDateString();
        const task = tasks.find((t: any) => new Date(t.date).toDateString() === today);
        setTodayTask(task);

        // Get today's mood
        const mood = moods.find((m: any) => new Date(m.date).toDateString() === today);
        setTodayMood(mood);

        // Calculate stats
        const completedTasks = tasks.filter((t: any) => t.completed).length;
        const userMessages = chat.filter((m: any) => m.role === 'user').length; // Changed 'sender' to 'role' based on Chat model

        setStats({
          totalTasks: tasks.length,
          completedTasks,
          totalMoods: moods.length,
          totalJournals: journals.length,
          aiMessages: userMessages
        });

        // Check for daily reminders
        const lastReminderDate = localStorage.getItem(`lastReminder_${user.id}`);

        if (lastReminderDate !== today) {
          // Send daily reminder if no task completed today
          if (!task || !task.completed) {
            addNotification(user.id, {
              type: 'reminder',
              title: 'Daily Healing Task 📅',
              message: 'Don\'t forget to complete your daily healing task. Small consistent actions lead to big transformations!'
            });
          }

          // Send mood tracking reminder if no mood logged today
          if (!mood) {
            addNotification(user.id, {
              type: 'reminder',
              title: 'Track Your Mood Today 💚',
              message: 'Take a moment to check in with yourself. How are you feeling today?'
            });
          }

          localStorage.setItem(`lastReminder_${user.id}`, today);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };

    loadDashboardData();
  }, [user]);

  const handleNavigation = (tab: string) => {
    SoundEffects.play('click');
    if (onNavigate) {
      onNavigate(tab);
    }
  };

  const getTrialDaysLeft = () => {
    if (!user?.trialEndDate) return 0;
    const end = new Date(user.trialEndDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const trialDaysLeft = getTrialDaysLeft();
  // Show trial card if there is a valid trial end date in the future, regardless of plan name
  const isTrialActive = user?.isPro && trialDaysLeft > 0 && !!user?.trialEndDate;

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="gradient-text">Welcome back, {user?.name}!</h2>
          {user?.isPro && (
            <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-full shadow-lg">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-sm text-white font-medium">
                {user.plan === 'PRO_TRIAL' ? 'Pro Trial' : 'Pro'}
              </span>
            </div>
          )}
        </div>

        {/* Trial Progress / Warning */}
        {isTrialActive && trialDaysLeft <= 7 && (
          <div className="mt-2">
            <div className={`p-3 rounded-lg flex items-center gap-2 text-sm ${trialDaysLeft <= 3
              ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300'
              : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300'
              }`}>
              <AlertTriangle className="w-4 h-4" />
              {trialDaysLeft <= 3
                ? '⚠️ Trial ending soon. Don’t lose your progress.'
                : '⏳ Your Pro trial ends in 7 days. Continue without interruption.'}
            </div>
          </div>
        )}

        {!isTrialActive && !user?.isPro && (
          <p className="text-gray-600 dark:text-gray-400">Here's your healing journey progress for today.</p>
        )}
      </div>

      {/* Stats Grid with Functional Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="sm:col-span-2 lg:col-span-2">
          <MindCanvasWidget onNavigate={handleNavigation as any} isPro={user?.isPro} />
        </div>

        {/* Trial Status Card */}
        {isTrialActive && (
          <button
            onClick={() => {
              setModalType('upgrade_info');
              setShowUpgradeModal(true);
            }}
            className="card-3d p-6 rounded-2xl text-left group cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <Clock className="w-24 h-24" />
            </div>
            <div className="flex items-start justify-between mb-4 relative z-10">
              <PremiumIcon Icon={Clock} size="sm" variant="3d" gradient="from-[#F59E0B] to-[#D97706]" />
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${trialDaysLeft <= 3 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {trialDaysLeft} Days Left
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1 relative z-10">Free Trial</div>
            <p className="text-sm text-gray-500 dark:text-gray-400 relative z-10">
              {trialDaysLeft <= 3 ? 'Upgrade to keep Pro features' : 'Enjoying Pro features?'}
            </p>
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between relative z-10">
              <span className="text-xs text-[#F59E0B] font-medium">Upgrade Now</span>
              <ArrowRight className="w-4 h-4 text-[#F59E0B] group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        )}
        <button
          onClick={() => handleNavigation('guard')}
          className="card-3d p-6 rounded-2xl text-left group cursor-pointer"
        >
          <div className="flex items-start justify-between mb-4">
            <PremiumIcon Icon={Target} size="sm" variant="3d" gradient="from-[#6366F1] to-[#8B5CF6]" />
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">Phase</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{user?.phase}</div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Current Recovery Phase</p>
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <span className="text-xs text-[#6366F1] dark:text-[#8B5CF6] font-medium">View Progress</span>
            <ArrowRight className="w-4 h-4 text-[#6366F1] dark:text-[#8B5CF6] group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        <NoContactWidget
          days={user?.noContactStartDate ? Math.floor((new Date().getTime() - new Date(user.noContactStartDate).getTime()) / (1000 * 60 * 60 * 24)) : 0}
          onNavigate={() => handleNavigation('guard')}
        />

        <button
          onClick={() => handleNavigation('tasks')}
          className="card-3d p-6 rounded-2xl text-left group cursor-pointer"
        >
          <div className="flex items-start justify-between mb-4">
            <PremiumIcon Icon={TrendingUp} size="sm" variant="3d" gradient="from-[#FB7185] to-[#F472B6]" />
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">Progress</span>
          </div>
          <div className="text-2xl font-bold gradient-text mb-3">{user?.recoveryProgress || 0}%</div>
          <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] transition-all duration-500"
              style={{ width: `${user?.recoveryProgress || 0}%` }}
            />
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <span className="text-xs text-[#FB7185] font-medium">Complete Tasks</span>
            <ArrowRight className="w-4 h-4 text-[#FB7185] group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        <button
          onClick={() => handleNavigation('tasks')}
          className="card-3d p-6 rounded-2xl text-left group cursor-pointer"
        >
          <div className="flex items-start justify-between mb-4">
            <PremiumIcon Icon={Flame} size="sm" variant="3d" gradient="from-[#F59E0B] to-[#DC2626]" />
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">Streak</span>
          </div>
          <div className="text-2xl font-bold gradient-text mb-1">{user?.streak || 0}</div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Days Active Streak</p>
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <span className="text-xs text-[#F59E0B] font-medium">Keep it Going!</span>
            <ArrowRight className="w-4 h-4 text-[#F59E0B] group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>

      {/* Activity Overview */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <button
          onClick={() => handleNavigation('tasks')}
          className="card-3d p-5 rounded-xl text-left group cursor-pointer"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-[#10B981]/10 to-[#059669]/10">
              <CheckCircle className="w-5 h-5 text-[#10B981]" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.completedTasks}/{stats.totalTasks}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Tasks Done</div>
            </div>
          </div>
        </button>

        <button
          onClick={() => handleNavigation('mood')}
          className="card-3d p-5 rounded-xl text-left group cursor-pointer"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-[#FB7185]/10 to-[#F472B6]/10">
              <Heart className="w-5 h-5 text-[#FB7185]" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalMoods}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Mood Entries</div>
            </div>
          </div>
        </button>

        <button
          onClick={() => handleNavigation('journal')}
          className="card-3d p-5 rounded-xl text-left group cursor-pointer"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-[#8B5CF6]/10 to-[#FB7185]/10">
              <BookOpen className="w-5 h-5 text-[#8B5CF6]" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalJournals}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Journal Entries</div>
            </div>
          </div>
        </button>

        <button
          onClick={() => handleNavigation('ai')}
          className="card-3d p-5 rounded-xl text-left group cursor-pointer"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-[#6366F1]/10 to-[#8B5CF6]/10">
              <MessageCircle className="w-5 h-5 text-[#6366F1]" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.aiMessages}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">AI Chats</div>
            </div>
          </div>
        </button>
      </div>

      {/* Today's Overview Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Today's Task Card */}
        <div className="card-3d rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] p-6">
            <div className="flex items-center gap-3 mb-2">
              <PremiumIcon Icon={CheckCircle} size="sm" variant="flat" gradient="from-white to-white/90" />
              <h4 className="text-white font-semibold">Today's Task</h4>
            </div>
          </div>

          <div className="p-6">
            {todayTask ? (
              <div>
                <h5 className="text-gray-900 dark:text-white mb-2 font-semibold">{todayTask.title}</h5>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{todayTask.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">⏱️ {todayTask.timeEstimate}</span>
                  {todayTask.completed ? (
                    <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 font-medium">
                      <CheckCircle className="w-4 h-4" />
                      Completed
                    </span>
                  ) : (
                    <button
                      onClick={() => handleNavigation('tasks')}
                      className="text-sm text-[#6366F1] dark:text-[#8B5CF6] font-medium hover:underline flex items-center gap-1"
                    >
                      Start Task
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <PremiumIcon Icon={Award} size="md" variant="3d" gradient="from-[#10B981] to-[#059669]" />
                <p className="text-gray-600 dark:text-gray-400 mt-4">No tasks for today.</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">You're all caught up! 🎉</p>
                <button
                  onClick={() => handleNavigation('tasks')}
                  className="mt-4 text-sm text-[#6366F1] dark:text-[#8B5CF6] font-medium hover:underline"
                >
                  Add New Task
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mood Status Card */}
        <div className="card-3d rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-br from-[#FB7185] to-[#F472B6] p-6">
            <div className="flex items-center gap-3 mb-2">
              <PremiumIcon Icon={Heart} size="sm" variant="flat" gradient="from-white to-white/90" />
              <h4 className="text-white font-semibold">Today's Mood</h4>
            </div>
          </div>

          <div className="p-6">
            {todayMood ? (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-3xl">{todayMood.emoji || '😊'}</span>
                  <div>
                    <h5 className="text-gray-900 dark:text-white font-semibold">{todayMood.emotion}</h5>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Intensity: {todayMood.intensity}/10</p>
                  </div>
                </div>
                <div className="mb-3 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#FB7185] to-[#F472B6] transition-all"
                    style={{ width: `${todayMood.intensity * 10}%` }}
                  />
                </div>
                {todayMood.note && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 italic bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    "{todayMood.note}"
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <PremiumIcon Icon={Heart} size="md" variant="3d" gradient="from-[#FB7185] to-[#F472B6]" />
                <p className="text-gray-600 dark:text-gray-400 mt-4 mb-2">Haven't logged your mood yet</p>
                <button
                  onClick={() => handleNavigation('mood')}
                  className="text-sm text-[#FB7185] font-medium hover:underline flex items-center gap-1 mx-auto"
                >
                  Track Mood Now
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card-3d p-6 rounded-2xl mb-8">
        <h4 className="text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-[#6366F1]" />
          Quick Actions
        </h4>
        <div className="grid sm:grid-cols-3 gap-4">
          <button
            onClick={() => handleNavigation('ai')}
            className="p-5 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-[#6366F1] dark:hover:border-[#8B5CF6] transition-all text-left card-hover group"
          >
            <PremiumIcon Icon={MessageCircle} size="sm" variant="flat" gradient="from-[#6366F1] to-[#8B5CF6]" />
            <p className="text-sm font-medium text-gray-900 dark:text-white mt-3 mb-1">AI Chat</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Talk to your support companion</p>
            <div className="mt-3 flex items-center gap-1 text-xs text-[#6366F1] dark:text-[#8B5CF6]">
              <span>Open Chat</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <button
            onClick={() => handleNavigation('tasks')}
            className="p-5 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-[#8B5CF6] transition-all text-left card-hover group"
          >
            <PremiumIcon Icon={CheckCircle} size="sm" variant="flat" gradient="from-[#8B5CF6] to-[#FB7185]" />
            <p className="text-sm font-medium text-gray-900 dark:text-white mt-3 mb-1">Daily Tasks</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Complete recovery exercises</p>
            <div className="mt-3 flex items-center gap-1 text-xs text-[#8B5CF6]">
              <span>View Tasks</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <button
            onClick={() => handleNavigation('journal')}
            className="p-5 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-[#FB7185] transition-all text-left card-hover group"
          >
            <PremiumIcon Icon={BookOpen} size="sm" variant="flat" gradient="from-[#FB7185] to-[#F472B6]" />
            <p className="text-sm font-medium text-gray-900 dark:text-white mt-3 mb-1">Write Journal</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Process your thoughts</p>
            <div className="mt-3 flex items-center gap-1 text-xs text-[#FB7185]">
              <span>Start Writing</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>

      {/* Upgrade Banner for Free Users */}
      {!user?.isPro && (
        <div className="relative overflow-hidden bg-gradient-to-br from-[#6366F1] via-[#8B5CF6] to-[#FB7185] p-8 rounded-2xl shadow-xl">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
          </div>

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-6 h-6 text-white" />
                <h4 className="text-white font-semibold">Unlock Your Full Healing Potential</h4>
              </div>
              <p className="text-white/90 mb-4">
                Get unlimited AI support, advanced features, and accelerate your recovery journey.
              </p>
              <ul className="space-y-2 text-sm text-white/90">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Unlimited AI conversations</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Advanced mood analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Full community access</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => {
                setModalType('trial');
                setShowUpgradeModal(true);
              }}
              className="btn-primary bg-white text-[#6366F1] hover:scale-105 px-8 py-4 shadow-2xl flex items-center gap-2"
            >
              Start 30-Day Free Trial
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        type={modalType}
      />
    </div>
  );
}
