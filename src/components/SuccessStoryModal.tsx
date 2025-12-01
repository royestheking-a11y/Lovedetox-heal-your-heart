import { useState } from 'react';
import { X, Star, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { SoundEffects } from './SoundEffects';

interface SuccessStoryModalProps {
  onClose: () => void;
  userEmail?: string;
}

export function SuccessStoryModal({ onClose, userEmail }: SuccessStoryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    occupation: '',
    gender: 'female' as 'male' | 'female',
    story: '',
    rating: 5
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.age || !formData.occupation || !formData.story) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Get existing stories
    const stories = JSON.parse(localStorage.getItem('successStories') || '[]');
    
    // Add new story
    const newStory = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...formData,
      role: `${formData.age}, ${formData.occupation}`,
      text: formData.story,
      submittedBy: userEmail || 'guest',
      status: 'pending', // Admin needs to approve
      createdAt: new Date().toISOString()
    };

    stories.push(newStory);
    localStorage.setItem('successStories', JSON.stringify(stories));

    SoundEffects.play('success');
    toast.success('Success story submitted! It will be reviewed by our team.');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-white text-2xl font-bold">Share Your Success Story</h2>
                <p className="text-white/80 text-sm">Inspire others on their healing journey</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Your Name (or Initials) *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Sarah M."
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl focus:border-[#6366F1] focus:outline-none transition-colors"
              required
            />
          </div>

          {/* Age and Occupation */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Age *
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="28"
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl focus:border-[#6366F1] focus:outline-none transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Occupation *
              </label>
              <input
                type="text"
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                placeholder="Marketing Manager"
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl focus:border-[#6366F1] focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Gender *
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === 'female'}
                  onChange={(e) => setFormData({ ...formData, gender: 'female' })}
                  className="w-4 h-4 text-[#6366F1]"
                />
                <span className="text-gray-700 dark:text-gray-300">Female</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === 'male'}
                  onChange={(e) => setFormData({ ...formData, gender: 'male' })}
                  className="w-4 h-4 text-[#6366F1]"
                />
                <span className="text-gray-700 dark:text-gray-300">Male</span>
              </label>
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Your Rating *
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating })}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      rating <= formData.rating
                        ? 'fill-[#FB7185] text-[#FB7185]'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Story */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Your Success Story *
            </label>
            <textarea
              value={formData.story}
              onChange={(e) => setFormData({ ...formData, story: e.target.value })}
              placeholder="Share your healing journey... How did LoveDetox help you? What changed in your life?"
              rows={6}
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl focus:border-[#6366F1] focus:outline-none transition-colors resize-none"
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Minimum 50 characters. Your story will be reviewed before publishing.
            </p>
          </div>

          {/* Privacy Notice */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <p className="text-sm text-blue-900 dark:text-blue-200">
              <strong>Privacy:</strong> Your story will be reviewed by our team before being published. 
              We may edit for clarity while preserving your message. Personal details can be anonymized upon request.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-xl hover:opacity-90 transition-opacity font-semibold"
            >
              Submit Story
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
