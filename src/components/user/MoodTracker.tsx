import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { TrendingUp, Calendar, Heart, Smile, BarChart3, Palette, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { PremiumIcon } from '../PremiumIcon';
import { addNotification } from '../NotificationSystem';
import dataService from '../../services/dataService';

interface Mood {
  id: string;
  emotion: string;
  intensity: number;
  note: string;
  date: string;
}

interface MoodTrackerProps {
  onNavigate?: (tab: 'mind-canvas') => void;
}

const emotions = [
  { name: 'Happy', emoji: '😊', gradient: 'from-[#FCD34D] to-[#F59E0B]' },
  { name: 'Sad', emoji: '😢', gradient: 'from-[#60A5FA] to-[#3B82F6]' },
  { name: 'Angry', emoji: '😠', gradient: 'from-[#F87171] to-[#EF4444]' },
  { name: 'Anxious', emoji: '😰', gradient: 'from-[#A78BFA] to-[#8B5CF6]' },
  { name: 'Peaceful', emoji: '😌', gradient: 'from-[#6EE7B7] to-[#10B981]' },
  { name: 'Lonely', emoji: '😔', gradient: 'from-[#9CA3AF] to-[#6B7280]' },
  { name: 'Hopeful', emoji: '🌟', gradient: 'from-[#F9A8D4] to-[#EC4899]' },
  { name: 'Numb', emoji: '😶', gradient: 'from-[#CBD5E1] to-[#94A3B8]' },
];

const checkConsecutiveDays = (moods: Mood[]) => {
  if (moods.length === 0) return 0;

  const dates = moods.map(m => new Date(m.date).toDateString());
  const uniqueDates = [...new Set(dates)].sort((a, b) =>
    new Date(b).getTime() - new Date(a).getTime()
  );

  let consecutive = 1;
  for (let i = 0; i < uniqueDates.length - 1; i++) {
    const current = new Date(uniqueDates[i]);
    const next = new Date(uniqueDates[i + 1]);
    const diffDays = Math.floor((current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      consecutive++;
    } else {
      break;
    }
  }
  return consecutive;
};

export function MoodTracker({ onNavigate }: MoodTrackerProps) {
  const { user } = useAuth();
  const [moods, setMoods] = useState<Mood[]>([]);
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [note, setNote] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!user) return;
    loadMoods();
  }, [user]);

  const loadMoods = async () => {
    if (!user) return;
    try {
      const fetchedMoods = await dataService.getMoods();
      const mappedMoods = fetchedMoods.map((m: any) => ({ ...m, id: m._id }));
      setMoods(mappedMoods);

      const today = new Date().toDateString();
      const hasLoggedToday = mappedMoods.some((m: Mood) => new Date(m.date).toDateString() === today);
      setShowForm(!hasLoggedToday);
    } catch (error) {
      console.error('Error loading moods:', error);
      toast.error('Failed to load mood history');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedEmotion) return;

    const newMoodData = {
      emotion: selectedEmotion,
      intensity,
      note,
      date: new Date().toISOString()
    };

    try {
      const createdMood = await dataService.createMood(newMoodData);
      const mappedMood = { ...createdMood, id: createdMood._id };

      const updatedMoods = [mappedMood, ...moods];
      setMoods(updatedMoods);

      toast.success('Mood logged! Keep tracking your emotional journey.');

      // Send notification
      addNotification(user.id, {
        type: 'success',
        title: 'Mood Logged! 💚',
        message: `Your ${selectedEmotion} mood has been recorded. Great job tracking your emotions!`
      });

      // Check for consecutive days tracking
      const consecutiveDays = checkConsecutiveDays(updatedMoods);
      if (consecutiveDays >= 7 && consecutiveDays % 7 === 0) {
        addNotification(user.id, {
          type: 'achievement',
          title: `${consecutiveDays} Days of Mood Tracking! 📊`,
          message: `You've been tracking your moods for ${consecutiveDays} consecutive days. Self-awareness is key to healing!`
        });
      }

      setSelectedEmotion('');
      setIntensity(5);
      setNote('');
      setShowForm(false);
    } catch (error) {
      console.error('Error logging mood:', error);
      toast.error('Failed to log mood');
    }
  };

  const getEmotionData = (emotion: string) => {
    return emotions.find(e => e.name === emotion) || emotions[0];
  };

  const recentMoods = moods.slice(0, 7);
  const averageIntensity = moods.length > 0
    ? Math.round(moods.reduce((sum, m) => sum + m.intensity, 0) / moods.length)
    : 0;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <PremiumIcon Icon={Heart} size="md" variant="3d" gradient="from-[#FB7185] to-[#F472B6]" />
          <h2 className="gradient-text">Mood & Emotion Tracker</h2>
        </div>
        <p className="text-gray-600">Track your emotional journey and identify patterns in your healing process.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="card-3d p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <PremiumIcon Icon={Calendar} size="sm" variant="flat" gradient="from-[#6366F1] to-[#8B5CF6]" />
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Total</span>
          </div>
          <div className="text-3xl font-bold gradient-text mb-1">{moods.length}</div>
          <p className="text-sm text-gray-500">Entries Logged</p>
        </div>

        <div className="card-3d p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <PremiumIcon Icon={BarChart3} size="sm" variant="flat" gradient="from-[#8B5CF6] to-[#FB7185]" />
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Avg</span>
          </div>
          <div className="text-3xl font-bold gradient-text mb-1">{averageIntensity}/10</div>
          <p className="text-sm text-gray-500">Avg Intensity</p>
        </div>

        <div className="card-3d p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <PremiumIcon Icon={TrendingUp} size="sm" variant="flat" gradient="from-[#FB7185] to-[#F472B6]" />
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Streak</span>
          </div>
          <div className="text-3xl font-bold gradient-text mb-1">{Math.min(moods.length, 7)}</div>
          <p className="text-sm text-gray-500">Days Tracked</p>
        </div>
      </div>

      {/* Mood Entry Form */}
      {showForm ? (
        <div className="card-3d p-8 rounded-2xl mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Smile className="w-6 h-6 text-[#6366F1]" />
            <h4 className="text-gray-900 font-semibold">How are you feeling today?</h4>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Emotion Selection */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">Select your emotion:</p>
              <div className="grid grid-cols-4 gap-3">
                {emotions.map((emotion) => (
                  <button
                    key={emotion.name}
                    type="button"
                    onClick={() => setSelectedEmotion(emotion.name)}
                    className={`p-4 rounded-2xl border-2 transition-all ${selectedEmotion === emotion.name
                      ? `bg-gradient-to-br ${emotion.gradient} border-transparent text-white shadow-lg scale-105`
                      : 'border-gray-200 hover:border-gray-300 hover:scale-105 bg-white'
                      }`}
                  >
                    <div className="text-3xl mb-2">{emotion.emoji}</div>
                    <p className={`text-xs font-medium ${selectedEmotion === emotion.name ? 'text-white' : 'text-gray-700'
                      }`}>
                      {emotion.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Intensity Slider */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-700">Intensity Level:</p>
                <span className="text-2xl font-bold gradient-text">{intensity}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={intensity}
                onChange={(e) => setIntensity(parseInt(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #6366F1 0%, #8B5CF6 ${intensity * 10}%, #E5E7EB ${intensity * 10}%, #E5E7EB 100%)`
                }}
              />
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Low</span>
                <span>Moderate</span>
                <span>High</span>
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Add a note (optional):
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What's on your mind? Any triggers or thoughts to remember..."
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#8B5CF6] focus:outline-none transition-colors resize-none bg-white/50"
              />
            </div>

            <button
              type="submit"
              disabled={!selectedEmotion}
              className="w-full btn-primary py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Log Mood Entry
            </button>
          </form>
        </div>
      ) : (
        <div className="card-3d p-6 rounded-2xl mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-gray-900 font-semibold mb-1">You've logged your mood today!</h4>
              <p className="text-sm text-gray-600">Come back tomorrow to continue tracking.</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="btn-secondary py-2 px-4 text-sm"
            >
              Log Again
            </button>
          </div>

          {onNavigate && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-purple-500" />
                    Turn this feeling into art?
                  </h5>
                  <p className="text-sm text-gray-500">Visualize your emotion with AI</p>
                </div>
                <button
                  onClick={() => onNavigate('mind-canvas')}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
                >
                  Generate Art
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recent Moods */}
      <div>
        <h4 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#6366F1]" />
          Your Recent Mood History
        </h4>

        {moods.length === 0 ? (
          <div className="card-3d p-12 rounded-2xl text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 mb-4">
              <Heart className="w-10 h-10 text-gray-400" />
            </div>
            <h5 className="text-gray-900 mb-2">No mood entries yet</h5>
            <p className="text-gray-500 mb-6">Start tracking your emotions to see patterns and progress</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentMoods.map((mood) => {
              const emotionData = getEmotionData(mood.emotion);
              return (
                <div key={mood.id} className="card-3d p-6 rounded-2xl">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${emotionData.gradient} flex items-center justify-center text-2xl shadow-lg`}>
                      {emotionData.emoji}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="text-gray-900 font-semibold">{mood.emotion}</h5>
                        <span className="text-sm text-gray-500">
                          {new Date(mood.date).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm text-gray-600">Intensity:</span>
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden max-w-xs">
                            <div
                              className={`h-full bg-gradient-to-r ${emotionData.gradient} transition-all`}
                              style={{ width: `${mood.intensity * 10}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-gray-900">{mood.intensity}/10</span>
                        </div>
                      </div>

                      {mood.note && (
                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                          <p className="text-sm text-gray-700 italic">"{mood.note}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {moods.length > 7 && (
          <button className="w-full mt-4 py-3 border-2 border-gray-200 rounded-xl text-gray-600 hover:border-[#6366F1] hover:text-[#6366F1] transition-all">
            View All Entries ({moods.length})
          </button>
        )}
      </div>

      {/* Insights Card */}
      {moods.length >= 3 && (
        <div className="mt-8 relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FB7185] via-[#F472B6] to-[#EC4899]" />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
          </div>
          <div className="relative p-8 text-white">
            <div className="flex items-start gap-4">
              <PremiumIcon Icon={BarChart3} size="lg" variant="flat" gradient="from-white to-white/90" />
              <div>
                <h4 className="text-white font-semibold mb-2">Your Emotional Insights</h4>
                <p className="text-white/90 mb-4">
                  You've been tracking your moods consistently! Keep it up to identify patterns and triggers in your healing journey.
                </p>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <TrendingUp className="w-4 h-4" />
                  <span>Average intensity is {averageIntensity}/10 - You're making progress!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
