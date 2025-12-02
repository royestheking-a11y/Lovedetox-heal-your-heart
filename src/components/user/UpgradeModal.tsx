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
    const [planType, setPlanType] = useState<'PRO_MONTHLY' | 'PRO_LIFETIME' | null>(null);
    const [view, setView] = useState(type);

    // ... (keep existing code)

    const handleSubmitPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!planType) {
            toast.error('Please select a plan (Monthly or Lifetime)');
            return;
        }
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

    // ... (keep existing code)

    <div className="space-y-4 mb-6">
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                1. Select Plan
            </label>
            <div className="grid grid-cols-2 gap-3">
                <button
                    type="button"
                    onClick={() => setPlanType('PRO_MONTHLY')}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${planType === 'PRO_MONTHLY'
                        ? 'border-[#6366F1] bg-[#6366F1]/5 ring-2 ring-[#6366F1]/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-[#6366F1]/50'
                        }`}
                >
                    <div className="font-bold text-gray-900 dark:text-white">Monthly</div>
                    <div className="text-sm text-[#6366F1]">৳199</div>
                </button>
                <button
                    type="button"
                    onClick={() => setPlanType('PRO_LIFETIME')}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${planType === 'PRO_LIFETIME'
                        ? 'border-[#6366F1] bg-[#6366F1]/5 ring-2 ring-[#6366F1]/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-[#6366F1]/50'
                        }`}
                >
                    <div className="font-bold text-gray-900 dark:text-white">Lifetime</div>
                    <div className="text-sm text-[#6366F1]">৳10,000</div>
                </button>
            </div>
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
                    )
}
                </div >
            </div >
        </div >
    );
}
