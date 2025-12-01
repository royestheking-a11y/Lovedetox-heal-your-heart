import { useState, useEffect } from 'react';
import { Sparkles, Check, X, Eye, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';
import adminService from '../../services/adminService';
import { UserAvatar } from '../UserAvatar';

interface SuccessStory {
  id: string;
  name: string;
  age: string;
  occupation: string;
  gender: 'male' | 'female';
  role: string;
  text: string;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedBy: string;
  createdAt: string;
}

export function SuccessStoryManagement() {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedStory, setSelectedStory] = useState<SuccessStory | null>(null);

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      const stories = await adminService.getSuccessStories();
      // Map _id to id
      const mappedStories = stories.map((s: any) => ({ ...s, id: s._id }));
      setStories(mappedStories);
    } catch (error) {
      console.error('Error loading stories:', error);
      toast.error('Failed to load stories');
    }
  };

  const approveStory = async (id: string) => {
    try {
      await adminService.updateSuccessStoryStatus(id, 'approved');
      loadStories();
      toast.success('Success story approved!');
    } catch (error) {
      console.error('Error approving story:', error);
      toast.error('Failed to approve story');
    }
  };

  const rejectStory = async (id: string) => {
    try {
      await adminService.updateSuccessStoryStatus(id, 'rejected');
      loadStories();
      toast.error('Success story rejected');
    } catch (error) {
      console.error('Error rejecting story:', error);
      toast.error('Failed to reject story');
    }
  };

  const deleteStory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this story?')) return;

    try {
      await adminService.deleteSuccessStory(id);
      loadStories();
      toast.success('Story deleted');
    } catch (error) {
      console.error('Error deleting story:', error);
      toast.error('Failed to delete story');
    }
  };

  const filteredStories = filter === 'all'
    ? stories
    : stories.filter(s => s.status === filter);

  const stats = {
    total: stories.length,
    pending: stories.filter(s => s.status === 'pending').length,
    approved: stories.filter(s => s.status === 'approved').length,
    rejected: stories.filter(s => s.status === 'rejected').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Success Stories</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Manage user-submitted testimonials</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.total}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Stories</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="text-3xl font-bold text-yellow-600 mb-1">{stats.pending}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Pending Review</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="text-3xl font-bold text-green-600 mb-1">{stats.approved}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Approved</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="text-3xl font-bold text-red-600 mb-1">{stats.rejected}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Rejected</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${filter === f
                ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Stories List */}
      <div className="space-y-4">
        {filteredStories.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-12 rounded-2xl border border-gray-200 dark:border-gray-700 text-center">
            <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400">No stories in this category</p>
          </div>
        ) : (
          filteredStories.map((story) => (
            <div
              key={story.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <UserAvatar gender={story.gender} size="md" />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{story.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{story.role}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(story.rating)].map((_, i) => (
                          <div key={i} className="w-4 h-4 bg-yellow-400 rounded-sm" />
                        ))}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${story.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        story.status === 'approved' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                      }`}>
                      {story.status}
                    </span>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 mb-4 italic">"{story.text}"</p>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      Submitted {new Date(story.createdAt).toLocaleDateString()} by {story.submittedBy}
                    </div>

                    <div className="flex gap-2">
                      {story.status === 'pending' && (
                        <>
                          <button
                            onClick={() => approveStory(story.id)}
                            className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-1 text-sm"
                          >
                            <Check className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => rejectStory(story.id)}
                            className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-1 text-sm"
                          >
                            <X className="w-4 h-4" />
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => deleteStory(story.id)}
                        className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-1 text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
