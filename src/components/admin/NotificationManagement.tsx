import { useState } from 'react';
import { Send } from 'lucide-react';
import { toast } from 'sonner';
import { addNotification } from '../NotificationSystem';

export function NotificationManagement() {
  const [notification, setNotification] = useState({
    title: '',
    message: '',
    target: 'all'
  });

  const sendNotification = () => {
    if (!notification.title || !notification.message) {
      toast.error('Please fill in all fields');
      return;
    }

    // Get all users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    let targetUsers = users.filter((u: any) => !u.isAdmin);
    
    // Filter by target
    if (notification.target === 'free') {
      targetUsers = targetUsers.filter((u: any) => !u.isPro);
    } else if (notification.target === 'pro') {
      targetUsers = targetUsers.filter((u: any) => u.isPro);
    }
    
    // Send notification to all target users
    targetUsers.forEach((user: any) => {
      addNotification(user.id, {
        type: 'info',
        title: notification.title,
        message: notification.message
      });
    });
    
    toast.success(`Notification sent to ${targetUsers.length} ${notification.target} users!`);
    setNotification({ title: '', message: '', target: 'all' });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="gradient-text mb-2">Global User Communication</h2>
        <p className="text-gray-600">Send announcements and notifications to users</p>
      </div>

      <div className="bg-white p-8 rounded-2xl border-2 border-gray-100">
        <div className="space-y-6">
          <div>
            <label className="block text-sm text-gray-600 mb-2">Notification Title</label>
            <input
              type="text"
              value={notification.title}
              onChange={(e) => setNotification({ ...notification, title: e.target.value })}
              placeholder="e.g., New Feature Available!"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FF8DAA] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">Message</label>
            <textarea
              value={notification.message}
              onChange={(e) => setNotification({ ...notification, message: e.target.value })}
              placeholder="Write your message..."
              rows={6}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FF8DAA] focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">Target Audience</label>
            <div className="grid grid-cols-3 gap-3">
              {['all', 'free', 'pro'].map(target => (
                <button
                  key={target}
                  onClick={() => setNotification({ ...notification, target })}
                  className={`px-4 py-3 rounded-xl border-2 transition-all capitalize ${
                    notification.target === target
                      ? 'border-[#FF8DAA] bg-gradient-to-br from-[#4B0082]/5 to-[#FF8DAA]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {target} Users
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={sendNotification}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 gradient-primary text-white rounded-xl hover:opacity-90 transition-opacity"
          >
            <Send className="w-5 h-5" />
            Send Notification
          </button>
        </div>
      </div>
    </div>
  );
}
