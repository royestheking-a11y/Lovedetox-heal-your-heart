import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import adminService from '../../services/adminService';
import { useEffect } from 'react';

const phases = ['Detox Phase', 'Acceptance Phase', 'Growth Phase', 'Renewal Phase'];

export function TaskManagement() {
  const [globalTasks, setGlobalTasks] = useState<any[]>([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const tasks = await adminService.getGlobalTasks();
      // Map _id to id
      const mappedTasks = tasks.map((t: any) => ({ ...t, id: t._id }));
      setGlobalTasks(mappedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast.error('Failed to load tasks');
    }
  };
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [formData, setFormData] = useState({ title: '', phase: phases[0], timeEstimate: '15 min', active: true });

  const saveTask = async () => {
    if (!formData.title) {
      toast.error('Please enter a task title');
      return;
    }

    try {
      if (editingTask) {
        await adminService.updateGlobalTask(editingTask.id, formData);
        toast.success('Task updated');
      } else {
        await adminService.createGlobalTask(formData);
        toast.success('Task created');
      }
      loadTasks();
      setShowForm(false);
      setEditingTask(null);
      setFormData({ title: '', phase: phases[0], timeEstimate: '15 min', active: true });
    } catch (error) {
      console.error('Error saving task:', error);
      toast.error('Failed to save task');
    }
  };

  const deleteTask = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      await adminService.deleteGlobalTask(id);
      loadTasks();
      toast.success('Task deleted');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="gradient-text mb-2">Manage Healing Tasks</h2>
        <p className="text-gray-600">Create and manage tasks that users will complete</p>
      </div>

      <button
        onClick={() => setShowForm(true)}
        className="mb-6 flex items-center gap-2 px-6 py-3 gradient-primary text-white rounded-xl hover:opacity-90 transition-opacity"
      >
        <Plus className="w-5 h-5" />
        Create New Task
      </button>

      <div className="space-y-3">
        {globalTasks.map(task => (
          <div key={task.id} className="bg-white p-6 rounded-xl border-2 border-gray-100 flex items-center justify-between">
            <div>
              <h5 className="text-gray-900 mb-1">{task.title}</h5>
              <p className="text-sm text-gray-600">{task.phase} • {task.timeEstimate}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditingTask(task);
                  setFormData(task);
                  setShowForm(true);
                }}
                className="p-2 text-[#4B0082] hover:bg-[#4B0082]/5 rounded-lg"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8">
            <h3 className="gradient-text mb-6">{editingTask ? 'Edit Task' : 'Create Task'}</h3>

            <div className="space-y-4 mb-6">
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Task title"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FF8DAA] focus:outline-none"
              />

              <select
                value={formData.phase}
                onChange={(e) => setFormData({ ...formData, phase: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FF8DAA] focus:outline-none"
              >
                {phases.map(phase => <option key={phase} value={phase}>{phase}</option>)}
              </select>

              <input
                type="text"
                value={formData.timeEstimate}
                onChange={(e) => setFormData({ ...formData, timeEstimate: e.target.value })}
                placeholder="Time estimate"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FF8DAA] focus:outline-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={saveTask}
                className="flex-1 px-6 py-3 gradient-primary text-white rounded-xl hover:opacity-90"
              >
                Save Task
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingTask(null);
                  setFormData({ title: '', phase: phases[0], timeEstimate: '15 min', active: true });
                }}
                className="px-6 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
