import { useState, useEffect } from 'react';
import { Palette, Save, BarChart3, Shield, Check, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../services/api';

export function MindCanvasControl() {
    const [stats, setStats] = useState({
        today: 0,
        week: 0,
        month: 0,
        total: 0
    });
    const [settings, setSettings] = useState({
        dailyLimit: 5,
        stylesEnabled: true,
        unsafePromptsDisabled: true
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchStats();
        // In a real app, we would also fetch current settings here
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get('/mind-canvas/admin/stats');
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
            toast.error('Failed to load Mind Canvas stats');
        }
    };

    const handleSaveSettings = async () => {
        setLoading(true);
        try {
            await api.post('/mind-canvas/admin/settings', {
                dailyLimit: settings.dailyLimit,
                stylesEnabled: settings.stylesEnabled,
                unsafePromptsDisabled: settings.unsafePromptsDisabled
            });
            toast.success('Settings updated successfully');
        } catch (error) {
            console.error('Error saving settings:', error);
            toast.error('Failed to save settings');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <Palette className="w-8 h-8 text-purple-600" />
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Mind Canvas Control</h2>
                    <p className="text-gray-600">Manage AI art generation features and limits</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Generated Today', value: stats.today, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: 'This Week', value: stats.week, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'This Month', value: stats.month, color: 'text-pink-600', bg: 'bg-pink-50' },
                    { label: 'Total Images', value: stats.total, color: 'text-green-600', bg: 'bg-green-50' }
                ].map((stat, index) => (
                    <div key={index} className={`p-6 rounded-xl border border-gray-100 ${stat.bg}`}>
                        <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                        <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Limits & Controls */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <Shield className="w-5 h-5 text-gray-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Usage Limits & Safety</h3>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Daily Generation Limit (Free Users)
                            </label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="range"
                                    min="1"
                                    max="20"
                                    value={settings.dailyLimit}
                                    onChange={(e) => setSettings({ ...settings, dailyLimit: parseInt(e.target.value) })}
                                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                                />
                                <span className="w-12 text-center font-bold text-gray-900 border border-gray-200 rounded-lg py-1">
                                    {settings.dailyLimit}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Pro users have unlimited access</p>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <p className="font-medium text-gray-900">Content Safety Filter</p>
                                <p className="text-xs text-gray-500">Block unsafe or inappropriate prompts</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.unsafePromptsDisabled}
                                    onChange={(e) => setSettings({ ...settings, unsafePromptsDisabled: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <p className="font-medium text-gray-900">Enable Art Styles</p>
                                <p className="text-xs text-gray-500">Allow users to choose different styles</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.stylesEnabled}
                                    onChange={(e) => setSettings({ ...settings, stylesEnabled: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Feature Status */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <BarChart3 className="w-5 h-5 text-gray-600" />
                        <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-green-50 text-green-700 rounded-lg border border-green-100">
                            <Check className="w-5 h-5" />
                            <div>
                                <p className="font-medium">Pollinations.ai API</p>
                                <p className="text-xs opacity-80">Operational</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
                            <RefreshCw className="w-5 h-5" />
                            <div>
                                <p className="font-medium">Image Storage</p>
                                <p className="text-xs opacity-80">Connected to Database</p>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <button
                                onClick={handleSaveSettings}
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
                            >
                                {loading ? (
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
