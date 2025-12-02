import { useState, useEffect, useRef } from 'react';
import { Wind, Play, Pause, RotateCcw, Volume2, VolumeX, Heart, Lock, ArrowRight } from 'lucide-react';
import { SoundEffects } from '../SoundEffects';
import { toast } from 'sonner';
import { useAuth } from '../AuthContext';
import { UpgradeModal } from './UpgradeModal';

const exercises = [
  {
    id: 'box',
    name: 'Box Breathing',
    description: 'Equal counts for calm and balance',
    pattern: [
      { phase: 'Breathe In', duration: 4, instruction: 'Inhale slowly through your nose' },
      { phase: 'Hold', duration: 4, instruction: 'Hold your breath gently' },
      { phase: 'Breathe Out', duration: 4, instruction: 'Exhale slowly through your mouth' },
      { phase: 'Hold', duration: 4, instruction: 'Hold your breath gently' }
    ],
    gradient: 'from-[#6366F1] to-[#8B5CF6]',
    color: '#6366F1'
  },
  {
    id: '478',
    name: '4-7-8 Technique',
    description: 'Natural tranquilizer for the nervous system',
    pattern: [
      { phase: 'Breathe In', duration: 4, instruction: 'Inhale quietly through your nose' },
      { phase: 'Hold', duration: 7, instruction: 'Hold your breath comfortably' },
      { phase: 'Breathe Out', duration: 8, instruction: 'Exhale completely through your mouth' }
    ],
    gradient: 'from-[#8B5CF6] to-[#FB7185]',
    color: '#8B5CF6'
  },
  {
    id: 'calm',
    name: 'Calming Breath',
    description: 'Extended exhale for deep relaxation',
    pattern: [
      { phase: 'Breathe In', duration: 4, instruction: 'Inhale deeply through your nose' },
      { phase: 'Breathe Out', duration: 8, instruction: 'Exhale slowly and completely' }
    ],
    gradient: 'from-[#FB7185] to-[#F472B6]',
    color: '#FB7185'
  }
];

