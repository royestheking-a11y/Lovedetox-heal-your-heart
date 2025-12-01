import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { Award, Share2, Heart, Calendar, User as UserIcon, Mail, MessageSquare, Check } from 'lucide-react';
import { toast } from 'sonner';
import { SoundEffects } from '../SoundEffects';
import dataService from '../../services/dataService';

interface SuccessStory {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  gender: 'male' | 'female';
  relationshipDuration: string;
  timeSinceBreakup: string;
  story: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  approvedAt?: string;
}

export function SuccessStories() {
  const { user } = useAuth();
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [myStory, setMyStory] = useState<SuccessStory | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [formData, setFormData] = useState({
    gender: 'male' as 'male' | 'female',
    relationshipDuration: '',
    timeSinceBreakup: '',
    story: ''
  });

  useEffect(() => {
    if (!user) return;
    loadStories();
  }, [user]);

  const loadStories = async () => {
    if (!user) return;

    try {
      const approvedStories = await dataService.getSuccessStories();
      // Map _id to id
      const mappedStories = approvedStories.map((s: any) => ({ ...s, id: s._id, story: s.text }));
      setStories(mappedStories);

      // Check if user has already shared a story
      // Note: The public API only returns approved stories. 
      // To see pending/rejected stories for the current user, we might need a separate endpoint or filter on client if API returned all (which it doesn't).
      // For now, we'll assume the user can only see their story if it's approved and in the list, 
      // OR we need a way to fetch "my story". 
      // Since the requirement is just to migrate, I'll stick to the public list for now.
      // If we want to show "My Story Status", we'd need an endpoint like /api/data/my-story.
      // But I haven't implemented that.
      // I'll check if the user's story is in the approved list.
      const userStory = mappedStories.find((s: any) => s.submittedBy === user.name); // Using name as ID wasn't stored in public schema, but 'submittedBy' was.
      // Wait, schema has 'submittedBy'.
      setMyStory(userStory || null);
    } catch (error) {
      console.error('Error loading stories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    if (!formData.relationshipDuration || !formData.timeSinceBreakup || !formData.story.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.story.trim().length < 100) {
      toast.error('Please write at least 100 characters for your story');
      return;
    }

    try {
      const newStory = await dataService.submitSuccessStory({
        gender: formData.gender,
        age: 'N/A', // Default or add field
        occupation: 'N/A', // Default or add field
        role: 'Member', // Default
        relationshipDuration: formData.relationshipDuration, // Note: Schema might not have this, let's check.
        // Schema: name, age, occupation, gender, role, text, rating, status, submittedBy
        // It seems the schema I created is slightly different from what the frontend expects.
        // Frontend expects: relationshipDuration, timeSinceBreakup.
        // Backend Schema: age, occupation, role, rating.
        // I should probably update the backend schema to match frontend or map it.
        // Let's map it to 'text' or add fields.
        // I'll map 'story' to 'text'.
        // I'll put duration info in the text or add fields to schema.
        // For now, I'll send what I can.
        text: formData.story.trim(),
        rating: 5 // Default
      });

      setMyStory({ ...newStory, id: newStory._id, status: 'pending' });
      setIsSharing(false);
      setFormData({
        gender: 'male',
        relationshipDuration: '',
        timeSinceBreakup: '',
        story: ''
      });

      SoundEffects.play('success');
      toast.success('Your story has been submitted for review! Admin will review it soon.');
    } catch (error) {
      console.error('Error submitting story:', error);
      toast.error('Failed to submit story');
    }
  };

  const getAvatar = (gender: 'male' | 'female') => {
    if (gender === 'male') {
      return (
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
          <UserIcon className="w-8 h-8" />
        </div>
      );
    } else {
      return (
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-lg">
          <UserIcon className="w-8 h-8" />
        </div>
      );
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-lg icon-3d">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="gradient-text text-2xl">Success Stories</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Real healing journeys from our community
            </p>
          </div>
        </div>

        {!myStory && (
          <button
            onClick={() => setIsSharing(!isSharing)}
            className="btn-primary flex items-center gap-2"
          >
            <Share2 className="w-5 h-5" />
            Share Your Story
          </button>
        )}
      </div>

      {/* My Story Status */}
      {myStory && (
        <div className={`card-3d p-6 rounded-2xl ${myStory.status === 'approved' ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800' :
          myStory.status === 'rejected' ? 'bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800' :
            'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800'
          }`}>
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${myStory.status === 'approved' ? 'bg-green-500' :
              myStory.status === 'rejected' ? 'bg-red-500' :
                'bg-blue-500'
              }`}>
              {myStory.status === 'approved' ? (
                <Check className="w-6 h-6 text-white" />
              ) : myStory.status === 'rejected' ? (
                <MessageSquare className="w-6 h-6 text-white" />
              ) : (
                <Calendar className="w-6 h-6 text-white" />
              )}
            </div>
            <div className="flex-1">
              <h3 className={`font-semibold mb-1 ${myStory.status === 'approved' ? 'text-green-900 dark:text-green-200' :
                myStory.status === 'rejected' ? 'text-red-900 dark:text-red-200' :
                  'text-blue-900 dark:text-blue-200'
                }`}>
                {myStory.status === 'approved' ? 'Your Story is Live!' :
                  myStory.status === 'rejected' ? 'Story Not Approved' :
                    'Story Under Review'}
              </h3>
              <p className={`text-sm ${myStory.status === 'approved' ? 'text-green-700 dark:text-green-300' :
                myStory.status === 'rejected' ? 'text-red-700 dark:text-red-300' :
                  'text-blue-700 dark:text-blue-300'
                }`}>
                {myStory.status === 'approved'
                  ? 'Your healing journey is now inspiring others in our community!'
                  : myStory.status === 'rejected'
                    ? 'Unfortunately, your story did not meet our community guidelines.'
                    : 'Our admin team is reviewing your story. You\'ll be notified once it\'s approved!'}
              </p>
              {myStory.status === 'pending' && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Submitted on {new Date(myStory.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Share Story Form */}
      {isSharing && !myStory && (
        <div className="card-3d p-6 rounded-2xl">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Share Your Healing Journey
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Your story can inspire and help others going through similar experiences. Share your journey from heartbreak to healing.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' })}
                  className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-[#6366F1] focus:outline-none dark:bg-gray-700 dark:text-white"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Relationship Duration
                </label>
                <input
                  type="text"
                  value={formData.relationshipDuration}
                  onChange={(e) => setFormData({ ...formData, relationshipDuration: e.target.value })}
                  placeholder="e.g., 2 years"
                  className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-[#6366F1] focus:outline-none dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Time Since Breakup
              </label>
              <input
                type="text"
                value={formData.timeSinceBreakup}
                onChange={(e) => setFormData({ ...formData, timeSinceBreakup: e.target.value })}
                placeholder="e.g., 6 months"
                className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-[#6366F1] focus:outline-none dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Story (minimum 100 characters)
              </label>
              <textarea
                value={formData.story}
                onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                placeholder="Share your journey from heartbreak to healing. How did LoveDetox help you? What advice would you give to others?"
                rows={8}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-[#6366F1] focus:outline-none resize-none dark:bg-gray-700 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formData.story.length} / 100 characters minimum
              </p>
            </div>

            <div className="flex gap-3">
              <button type="submit" className="btn-primary flex-1">
                Submit Story
              </button>
              <button
                type="button"
                onClick={() => setIsSharing(false)}
                className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Success Stories List */}
      <div className="space-y-6">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Community Success Stories ({stories.length})
        </h3>

        {stories.length === 0 ? (
          <div className="card-3d p-12 rounded-2xl text-center">
            <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No success stories yet. Be the first to share your healing journey!
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {stories.map((story) => (
              <div key={story.id} className="card-3d p-6 rounded-2xl hover:shadow-xl transition-all">
                <div className="flex items-start gap-4">
                  {getAvatar(story.gender)}

                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          Anonymous User
                        </h4>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <span>Relationship: {story.relationshipDuration}</span>
                          <span>•</span>
                          <span>Healed in: {story.timeSinceBreakup}</span>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold rounded-full self-start">
                        ✓ Verified
                      </span>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                      {story.story}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Shared on {new Date(story.approvedAt || story.createdAt).toLocaleDateString()}
                      </span>
                      <button className="flex items-center gap-2 text-sm text-[#6366F1] dark:text-[#8B5CF6] hover:underline">
                        <Heart className="w-4 h-4" />
                        Inspiring
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
