import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { Shield, AlertTriangle, RefreshCw, Heart, Brain, CheckCircle, X, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { addNotification } from '../NotificationSystem';
import { PremiumIcon } from '../PremiumIcon';

export function NoContactJourney() {
    const { user, updateUser } = useAuth();
    const [showRelapseModal, setShowRelapseModal] = useState(false);
    const [setupDate, setSetupDate] = useState('');
    const [setupReason, setSetupReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [messageText, setMessageText] = useState('');
    const [unsentMessages, setUnsentMessages] = useState<any[]>([]);

    useEffect(() => {
        loadMessages();
    }, [user]);

    const loadMessages = async () => {
        if (!user) return;
        try {
            const { default: dataService } = await import('../../services/dataService');
            const messages = await dataService.getNoContactMessages();
            setUnsentMessages(messages);
        } catch (error) {
            console.error('Failed to load messages:', error);
        }
    };

    const handleSaveMessage = async () => {
        if (!messageText.trim()) {
            toast.error('Please write a message first');
            return;
        }

        try {
            const { default: dataService } = await import('../../services/dataService');
            const newMessage = await dataService.createNoContactMessage({
                message: messageText,
                exName: 'Ex', // Optional, can be added to settings later
                sentiment: 'neutral'
            });

            setUnsentMessages([newMessage, ...unsentMessages]);
            setMessageText('');
            toast.success('Message saved. You did the right thing! 🛡️');

            addNotification(user!.id, {
                type: 'success',
                title: 'Strong Decision! 💪',
                message: 'You saved this message instead of sending it. That is real progress!'
            });
        } catch (error) {
            toast.error('Failed to save message');
        }
    };

    const deleteMessage = async (id: string) => {
        try {
            const { default: dataService } = await import('../../services/dataService');
            await dataService.deleteNoContactMessage(id);
            setUnsentMessages(unsentMessages.filter(m => m._id !== id));
            toast.success('Message deleted');
        } catch (error) {
            toast.error('Failed to delete message');
        }
    };

    // Calculate stats
    const getDaysPassed = () => {
        if (!user?.noContactStartDate) return 0;
        const start = new Date(user.noContactStartDate);
        const now = new Date();
        const diff = now.getTime() - start.getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    };

    const daysPassed = getDaysPassed();

    // Milestones
    const milestones = [
        { days: 1, label: 'The First Step', message: 'You made it through the hardest day.' },
        { days: 3, label: 'Chemical Detox', message: 'Your brain is craving dopamine. Stay strong.' },
        { days: 7, label: 'One Week Strong', message: 'Physical withdrawal symptoms are fading.' },
        { days: 14, label: 'Clarity Returns', message: 'You are starting to see things objectively.' },
        { days: 30, label: 'New Habits', message: 'You have broken the cycle of dependency.' },
        { days: 60, label: 'Emotional Freedom', message: 'You are rediscovering who you are.' },
        { days: 90, label: 'Healed State', message: 'You are ready for a new chapter.' }
    ];

    const nextMilestone = milestones.find(m => m.days > daysPassed) || milestones[milestones.length - 1];
    const progressToNext = Math.min(100, (daysPassed / nextMilestone.days) * 100);

    const handleSetup = async () => {
        if (!setupDate) {
            toast.error('Please select a date');
            return;
        }

        setLoading(true);
        try {
            const { default: dataService } = await import('../../services/dataService');
            await dataService.updateProfile({
                noContactStartDate: new Date(setupDate),
                breakupDate: new Date(setupDate), // Assuming start date is close to breakup or restart
                noContactActive: true,
                relapseCount: 0
            });

            // Update local user context
            updateUser({
                noContactStartDate: new Date(setupDate),
                noContactActive: true,
                relapseCount: 0
            });

            toast.success('Your healing journey has begun! 🛡️');
            addNotification(user!.id, {
                type: 'success',
                title: 'Journey Started',
                message: 'You have taken the first step towards healing. We are here with you.'
            });
        } catch (error) {
            console.error('Setup failed:', error);
            toast.error('Failed to save settings');
        } finally {
            setLoading(false);
        }
    };

    const handleRelapse = async () => {
        setLoading(true);
        try {
            const { default: dataService } = await import('../../services/dataService');

            const newHistory = [
                ...(user?.relapseHistory || []),
                { date: new Date(), reason: 'User reported relapse' }
            ];

            await dataService.updateProfile({
                noContactStartDate: new Date(), // Reset start date to now
                relapseCount: (user?.relapseCount || 0) + 1,
                relapseHistory: newHistory
            });

            updateUser({
                noContactStartDate: new Date(),
                relapseCount: (user?.relapseCount || 0) + 1,
                relapseHistory: newHistory
            });

            setShowRelapseModal(false);
            toast.info('Streak reset. Healing is not linear. Keep going.');

            addNotification(user!.id, {
                type: 'warning',
                title: 'Streak Reset',
                message: 'It is okay to fall. What matters is that you get back up.'
            });

        } catch (error) {
            console.error('Relapse update failed:', error);
            toast.error('Failed to update status');
        } finally {
            setLoading(false);
        }
    };

    // SETUP SCREEN
    if (!user?.noContactStartDate) {
        return (
            <div className="max-w-2xl mx-auto p-6">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                        <Shield className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Start Your No Contact Journey</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        "The best way to heal a wound is to stop touching it."
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                When did you last contact them?
                            </label>
                            <input
                                type="date"
                                value={setupDate}
                                onChange={(e) => setSetupDate(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-[#6366F1] outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Why are you doing this? (Optional)
                            </label>
                            <textarea
                                value={setupReason}
                                onChange={(e) => setSetupReason(e.target.value)}
                                placeholder="To heal myself, to find peace..."
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-[#6366F1] outline-none transition-all h-24"
                            />
                        </div>

                        <button
                            onClick={handleSetup}
                            disabled={loading}
                            className="w-full btn-primary py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
                        >
                            {loading ? 'Starting...' : 'Start My Healing Streak'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // DASHBOARD SCREEN
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header Stats */}
            <div className="grid md:grid-cols-3 gap-6">
                {/* Main Streak Card */}
                <div className="md:col-span-2 relative overflow-hidden bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-3xl p-8 text-white shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <Shield className="w-6 h-6 text-white/80" />
                            <span className="text-white/80 font-medium tracking-wide uppercase text-sm">Active Streak</span>
                        </div>
                        <div className="flex items-baseline gap-2 mb-4">
                            <span className="text-7xl font-bold">{daysPassed}</span>
                            <span className="text-2xl font-medium text-white/80">Days</span>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-white/90">
                                <span>Next Milestone: {nextMilestone.label}</span>
                                <span>{nextMilestone.days} Days</span>
                            </div>
                            <div className="h-3 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
                                <div
                                    className="h-full bg-white rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${progressToNext}%` }}
                                ></div>
                            </div>
                            <p className="text-sm text-white/70 italic mt-2">"{nextMilestone.message}"</p>
                        </div>
                    </div>
                </div>

                {/* Relapse / Status Card */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-lg flex flex-col justify-between">
                    <div>
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wide mb-4">Status</h3>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <div className="font-bold text-gray-900 dark:text-white">Healing Mode</div>
                                <div className="text-xs text-gray-500">Active & Protected</div>
                            </div>
                        </div>

                        {(user.relapseCount || 0) > 0 && (
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                <RefreshCw className="w-4 h-4" />
                                <span>{user.relapseCount} Relapses (Part of the journey)</span>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => setShowRelapseModal(true)}
                        className="w-full py-3 px-4 rounded-xl border-2 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors text-sm font-medium"
                    >
                        I Broke No Contact
                    </button>
                </div>
            </div>

            {/* Psychology Insights */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-4">
                        <PremiumIcon Icon={Brain} size="sm" variant="flat" gradient="from-[#FB7185] to-[#F472B6]" />
                        <h3 className="font-bold text-gray-900 dark:text-white">Brain Recovery</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        Right now, your brain is slowly resetting its dopamine receptors. The urge to contact is not "love"—it's a chemical withdrawal similar to quitting a substance. Every day you resist, neural pathways for independence are strengthening.
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-4">
                        <PremiumIcon Icon={Heart} size="sm" variant="flat" gradient="from-[#F59E0B] to-[#D97706]" />
                        <h3 className="font-bold text-gray-900 dark:text-white">Emotional State</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        You might feel waves of sadness followed by moments of clarity. This "emotional rollercoaster" is normal. Your identity is detaching from "us" and returning to "me".
                    </p>
                </div>
            </div>

            {/* Unsent Messages Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Unsent Messages</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                    Write what you want to say here instead of sending it. Get it out of your system safely.
                </p>

                <div className="flex gap-3 mb-6">
                    <input
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSaveMessage()}
                        placeholder="Type your message here..."
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-[#6366F1] outline-none transition-all"
                    />
                    <button
                        onClick={handleSaveMessage}
                        className="px-6 py-3 bg-[#6366F1] hover:bg-[#5558DD] text-white rounded-xl font-medium transition-colors shadow-lg shadow-indigo-200 dark:shadow-none"
                    >
                        Save
                    </button>
                </div>

                <div className="space-y-3">
                    {unsentMessages.length === 0 ? (
                        <p className="text-center text-gray-400 py-8 text-sm">No unsent messages yet. Stay strong.</p>
                    ) : (
                        unsentMessages.map((msg) => (
                            <div key={msg._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700">
                                <p className="text-gray-700 dark:text-gray-300">{msg.message}</p>
                                <button
                                    onClick={() => deleteMessage(msg._id)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Relapse Modal */}
            {showRelapseModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-md w-full p-8 relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setShowRelapseModal(false)}
                            className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>

                        <div className="text-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">It's Okay to Fall</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Healing is not a straight line. A slip-up doesn't erase your progress, but we need to be honest to keep moving forward.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={handleRelapse}
                                disabled={loading}
                                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-red-200 dark:shadow-none"
                            >
                                {loading ? 'Resetting...' : 'Yes, Reset My Streak'}
                            </button>
                            <button
                                onClick={() => setShowRelapseModal(false)}
                                className="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                Cancel (I didn't break it)
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
