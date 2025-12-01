import { useState } from 'react';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import adminService from '../../services/adminService';

export function SystemSettings() {
  const [settings, setSettings] = useState({
    siteName: 'LoveDetox',
    supportEmail: 'support@lovedetox.com',
    freeMessageLimit: 10,
    proPrice: 19,
    maintenanceMode: false,
    allowRegistration: true,
    socialLinks: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: ''
    }
  });

  // Load settings from API on mount
  useState(() => {
    loadSettings();
  });

  async function loadSettings() {
    try {
      const savedSettings = await adminService.getSettings();
      if (savedSettings) {
        setSettings(savedSettings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Failed to load system settings');
    }
  }

  const saveSettings = async () => {
    try {
      await adminService.updateSettings(settings);
      toast.success('System settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="gradient-text mb-2">System Configuration</h2>
        <p className="text-gray-600">Manage global system settings</p>
      </div>

      <div className="bg-white p-8 rounded-2xl border-2 border-gray-100 space-y-6">
        <div>
          <label className="block text-sm text-gray-600 mb-2">Site Name</label>
          <input
            type="text"
            value={settings.siteName}
            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FF8DAA] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">Support Email</label>
          <input
            type="email"
            value={settings.supportEmail}
            onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FF8DAA] focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-600 mb-2">Free Message Limit</label>
            <input
              type="number"
              value={settings.freeMessageLimit}
              onChange={(e) => setSettings({ ...settings, freeMessageLimit: Number(e.target.value) })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FF8DAA] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">Pro Price ($)</label>
            <input
              type="number"
              value={settings.proPrice}
              onChange={(e) => setSettings({ ...settings, proPrice: Number(e.target.value) })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FF8DAA] focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-4 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Social Media Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-600 mb-2">Facebook URL</label>
              <input
                type="text"
                value={settings.socialLinks?.facebook || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, facebook: e.target.value }
                })}
                placeholder="https://facebook.com/..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FF8DAA] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Twitter URL</label>
              <input
                type="text"
                value={settings.socialLinks?.twitter || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, twitter: e.target.value }
                })}
                placeholder="https://twitter.com/..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FF8DAA] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Instagram URL</label>
              <input
                type="text"
                value={settings.socialLinks?.instagram || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, instagram: e.target.value }
                })}
                placeholder="https://instagram.com/..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FF8DAA] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">LinkedIn URL</label>
              <input
                type="text"
                value={settings.socialLinks?.linkedin || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, linkedin: e.target.value }
                })}
                placeholder="https://linkedin.com/..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FF8DAA] focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="text-gray-900 mb-1">Maintenance Mode</p>
              <p className="text-sm text-gray-500">Disable site for maintenance</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#4B0082] peer-checked:to-[#FF8DAA]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="text-gray-900 mb-1">Allow Registration</p>
              <p className="text-sm text-gray-500">Enable new user signups</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.allowRegistration}
                onChange={(e) => setSettings({ ...settings, allowRegistration: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#4B0082] peer-checked:to-[#FF8DAA]"></div>
            </label>
          </div>
        </div>

        <button
          onClick={saveSettings}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 gradient-primary text-white rounded-xl hover:opacity-90 transition-opacity"
        >
          <Save className="w-5 h-5" />
          Save All Settings
        </button>
      </div>
    </div>
  );
}