export function BreathingExercise() {
  const { user } = useAuth();
  const [selectedExercise, setSelectedExercise] = useState(exercises[0]);
  const [isActive, setIsActive] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [countdown, setCountdown] = useState(selectedExercise.pattern[0].duration);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [scale, setScale] = useState(1);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentPhase = selectedExercise.pattern[currentPhaseIndex];

  // Check if user is Pro or in Trial
  const isPro = user?.isPro || (user?.plan === 'PRO_TRIAL' && user.trialEndDate && new Date(user.trialEndDate) > new Date());

  useEffect(() => {
    if (isActive) {
      // Animate breathing circle
      const isInhale = currentPhase.phase === 'Breathe In';
      const isExhale = currentPhase.phase === 'Breathe Out';

      if (isInhale) {
        setScale(1.8);
      } else if (isExhale) {
        setScale(0.8);
      } else {
        setScale(1.4);
      }

      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            // Move to next phase
            setCurrentPhaseIndex((prevIndex) => {
              const nextIndex = (prevIndex + 1) % selectedExercise.pattern.length;

              // Completed full cycle
              if (nextIndex === 0) {
                setCompletedCycles((prev) => prev + 1);
                if (soundEnabled) SoundEffects.play('success');
              }

              return nextIndex;
            });
            return selectedExercise.pattern[(currentPhaseIndex + 1) % selectedExercise.pattern.length].duration;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, currentPhaseIndex, selectedExercise, soundEnabled, currentPhase.phase]);

  if (!isPro) {
    return (
      <div className="relative min-h-[600px] flex items-center justify-center rounded-3xl overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 blur-sm" />

        <div className="relative z-10 text-center p-8 max-w-md mx-auto">
          <div className="w-20 h-20 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl transform rotate-3">
            <Lock className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Unlock Breathing Exercises
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            Calm your mind and reduce anxiety with guided breathing techniques. This premium feature is available exclusively for Pro members.
          </p>

          <button
            onClick={() => setShowUpgradeModal(true)}
            className="w-full py-4 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            Upgrade to Unlock
            <ArrowRight className="w-5 h-5" />
          </button>

          <p className="mt-4 text-sm text-gray-500">
            Start your 30-day free trial today.
          </p>
        </div>

        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          type="trial"
        />
      </div>
    );
  }

  const handleStart = () => {
    setIsActive(true);
    if (soundEnabled) SoundEffects.play('click');
  };

  const handlePause = () => {
    setIsActive(false);
    if (soundEnabled) SoundEffects.play('click');
  };

  const handleReset = () => {
    setIsActive(false);
    setCurrentPhaseIndex(0);
    setCountdown(selectedExercise.pattern[0].duration);
    setCompletedCycles(0);
    setScale(1);
    if (soundEnabled) SoundEffects.play('click');
  };

  const handleExerciseChange = (exercise: typeof exercises[0]) => {
    setSelectedExercise(exercise);
    handleReset();
  };

  const saveSession = () => {
    if (completedCycles > 0) {
      const sessions = JSON.parse(localStorage.getItem('breathingSessions') || '[]');
      sessions.push({
        id: Date.now().toString(),
        exercise: selectedExercise.name,
        cycles: completedCycles,
        date: new Date().toISOString()
      });
      localStorage.setItem('breathingSessions', JSON.stringify(sessions));
      toast.success(`Saved! ${completedCycles} cycle${completedCycles !== 1 ? 's' : ''} completed.`);
      handleReset();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-lg icon-3d">
              <Wind className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="gradient-text">Breathing Exercises</h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Calm your mind and reduce anxiety through guided breathing
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Exercise Selection */}
          <div className="lg:col-span-1 space-y-4">
            <div className="card-3d p-6 rounded-2xl">
              <h3 className="text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#6366F1]" />
                Choose Exercise
              </h3>
              <div className="space-y-3">
                {exercises.map((exercise) => (
                  <button
                    key={exercise.id}
                    onClick={() => handleExerciseChange(exercise)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${selectedExercise.id === exercise.id
                        ? `bg-gradient-to-r ${exercise.gradient} text-white shadow-lg`
                        : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                  >
                    <div className={`font-semibold mb-1 ${selectedExercise.id === exercise.id ? 'text-white' : 'text-gray-900 dark:text-white'
                      }`}>
                      {exercise.name}
                    </div>
                    <div className={`text-sm ${selectedExercise.id === exercise.id ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'
                      }`}>
                      {exercise.description}
                    </div>
                  </button>
                ))}
              </div>

              {/* Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text mb-1">{completedCycles}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Cycles Completed
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="card-3d p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-900 dark:text-white font-semibold">Sound</span>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {soundEnabled ? (
                    <Volume2 className="w-5 h-5 text-[#6366F1]" />
                  ) : (
                    <VolumeX className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>

              {completedCycles > 0 && (
                <button
                  onClick={saveSession}
                  className="w-full btn-primary mb-3"
                >
                  Save Session
                </button>
              )}
            </div>
          </div>

          {/* Breathing Circle */}
          <div className="lg:col-span-2 card-3d p-8 rounded-2xl">
            <div className="flex flex-col items-center justify-center min-h-[500px]">
              {/* Phase Name */}
              <div className="mb-8 text-center">
                <h2 className="gradient-text mb-2">{currentPhase.phase}</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {currentPhase.instruction}
                </p>
              </div>

              {/* Animated Circle */}
              <div className="relative flex items-center justify-center mb-8">
                <div
                  className={`w-64 h-64 rounded-full bg-gradient-to-r ${selectedExercise.gradient} opacity-20 absolute`}
                  style={{
                    transform: `scale(${scale})`,
                    transition: `transform ${currentPhase.duration}s cubic-bezier(0.4, 0, 0.2, 1)`
                  }}
                />
                <div
                  className={`w-56 h-56 rounded-full bg-gradient-to-r ${selectedExercise.gradient} flex items-center justify-center shadow-2xl`}
                  style={{
                    transform: `scale(${scale * 0.8})`,
                    transition: `transform ${currentPhase.duration}s cubic-bezier(0.4, 0, 0.2, 1)`
                  }}
                >
                  <div className="text-center text-white">
                    <div className="text-6xl font-bold mb-2">{countdown}</div>
                    <div className="text-sm opacity-90">seconds</div>
                  </div>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex gap-4">
                {!isActive ? (
                  <button
                    onClick={handleStart}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-full font-semibold hover:shadow-lg transition-all hover:scale-105"
                  >
                    <Play className="w-5 h-5" />
                    Start
                  </button>
                ) : (
                  <button
                    onClick={handlePause}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#FB7185] to-[#F472B6] text-white rounded-full font-semibold hover:shadow-lg transition-all hover:scale-105"
                  >
                    <Pause className="w-5 h-5" />
                    Pause
                  </button>
                )}
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                  <RotateCcw className="w-5 h-5" />
                  Reset
                </button>
              </div>

              {/* Tips */}
              <div className="mt-8 p-4 bg-gradient-to-r from-[#6366F1]/10 to-[#8B5CF6]/10 rounded-xl border border-[#6366F1]/20 max-w-md">
                <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
                  💡 <strong>Tip:</strong> Find a quiet space, sit comfortably, and focus on your breath. Let thoughts pass without judgment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
