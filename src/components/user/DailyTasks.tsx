import { useAuth } from '../AuthContext';
import { useEffect, useState } from 'react';
import { CheckCircle, Circle, Clock, Plus, Target, Zap, Award, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { PremiumIcon } from '../PremiumIcon';
import { addNotification } from '../NotificationSystem';
import dataService from '../../services/dataService';

interface Task {
  id: string;
  title: string;
  description: string;
  timeEstimate: string;
  completed: boolean;
  date: string;
}

export function DailyTasks() {
  const { user, updateUser } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (!user) return;
    loadTasks();
  }, [user]);

  const loadTasks = async () => {
    if (!user) return;
    try {
      const fetchedTasks = await dataService.getTasks();
      // Map _id to id if necessary, or just use _id
      const mappedTasks = fetchedTasks.map((t: any) => ({ ...t, id: t._id }));
      setTasks(mappedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast.error('Failed to load tasks');
    }
  };

  const toggleTask = async (taskId: string) => {
    if (!user) return;

    const taskToUpdate = tasks.find(t => t.id === taskId);
    if (!taskToUpdate) return;

    const newCompletedStatus = !taskToUpdate.completed;

    try {
      // Optimistic update
      const updatedTasks = tasks.map(task => {
        if (task.id === taskId) {
          return { ...task, completed: newCompletedStatus };
        }
        return task;
      });
      setTasks(updatedTasks);

      await dataService.updateTask(taskId, { completed: newCompletedStatus });

      if (newCompletedStatus) {
        toast.success('Task completed! Great progress! 🎉');

        // Send notification
        addNotification(user.id, {
          type: 'success',
          title: 'Task Completed! 🎉',
          message: `You completed: ${taskToUpdate.title}`
        });

        // Update streak and progress
        const completedTasks = updatedTasks.filter(t => t.completed).length;
        const progress = Math.min(Math.round((completedTasks / 30) * 100), 100);

        // Check for streak milestones
        const newStreak = (user.streak || 0) + 1;
        if (newStreak % 7 === 0) {
          addNotification(user.id, {
            type: 'achievement',
            title: `${newStreak} Day Streak! 🔥`,
            message: `Amazing! You've maintained your healing journey for ${newStreak} days!`
          });
        }

        updateUser({
          streak: newStreak,
          recoveryProgress: progress,
          noContactDays: (user.noContactDays || 0) + 1
        });
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
      // Revert optimistic update
      loadTasks();
    }
  };

  const addNewTask = async () => {
    if (!user) return;

    const newTaskData = {
      text: 'New healing task', // Backend expects 'text' not 'title' based on my model? Wait, let me check Task model.
      // Task model: text, completed, date.
      // Frontend Task interface: title, description, timeEstimate.
      // I should probably update the backend model or the frontend to match.
      // The frontend uses title and description.
      // I'll update the backend model to include title, description, timeEstimate.
      // Or map them.
      // Let's assume I'll update the backend model in a moment.
      title: 'New healing task',
      description: 'Click to edit this task',
      timeEstimate: '15 min',
      completed: false,
      date: new Date().toISOString()
    };

    try {
      // For now, I'll send what the frontend expects and update the backend model to match.
      const createdTask = await dataService.createTask(newTaskData);
      const mappedTask = { ...createdTask, id: createdTask._id };
      setTasks([...tasks, mappedTask]);
      toast.success('New task added!');
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task');
    }
  };

  const todayTasks = tasks.filter(task => {
    const taskDate = new Date(task.date).toDateString();
    const today = new Date().toDateString();
    return taskDate === today;
  });

  const upcomingTasks = tasks.filter(task => {
    const taskDate = new Date(task.date).toDateString();
    const today = new Date().toDateString();
    return taskDate !== today;
  });

  const completedToday = todayTasks.filter(t => t.completed).length;
  const totalToday = todayTasks.length;
  const progressPercentage = totalToday > 0 ? (completedToday / totalToday) * 100 : 0;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <PremiumIcon Icon={Target} size="md" variant="3d" gradient="from-[#6366F1] to-[#8B5CF6]" />
          <h2 className="gradient-text">Your Daily Recovery Tasks</h2>
        </div>
        <p className="text-gray-600">Small consistent steps lead to lasting healing. Complete your daily tasks to strengthen your emotional recovery.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="card-3d p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <PremiumIcon Icon={CheckCircle} size="sm" variant="flat" gradient="from-[#10B981] to-[#059669]" />
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Today</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{completedToday}/{totalToday}</div>
          <p className="text-sm text-gray-500">Tasks Completed</p>
        </div>

        <div className="card-3d p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <PremiumIcon Icon={Zap} size="sm" variant="flat" gradient="from-[#F59E0B] to-[#D97706]" />
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Streak</span>
          </div>
          <div className="text-3xl font-bold gradient-text mb-1">{user?.streak || 0}</div>
          <p className="text-sm text-gray-500">Days Active</p>
        </div>

        <div className="card-3d p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <PremiumIcon Icon={TrendingUp} size="sm" variant="flat" gradient="from-[#8B5CF6] to-[#7C3AED]" />
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Progress</span>
          </div>
          <div className="text-3xl font-bold gradient-text mb-1">{Math.round(progressPercentage)}%</div>
          <p className="text-sm text-gray-500">Today's Goal</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="card-3d p-6 rounded-2xl mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-gray-900 font-semibold mb-1">Today's Progress</h4>
            <p className="text-sm text-gray-500">{completedToday} of {totalToday} tasks completed</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold gradient-text">{Math.round(progressPercentage)}%</div>
          </div>
        </div>
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-[#FB7185] transition-all duration-500 relative"
            style={{ width: `${progressPercentage}%` }}
          >
            <div className="absolute inset-0 animate-shimmer" />
          </div>
        </div>
        {progressPercentage === 100 && (
          <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 flex items-center gap-3">
            <Award className="w-5 h-5 text-green-600" />
            <p className="text-sm text-green-800 font-medium">Perfect! All tasks completed today! 🎉</p>
          </div>
        )}
      </div>

      {/* Today's Tasks */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-gray-900 font-semibold flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#6366F1]" />
            Today's Tasks
          </h4>
          <button
            onClick={addNewTask}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-full hover:shadow-lg transition-all hover:scale-105 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>

        {todayTasks.length === 0 ? (
          <div className="card-3d p-12 rounded-2xl text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 mb-4">
              <CheckCircle className="w-10 h-10 text-gray-400" />
            </div>
            <h5 className="text-gray-900 mb-2">No tasks for today</h5>
            <p className="text-gray-500 mb-6">Add your first healing task to get started</p>
            <button
              onClick={addNewTask}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create First Task
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {todayTasks.map((task) => (
              <button
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`w-full card-3d p-6 rounded-2xl text-left transition-all group ${task.completed ? 'opacity-75' : ''
                  }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 mt-1 transition-all ${task.completed ? 'scale-110' : ''
                    }`}>
                    {task.completed ? (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center shadow-lg">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full border-3 border-gray-300 group-hover:border-[#6366F1] transition-colors flex items-center justify-center">
                        <Circle className="w-5 h-5 text-gray-300 group-hover:text-[#6366F1]" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h5 className={`text-gray-900 font-medium mb-1 ${task.completed ? 'line-through text-gray-500' : ''
                      }`}>
                      {task.title}
                    </h5>
                    <p className={`text-sm mb-3 ${task.completed ? 'text-gray-400 line-through' : 'text-gray-600'
                      }`}>
                      {task.description}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{task.timeEstimate}</span>
                      </div>
                      {task.completed && (
                        <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                          <CheckCircle className="w-4 h-4" />
                          <span>Completed</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Tasks */}
      {upcomingTasks.length > 0 && (
        <div>
          <h4 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-600" />
            Upcoming Tasks
          </h4>
          <div className="space-y-3">
            {upcomingTasks.map((task) => (
              <div
                key={task.id}
                className="card-3d p-6 rounded-2xl opacity-60"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-7 h-7 rounded-full border-2 border-gray-300 flex items-center justify-center">
                      <Circle className="w-5 h-5 text-gray-300" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h5 className="text-gray-700 font-medium mb-1">{task.title}</h5>
                    <p className="text-sm text-gray-500 mb-3">{task.description}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{task.timeEstimate}</span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(task.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Motivation Card */}
      <div className="mt-8 relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-[#6366F1] via-[#8B5CF6] to-[#FB7185]" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative p-8 text-white">
          <div className="flex items-start gap-4">
            <PremiumIcon Icon={Award} size="lg" variant="flat" gradient="from-white to-white/90" />
            <div>
              <h4 className="text-white font-semibold mb-2">Keep Going! You're Doing Amazing</h4>
              <p className="text-white/90 mb-4">
                Every completed task is a step toward emotional freedom. Your consistency today builds the strength you need tomorrow.
              </p>
              <div className="flex items-center gap-2 text-sm text-white/80">
                <Zap className="w-4 h-4" />
                <span>You've completed {tasks.filter(t => t.completed).length} tasks total</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
