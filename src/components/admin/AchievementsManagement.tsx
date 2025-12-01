import { useState, useEffect } from 'react';
import { Trophy, TrendingUp, Users, Target, Star } from 'lucide-react';
import adminService from '../../services/adminService';

interface UserAchievementData {
  email: string;
  name: string;
  totalAchievements: number;
  unlockedAchievements: number;
  totalPoints: number;
  currentStreak: number;
  completionRate: number;
  lastActivity: string;
}

export function AchievementsManagement() {
  const [usersData, setUsersData] = useState<UserAchievementData[]>([]);
  const [sortBy, setSortBy] = useState<'points' | 'achievements' | 'streak'>('points');

  useEffect(() => {
    loadUserAchievements();
  }, []);

  const loadUserAchievements = async () => {
    try {
      const data = await adminService.getAchievements();

      // Sort data
      data.sort((a: any, b: any) => {
        if (sortBy === 'points') return b.totalPoints - a.totalPoints;
        if (sortBy === 'achievements') return b.unlockedAchievements - a.unlockedAchievements;
        return b.currentStreak - a.currentStreak;
      });

      setUsersData(data);
    } catch (error) {
      console.error('Error loading achievements:', error);
    }
  };

  const totalStats = {
    totalUsers: usersData.length,
    avgPoints: Math.round(usersData.reduce((sum, u) => sum + u.totalPoints, 0) / usersData.length) || 0,
    avgCompletion: Math.round(usersData.reduce((sum, u) => sum + u.completionRate, 0) / usersData.length) || 0,
    topStreak: Math.max(...usersData.map(u => u.currentStreak), 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-lg">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Achievements Overview</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Monitor user progress and engagement</p>
          </div>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-[#6366F1]" />
            <div className="text-sm text-gray-600 dark:text-gray-400">Active Users</div>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{totalStats.totalUsers}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-5 h-5 text-amber-500" />
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg Points</div>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{totalStats.avgPoints}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-5 h-5 text-green-500" />
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg Completion</div>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{totalStats.avgCompletion}%</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <div className="text-sm text-gray-600 dark:text-gray-400">Top Streak</div>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{totalStats.topStreak} days</div>
        </div>
      </div>

      {/* Sort Options */}
      <div className="flex gap-2">
        <span className="text-sm text-gray-600 dark:text-gray-400 self-center mr-2">Sort by:</span>
        {(['points', 'achievements', 'streak'] as const).map((sort) => (
          <button
            key={sort}
            onClick={() => {
              setSortBy(sort);
              loadUserAchievements();
            }}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${sortBy === sort
              ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
          >
            {sort.charAt(0).toUpperCase() + sort.slice(1)}
          </button>
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Rank</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">User</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Achievements</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Points</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Streak</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Completion</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Last Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {usersData.map((userData, index) => (
                <tr key={userData.email} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white' :
                      index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white' :
                        index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-500 text-white' :
                          'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                      }`}>
                      {index + 1}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">{userData.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{userData.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {userData.unlockedAchievements}/{userData.totalAchievements}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-semibold text-gray-900 dark:text-white">{userData.totalPoints}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900 dark:text-white">{userData.currentStreak} days</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]"
                          style={{ width: `${userData.completionRate}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white w-12">{userData.completionRate}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(userData.lastActivity).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {usersData.length === 0 && (
          <div className="p-12 text-center">
            <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400">No user data available</p>
          </div>
        )}
      </div>
    </div>
  );
}
