
import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { User, Lock, Bell, Download, Trash2, Crown, Palette } from 'lucide-react';
import { toast } from 'sonner';

import { UpgradeModal } from './UpgradeModal';

export function Profile() {
  const { user, updateUser, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    dailyReminders: true
  });
  const [gallery, setGallery] = useState<any[]>([]);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    if (user) {
      fetchGallery();
    }
  }, [user]);

  const fetchGallery = async () => {
    if (!user) return;
    try {
      const dataService = (await import('../../services/dataService')).default;
      const galleryData = await dataService.getMindCanvasGallery(user.id);
      setGallery(galleryData);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    }
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    updateUser({ name, email });
    toast.success('Profile updated successfully!');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;

    try {
      // Note: In a real app, we should verify current password first.
      // For now, we just update to the new password.
      await import('../../services/authService').then(m => m.default.changePassword({ password: newPassword }));
      toast.success('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (error) {
      console.error('Password change failed:', error);
      toast.error('Failed to change password');
    }
  };

  const handleExportData = async () => {
    if (!user) return;

    const toastId = toast.loading('Generating your recovery report...');

    try {
      const dataService = (await import('../../services/dataService')).default;
      const exportService = (await import('../../services/exportService')).default;

      const [tasks, moods, journal, chat, noContactMessages] = await Promise.all([
        dataService.getTasks(),
        dataService.getMoods(),
        dataService.getJournalEntries(),
        dataService.getChatHistory(),
        dataService.getNoContactMessages()
      ]);

      const data = {
        profile: user,
        tasks,
        moods,
        journal,
        chat,
        noContactMessages
      };

      await exportService.generatePDF(data);

      toast.dismiss(toastId);
      toast.success('Your recovery report is ready! 📄');
    } catch (error) {
      console.error('Export failed:', error);
      toast.dismiss(toastId);
      toast.error('Failed to generate report. Please try again.');
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    if (!user) return;

    try {
      await import('../../services/authService').then(m => m.default.deleteAccount());
      toast.success('Account deleted. We hope you found healing.');
      logout();
    } catch (error) {
      console.error('Delete account failed:', error);
      toast.error('Failed to delete account');
    }
  };

  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `lovedetox-${filename}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Download failed');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="gradient-text mb-2">Profile & Settings</h2>
        <p className="text-gray-600">Manage your account and preferences.</p>
      </div>

      {/* Pro Status / Upgrade Banner */}
      {(!user?.isPro || user?.plan === 'PRO_TRIAL') && (
        <div className="bg-gradient-to-r from-[#4B0082] to-[#FF8DAA] p-6 rounded-2xl text-white mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Crown className="w-12 h-12" />
              <div>
                <h4 className="text-white mb-1">
                  {user?.plan === 'PRO_TRIAL' ? 'Upgrade to Lifetime Pro' : 'Upgrade to Pro'}
                </h4>
                <p className="text-white/90 text-sm">Unlock all features for unlimited healing support</p>
              </div>
            </div>
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="px-6 py-3 bg-white text-[#4B0082] rounded-full hover:scale-105 transition-transform whitespace-nowrap"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      )}

      {user?.isPro && user?.plan !== 'PRO_TRIAL' && (
        <div className="bg-gradient-to-r from-[#4B0082] to-[#FF8DAA] p-4 rounded-2xl text-white mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Crown className="w-6 h-6" />
            <span>Pro Member</span>
          </div>
          <span className="text-sm">Unlimited Access</span>
        </div>
      )}

      {/* My Art Gallery */}
      <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Palette className="w-6 h-6 text-[#4B0082]" />
          <h4 className="text-[#4B0082]">My Art Gallery</h4>
        </div>

        {gallery.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {gallery.map((img) => (
              <div key={img._id} className="relative aspect-square rounded-xl overflow-hidden group">
                <img
                  src={img.image_url}
                  alt={img.text_note}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                  <p className="text-white text-xs text-center px-2 line-clamp-2 mb-3">"{img.text_note}"</p>
                  <button
                    onClick={() => downloadImage(img.image_url, img._id)}
                    className="p-2 bg-white/20 hover:bg-white/40 rounded-full backdrop-blur-sm transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-xl">
            <Palette className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No art created yet.</p>
            <p className="text-sm text-gray-400">Visit Mind Canvas to start creating.</p>
          </div>
        )}
      </div>

      {/* Profile Information */}
      <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-6 h-6 text-[#4B0082]" />
          <h4 className="text-[#4B0082]">Profile Information</h4>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FF8DAA] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FF8DAA] focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 gradient-primary text-white rounded-xl hover:opacity-90 transition-opacity"
          >
            Update Profile
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-6 h-6 text-[#4B0082]" />
          <h4 className="text-[#4B0082]">Change Password</h4>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FF8DAA] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FF8DAA] focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={!currentPassword || !newPassword}
            className="w-full px-6 py-3 gradient-primary text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            Change Password
          </button>
        </form>
      </div>

      {/* Notifications */}
      <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-6 h-6 text-[#4B0082]" />
          <h4 className="text-[#4B0082]">Notifications</h4>
        </div>

        <div className="space-y-4">
          {[
            { key: 'email', label: 'Email Notifications', desc: 'Receive healing tips and updates' },
            { key: 'push', label: 'Push Notifications', desc: 'Get reminders for daily tasks' },
            { key: 'dailyReminders', label: 'Daily Reminders', desc: 'Daily check-in reminders' }
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="text-gray-900">{label}</p>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications[key as keyof typeof notifications]}
                  onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#4B0082] peer-checked:to-[#FF8DAA]"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 mb-6">
        <h4 className="text-[#4B0082] mb-4">Data Management</h4>

        <div className="space-y-3">
          <button
            onClick={handleExportData}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 border-2 border-gray-200 rounded-xl hover:border-[#FF8DAA] transition-all"
          >
            <Download className="w-5 h-5" />
            Export All Your Data
          </button>

          <button
            onClick={handleDeleteAccount}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 border-2 border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-all"
          >
            <Trash2 className="w-5 h-5" />
            Delete Account
          </button>
        </div>
      </div>

      {/* Account Stats */}
      <div className="bg-gradient-to-br from-[#4B0082]/5 to-[#FF8DAA]/5 p-6 rounded-2xl border-2 border-[#A57AC9]/20">
        <h4 className="text-[#4B0082] mb-4">Your Journey</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-2xl gradient-text">{user?.noContactDays || 0}</p>
            <p className="text-sm text-gray-600">Days Clean</p>
          </div>
          <div className="text-center">
            <p className="text-2xl gradient-text">{user?.streak || 0}</p>
            <p className="text-sm text-gray-600">Day Streak</p>
          </div>
          <div className="text-center">
            <p className="text-2xl gradient-text">{user?.recoveryProgress || 0}%</p>
            <p className="text-sm text-gray-600">Recovery</p>
          </div>
          <div className="text-center">
            <p className="text-2xl gradient-text">
              {new Date(user?.createdAt || '').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </p>
            <p className="text-sm text-gray-600">Member Since</p>
          </div>
        </div>
      </div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        type="payment"
      />
    </div>
  );
}
