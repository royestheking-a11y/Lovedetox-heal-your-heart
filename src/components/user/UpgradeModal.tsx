import { useState } from 'react';
import { X, Check, Sparkles, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import paymentService from '../../services/paymentService';
import { useAuth } from '../AuthContext';
import { SoundEffects } from '../SoundEffects';

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'trial' | 'payment' | 'expired' | 'upgrade_info';
}

export function UpgradeModal({ isOpen, onClose, type }: UpgradeModalProps) {
    const { updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'rocket'>('bkash');
    const [transactionId, setTransactionId] = useState('');
    const [planType, setPlanType] = useState<'PRO_MONTHLY' | 'PRO_LIFETIME'>('PRO_MONTHLY');
    const [view, setView] = useState(type);

    // Sync view with type prop when it opens
    if (view !== type && !isOpen) {
        setView(type);
    }
    // Better: use useEffect
    // But since this is a functional component, let's just use a state that defaults to type, 
    // and update it if type changes? No, type might not change.
    // Let's just use 'view' state and initialize it in useEffect.

    // Actually, simpler: 
    // If type is upgrade_info, show that view. 
    // If user clicks button, change local state to override type?
    // Let's use a local state `internalMode` which can override `type`.
    const [internalMode, setInternalMode] = useState<string | null>(null);

    const currentMode = internalMode || type;

    const handleStartTrial = async () => {
        setLoading(true);
        try {
            const response = await paymentService.startTrial();
            updateUser({
                isPro: true,
                plan: 'PRO_TRIAL',
                trialEndDate: response.trialEndDate
            });
            SoundEffects.play('success');
            toast.success('🎉 30-Day Pro Trial Activated!');
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to start trial');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!transactionId) {
            toast.error('Please enter transaction ID');
            return;
        }

        setLoading(true);
        try {
            const amount = planType === 'PRO_MONTHLY' ? 199 : 10000;
            await paymentService.submitPayment({
                transactionId,
                method: paymentMethod,
                amount,
                planType
            });
            SoundEffects.play('success');
            toast.success('Payment submitted! Admin will review shortly.');
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to submit payment');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="relative h-32 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center">
                    <button
                        onClick={() => {
                            setInternalMode(null);
                            onClose();
                        }}
                        className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <div className="text-center text-white p-6">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-md">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold">
                            {currentMode === 'trial' || currentMode === 'upgrade_info' ? 'Start Your Healing Journey' : 'Continue Without Limits'}
                        </h3>
                    </div>
                </div>

                <div className="p-6">
                    {currentMode === 'trial' || currentMode === 'upgrade_info' ? (
                        <div className="space-y-6">
                            <div className="text-center">
                                <p className="text-gray-600 dark:text-gray-300 mb-4">
                                    {currentMode === 'upgrade_info'
                                        ? "You now have full access to all premium healing tools - completely for 30 days or lifetime."
                                        : "You now have full access to all premium healing tools — completely free for 30 days."}
                                </p>
                                <div className="space-y-3 text-left bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">Unlimited AI Support</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">Unlimited Mind Canvas</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">Memory Detox & Trigger Predictor</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">No Watermarks • HD Access</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    if (currentMode === 'upgrade_info') {
                                        setInternalMode('payment');
                                    } else {
                                        handleStartTrial();
                                    }
                                }}
                                disabled={loading}
                                className="w-full py-3 px-4 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? 'Activating...' : 'Start My Healing Journey'}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="text-center mb-6">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Send payment to <span className="font-bold text-gray-900 dark:text-white">01625691878</span> (Personal)
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <button
                                    onClick={() => setPlanType('PRO_MONTHLY')}
                                    className={`p-3 rounded-xl border-2 text-center transition-all ${planType === 'PRO_MONTHLY'
                                        ? 'border-[#6366F1] bg-[#6366F1]/5'
                                        : 'border-gray-200 dark:border-gray-700'
                                        }`}
                                >
                                    <div className="font-bold text-gray-900 dark:text-white">Monthly</div>
                                    <div className="text-sm text-[#6366F1]">৳199</div>
                                </button>
                                <button
                                    onClick={() => setPlanType('PRO_LIFETIME')}
                                    className={`p-3 rounded-xl border-2 text-center transition-all ${planType === 'PRO_LIFETIME'
                                        ? 'border-[#6366F1] bg-[#6366F1]/5'
                                        : 'border-gray-200 dark:border-gray-700'
                                        }`}
                                >
                                    <div className="font-bold text-gray-900 dark:text-white">Lifetime</div>
                                    <div className="text-sm text-[#6366F1]">৳10,000</div>
                                </button>
                            </div>

                            <form onSubmit={handleSubmitPayment} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Payment Method
                                    </label>
                                    <div className="flex gap-2">
                                        {['bkash', 'nagad', 'rocket'].map((m) => (
                                            <button
                                                key={m}
                                                type="button"
                                                onClick={() => setPaymentMethod(m as any)}
                                                className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${paymentMethod === m
                                                    ? 'bg-pink-500 text-white' // Bkash color roughly
                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                                                    }`}
                                                style={{
                                                    backgroundColor: paymentMethod === m
                                                        ? (m === 'bkash' ? '#e2136e' : m === 'nagad' ? '#ec1d24' : '#8c3494')
                                                        : undefined
                                                }}
                                            >
                                                {m}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Transaction ID
                                    </label>
                                    <input
                                        type="text"
                                        value={transactionId}
                                        onChange={(e) => setTransactionId(e.target.value)}
                                        placeholder="e.g. 9H7D..."
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#6366F1] focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        required
                                    />
                                </div>

                                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg flex items-start gap-2">
                                    <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs text-blue-700 dark:text-blue-300">
                                        Your pro features will be unlocked automatically once the admin verifies your transaction ID.
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Submitting...' : 'Submit Payment'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
