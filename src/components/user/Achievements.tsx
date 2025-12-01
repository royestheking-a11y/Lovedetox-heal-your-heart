import { useState, useEffect } from 'react';
import { Trophy, Target, Heart, Flame, Star, Award, Zap, Shield, BookOpen, MessageCircle, Calendar, TrendingUp, Lock, Unlock } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { SoundEffects } from '../SoundEffects';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: typeof Trophy;
  gradient: string;
  category: 'progress' | 'consistency' | 'engagement' | 'milestone';
  requirement: number;
  currentProgress: number;
  unlocked: boolean;
  unlockedAt?: string;
}

export function Achievements() {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | Achievement['category']>('all');
  const [stats, setStats] = useState({
    totalAchievements: 0,
    unlockedAchievements: 0,
    currentStreak: 0,
    totalPoints: 0
  });

  useEffect(() => {
    calculateAchievements();
  }, [user]);

  const calculateAchievements = () => {
    // Get all user data
    const tasks = JSON.parse(localStorage.getItem(`tasks_${user?.email}`) || '[]');
    const journal = JSON.parse(localStorage.getItem(`journal_${user?.email}`) || '[]');
    const moods = JSON.parse(localStorage.getItem(`moods_${user?.email}`) || '[]');
    const noContact = JSON.parse(localStorage.getItem(`noContact_${user?.email}`) || '[]');
    const communityPosts = JSON.parse(localStorage.getItem('communityPosts') || '[]').filter((p: any) => p.authorEmail === user?.email);
    const breathingSessions = JSON.parse(localStorage.getItem('breathingSessions') || '[]');
    const letters = JSON.parse(localStorage.getItem(`letters_${user?.email}`) || '[]');

    // Calculate completed tasks
    const completedTasks = tasks.filter((t: any) => t.completed);
    const consecutiveDays = calculateStreak(moods);
    const totalActiveDays = new Set(moods.map((m: any) => new Date(m.createdAt).toDateString())).size;

    const achievementsList: Achievement[] = [
      // Progress Achievements
      {
        id: 'first-step',
        name: 'First Step',
        description: 'Complete your first daily task',
        icon: Target,
        gradient: 'from-[#6366F1] to-[#8B5CF6]',
        category: 'progress',
        requirement: 1,
        currentProgress: completedTasks.length,
        unlocked: completedTasks.length >= 1,
        unlockedAt: completedTasks[0]?.completedAt
      },
      {
        id: 'task-master',
        name: 'Task Master',
        description: 'Complete 10 daily tasks',
        icon: Trophy,
        gradient: 'from-[#8B5CF6] to-[#FB7185]',
        category: 'progress',
        requirement: 10,
        currentProgress: completedTasks.length,
        unlocked: completedTasks.length >= 10,
        unlockedAt: completedTasks[9]?.completedAt
      },
      {
        id: 'warrior',
        name: 'Healing Warrior',
        description: 'Complete 50 daily tasks',
        icon: Shield,
        gradient: 'from-[#FB7185] to-[#F472B6]',
        category: 'progress',
        requirement: 50,
        currentProgress: completedTasks.length,
        unlocked: completedTasks.length >= 50,
        unlockedAt: completedTasks[49]?.completedAt
      },

      // Consistency Achievements
      {
        id: 'streak-3',
        name: '3-Day Streak',
        description: 'Track your mood for 3 consecutive days',
        icon: Flame,
        gradient: 'from-[#FB7185] to-[#F472B6]',
        category: 'consistency',
        requirement: 3,
        currentProgress: consecutiveDays,
        unlocked: consecutiveDays >= 3,
        unlockedAt: moods[2]?.createdAt
      },
      {
        id: 'streak-7',
        name: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        icon: Award,
        gradient: 'from-[#6366F1] to-[#8B5CF6]',
        category: 'consistency',
        requirement: 7,
        currentProgress: consecutiveDays,
        unlocked: consecutiveDays >= 7,
        unlockedAt: moods[6]?.createdAt
      },
      {
        id: 'streak-30',
        name: 'Month Champion',
        description: 'Complete a 30-day streak',
        icon: Star,
        gradient: 'from-[#8B5CF6] to-[#FB7185]',
        category: 'consistency',
        requirement: 30,
        currentProgress: consecutiveDays,
        unlocked: consecutiveDays >= 30,
        unlockedAt: moods[29]?.createdAt
      },

      // Engagement Achievements
      {
        id: 'writer',
        name: 'Soul Writer',
        description: 'Write 5 journal entries',
        icon: BookOpen,
        gradient: 'from-[#6366F1] to-[#8B5CF6]',
        category: 'engagement',
        requirement: 5,
        currentProgress: journal.length,
        unlocked: journal.length >= 5,
        unlockedAt: journal[4]?.createdAt
      },
      {
        id: 'community',
        name: 'Community Hero',
        description: 'Share 10 posts in the community',
        icon: MessageCircle,
        gradient: 'from-[#8B5CF6] to-[#FB7185]',
        category: 'engagement',
        requirement: 10,
        currentProgress: communityPosts.length,
        unlocked: communityPosts.length >= 10,
        unlockedAt: communityPosts[9]?.createdAt
      },
      {
        id: 'breather',
        name: 'Calm Mind',
        description: 'Complete 10 breathing sessions',
        icon: Zap,
        gradient: 'from-[#FB7185] to-[#F472B6]',
        category: 'engagement',
        requirement: 10,
        currentProgress: breathingSessions.length,
        unlocked: breathingSessions.length >= 10,
        unlockedAt: breathingSessions[9]?.date
      },
      {
        id: 'letter-writer',
        name: 'Letter Therapy Master',
        description: 'Write 5 unsent letters',
        icon: Heart,
        gradient: 'from-[#6366F1] to-[#8B5CF6]',
        category: 'engagement',
        requirement: 5,
        currentProgress: letters.length,
        unlocked: letters.length >= 5,
        unlockedAt: letters[4]?.createdAt
      },

      // Milestone Achievements
      {
        id: 'no-contact-week',
        name: 'No Contact Week',
        description: 'Maintain no contact for 7 days',
        icon: Shield,
        gradient: 'from-[#8B5CF6] to-[#FB7185]',
        category: 'milestone',
        requirement: 7,
        currentProgress: noContact.length > 0 ? Math.floor((Date.now() - new Date(noContact[0].startDate).getTime()) / (1000 * 60 * 60 * 24)) : 0,
        unlocked: noContact.length > 0 && Math.floor((Date.now() - new Date(noContact[0].startDate).getTime()) / (1000 * 60 * 60 * 24)) >= 7,
        unlockedAt: noContact[0]?.startDate
      },
      {
        id: 'no-contact-month',
        name: 'No Contact Champion',
        description: 'Maintain no contact for 30 days',
        icon: Trophy,
        gradient: 'from-[#FB7185] to-[#F472B6]',
        category: 'milestone',
        requirement: 30,
        currentProgress: noContact.length > 0 ? Math.floor((Date.now() - new Date(noContact[0].startDate).getTime()) / (1000 * 60 * 60 * 24)) : 0,
        unlocked: noContact.length > 0 && Math.floor((Date.now() - new Date(noContact[0].startDate).getTime()) / (1000 * 60 * 60 * 24)) >= 30,
        unlockedAt: noContact[0]?.startDate
      },
      {
        id: 'active-month',
        name: 'Dedicated Healer',
        description: 'Be active for 30 days',
        icon: Calendar,
        gradient: 'from-[#6366F1] to-[#8B5CF6]',
        category: 'milestone',
        requirement: 30,
        currentProgress: totalActiveDays,
        unlocked: totalActiveDays >= 30,
        unlockedAt: moods[0]?.createdAt
      },
      {
        id: 'mood-improvement',
        name: 'Rising Phoenix',
        description: 'Show consistent mood improvement',
        icon: TrendingUp,
        gradient: 'from-[#8B5CF6] to-[#FB7185]',
        category: 'milestone',
        requirement: 1,
        currentProgress: checkMoodImprovement(moods) ? 1 : 0,
        unlocked: checkMoodImprovement(moods),
        unlockedAt: moods[moods.length - 1]?.createdAt
      }
    ];

    setAchievements(achievementsList);
    
    const unlocked = achievementsList.filter(a => a.unlocked).length;
    setStats({
      totalAchievements: achievementsList.length,
      unlockedAchievements: unlocked,
      currentStreak: consecutiveDays,
      totalPoints: unlocked * 100
    });
  };

  const calculateStreak = (moods: any[]) => {
    if (moods.length === 0) return 0;
    
    const sortedMoods = [...moods].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    let streak = 1;
    let currentDate = new Date(sortedMoods[0].createdAt);
    currentDate.setHours(0, 0, 0, 0);
    
    for (let i = 1; i < sortedMoods.length; i++) {
      const moodDate = new Date(sortedMoods[i].createdAt);
      moodDate.setHours(0, 0, 0, 0);
      
      const dayDiff = Math.floor((currentDate.getTime() - moodDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === 1) {
        streak++;
        currentDate = moodDate;
      } else if (dayDiff > 1) {
        break;
      }
    }
    
    return streak;
  };

  const checkMoodImprovement = (moods: any[]) => {
    if (moods.length < 5) return false;
    
    const recent = moods.slice(-5);
    const older = moods.slice(0, 5);
    
    const recentAvg = recent.reduce((acc: number, m: any) => acc + m.score, 0) / recent.length;
    const olderAvg = older.reduce((acc: number, m: any) => acc + m.score, 0) / older.length;
    
    return recentAvg > olderAvg + 1;
  };

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  const categories = [
    { id: 'all' as const, name: 'All', icon: Trophy },
    { id: 'progress' as const, name: 'Progress', icon: Target },
    { id: 'consistency' as const, name: 'Consistency', icon: Flame },
    { id: 'engagement' as const, name: 'Engagement', icon: Star },
    { id: 'milestone' as const, name: 'Milestones', icon: Award }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-lg icon-3d">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="gradient-text">Achievements</h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Track your healing journey and celebrate your progress
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="card-3d p-6 rounded-2xl text-center">
              <div className="text-3xl font-bold gradient-text mb-1">{stats.unlockedAchievements}/{stats.totalAchievements}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Achievements</div>
            </div>
            <div className="card-3d p-6 rounded-2xl text-center">
              <div className="text-3xl font-bold gradient-text mb-1">{stats.currentStreak}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Day Streak</div>
            </div>
            <div className="card-3d p-6 rounded-2xl text-center">
              <div className="text-3xl font-bold gradient-text mb-1">{stats.totalPoints}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Points</div>
            </div>
            <div className="card-3d p-6 rounded-2xl text-center">
              <div className="text-3xl font-bold gradient-text mb-1">
                {Math.round((stats.unlockedAchievements / stats.totalAchievements) * 100)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Completion</div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  SoundEffects.play('click');
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <cat.icon className="w-4 h-4" />
                <span className="text-sm font-semibold">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`card-3d p-6 rounded-2xl transition-all ${
                achievement.unlocked ? 'hover:shadow-xl' : 'opacity-60'
              }`}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${achievement.gradient} flex items-center justify-center shadow-lg flex-shrink-0 ${
                  achievement.unlocked ? 'icon-3d' : 'grayscale'
                }`}>
                  <achievement.icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-gray-900 dark:text-white mb-1 flex items-center gap-2 flex-wrap">
                    <span className="truncate">{achievement.name}</span>
                    {achievement.unlocked ? (
                      <Unlock className="w-4 h-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    )}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {achievement.description}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
                  <span>Progress</span>
                  <span className="flex-shrink-0">{Math.min(achievement.currentProgress, achievement.requirement)}/{achievement.requirement}</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${achievement.gradient} transition-all duration-500`}
                    style={{
                      width: `${Math.min((achievement.currentProgress / achievement.requirement) * 100, 100)}%`
                    }}
                  />
                </div>
              </div>

              {achievement.unlocked && achievement.unlockedAt && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                </div>
              )}

              {achievement.unlocked && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#6366F1] dark:text-[#8B5CF6]">
                      +100 Points
                    </span>
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredAchievements.length === 0 && (
          <div className="card-3d p-12 rounded-3xl text-center">
            <p className="text-gray-600 dark:text-gray-400">
              No achievements in this category yet. Keep healing!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}