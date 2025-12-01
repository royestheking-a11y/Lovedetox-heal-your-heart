import { useEffect, useState } from 'react';
import { Users, TrendingUp, DollarSign, MessageCircle, Heart, CheckSquare, Activity, Shield, Zap, AlertCircle } from 'lucide-react';
import adminService from '../../services/adminService';

export function AdminHome({ onNavigate }: { onNavigate: (tab: any) => void }) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    freeUsers: 0,
    proUsers: 0,
    revenueToday: 0,
    aiUsageRate: 0,
    tasksCompleted: 0,
    moodEntries: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const dashboardStats = await adminService.getDashboardStats();
      setStats(dashboardStats);
    } catch (error) {
      console.error('Error loading admin stats:', error);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h2 className="gradient-text">System Overview</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400">Real-time insights into your LoveDetox platform performance</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="group bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 card-hover">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#6366F1]/10 to-[#8B5CF6]/10">
              <Users className="w-6 h-6 text-[#6366F1]" />
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">All Time</span>
          </div>
          <div className="text-3xl font-bold gradient-text mb-1">{stats.totalUsers}</div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {stats.freeUsers} Free • {stats.proUsers} Pro
            </p>
          </div>
        </div>

        <div className="group bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 card-hover">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#8B5CF6]/10 to-[#FB7185]/10">
              <Activity className="w-6 h-6 text-[#8B5CF6]" />
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">7 Days</span>
          </div>
          <div className="text-3xl font-bold gradient-text mb-1">{stats.activeUsers}</div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Active Users</p>
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs text-green-600 font-medium">
              +{Math.round((stats.activeUsers / stats.totalUsers) * 100)}% engagement
            </p>
          </div>
        </div>

        <div className="group bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 card-hover">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#FB7185]/10 to-[#F472B6]/10">
              <DollarSign className="w-6 h-6 text-[#FB7185]" />
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">MRR</span>
          </div>
          <div className="text-3xl font-bold gradient-text mb-1">${stats.revenueToday}</div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Revenue</p>
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              ${stats.revenueToday * 12}/year projected
            </p>
          </div>
        </div>

        <div className="group bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 card-hover">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#6366F1]/10 to-[#8B5CF6]/10">
              <TrendingUp className="w-6 h-6 text-[#6366F1]" />
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">Growth</span>
          </div>
          <div className="text-3xl font-bold gradient-text mb-1">
            {stats.totalUsers > 0 ? Math.round((stats.proUsers / stats.totalUsers) * 100) : 0}%
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Conversion Rate</p>
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs text-green-600 font-medium">
              {stats.proUsers} pro subscriptions
            </p>
          </div>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden card-hover">
          <div className="bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-white font-semibold">AI Engagement</h4>
            </div>
          </div>
          <div className="p-6">
            <div className="text-3xl font-bold gradient-text mb-2">{stats.aiUsageRate}</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Avg. messages per user</p>
            <div className="mt-4 p-3 bg-gradient-to-br from-[#6366F1]/5 to-[#8B5CF6]/5 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-300">
                AI support is actively helping users heal
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden card-hover">
          <div className="bg-gradient-to-br from-[#8B5CF6] to-[#FB7185] p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <CheckSquare className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-white font-semibold">Task Completion</h4>
            </div>
          </div>
          <div className="p-6">
            <div className="text-3xl font-bold gradient-text mb-2">{stats.tasksCompleted}</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total tasks completed</p>
            <div className="mt-4 p-3 bg-gradient-to-br from-[#8B5CF6]/5 to-[#FB7185]/5 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Users actively working on recovery
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden card-hover">
          <div className="bg-gradient-to-br from-[#FB7185] to-[#F472B6] p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-white font-semibold">Mood Tracking</h4>
            </div>
          </div>
          <div className="p-6">
            <div className="text-3xl font-bold gradient-text mb-2">{stats.moodEntries}</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total mood entries</p>
            <div className="mt-4 p-3 bg-gradient-to-br from-[#FB7185]/5 to-[#F472B6]/5 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Emotional progress being tracked
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* System Health & Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Platform Health */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="w-5 h-5 text-[#6366F1]" />
            <h4 className="text-gray-900 dark:text-white font-semibold">Platform Health</h4>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">System Status</span>
              </div>
              <span className="text-sm font-semibold text-green-600">Operational</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Database</span>
              </div>
              <span className="text-sm font-semibold text-blue-600">MongoDB</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-200">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">AI Service</span>
              </div>
              <span className="text-sm font-semibold text-purple-600">Active</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Uptime</span>
              </div>
              <span className="text-sm font-semibold text-green-600">99.9%</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-[#6366F1]" />
            <h4 className="text-gray-900 dark:text-white font-semibold">Admin Quick Actions</h4>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => onNavigate('users')}
              className="group w-full flex items-center justify-between p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-[#6366F1] dark:hover:border-[#6366F1] hover:bg-gradient-to-r hover:from-[#6366F1]/5 hover:to-[#8B5CF6]/5 transition-all"
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-[#6366F1]" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Manage Users</span>
              </div>
              <span className="text-xs text-gray-400 group-hover:text-[#6366F1] transition-colors">→</span>
            </button>

            <button
              onClick={() => onNavigate('tasks')}
              className="group w-full flex items-center justify-between p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-[#8B5CF6] dark:hover:border-[#8B5CF6] hover:bg-gradient-to-r hover:from-[#8B5CF6]/5 hover:to-[#FB7185]/5 transition-all"
            >
              <div className="flex items-center gap-3">
                <CheckSquare className="w-5 h-5 text-[#8B5CF6]" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Task Management</span>
              </div>
              <span className="text-xs text-gray-400 group-hover:text-[#8B5CF6] transition-colors">→</span>
            </button>

            <button
              onClick={() => onNavigate('support')}
              className="group w-full flex items-center justify-between p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-[#FB7185] dark:hover:border-[#FB7185] hover:bg-gradient-to-r hover:from-[#FB7185]/5 hover:to-[#F472B6]/5 transition-all"
            >
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-[#FB7185]" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Support Inbox</span>
              </div>
              <span className="text-xs text-gray-400 group-hover:text-[#FB7185] transition-colors">→</span>
            </button>

            <button
              onClick={() => onNavigate('settings')}
              className="group w-full flex items-center justify-between p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-[#6366F1] dark:hover:border-[#6366F1] hover:bg-gradient-to-r hover:from-[#6366F1]/5 hover:to-[#8B5CF6]/5 transition-all"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-[#6366F1]" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">System Settings</span>
              </div>
              <span className="text-xs text-gray-400 group-hover:text-[#6366F1] transition-colors">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* System Info Banner */}
      <div className="mt-8 bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h5 className="font-semibold mb-1">Secure Admin Access</h5>
              <p className="text-sm text-gray-300">All admin actions are logged and monitored for security</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium">System Secure</span>
          </div>
        </div>
      </div>
    </div>
  );
}
