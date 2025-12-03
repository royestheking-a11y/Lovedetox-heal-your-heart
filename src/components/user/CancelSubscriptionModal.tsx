import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import paymentService from '../../services/paymentService';
import { useAuth } from '../AuthContext';

interface CancelSubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CancelSubscriptionModal({ isOpen, onClose }: CancelSubscriptionModalProps) {
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [reason, setReason] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('bkash');
    const [accountNumber, setAccountNumber] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!accountNumber) {
            toast.error('Please enter your account number for refund');
            return;
        }

        setLoading(true);
        try {
            await paymentService.requestCancellation({
                reason,
                paymentMethod,
                accountNumber
            });
            toast.success('Cancellation request submitted. Admin will review shortly.');
            // Optimistically update user to show pending status if we had that in context, 
            // but for now just close modal.
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to submit request');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="relative bg-red-50 dark:bg-red-900/20 p-6 border-b border-red-100 dark:border-red-900/50">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-white/50 hover:bg-white/80 rounded-full text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
                            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Cancel Subscription</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        We're sorry to see you go. Please provide details for your refund.
                    </p>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Reason for Cancellation
                            </label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                rows={3}
                                placeholder="Why are you cancelling?"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Refund Method
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {['bkash', 'nagad', 'rocket', 'bank'].map((m) => (
                                    <button
                                        key={m}
                                        type="button"
                                        onClick={() => setPaymentMethod(m)}
                                        className={`p-2 rounded-lg border capitalize text-sm ${paymentMethod === m
                                            ? 'border-red-500 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300'
                                            : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                                            }`}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Account Number
                            </label>
                            <input
                                type="text"
                                value={accountNumber}
                                onChange={(e) => setAccountNumber(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                placeholder="Enter account number"
                                required
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold shadow-lg transition-all disabled:opacity-50"
                            >
                                {loading ? 'Submitting...' : 'Confirm Cancellation'}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full mt-2 py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400"
                            >
                                Keep my subscription
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
