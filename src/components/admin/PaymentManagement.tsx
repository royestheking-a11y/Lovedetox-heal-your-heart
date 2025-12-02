import { useState, useEffect } from 'react';
import { Check, X, CreditCard, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';
import paymentService from '../../services/paymentService';

export function PaymentManagement() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        setLoading(true);
        try {
            const data = await paymentService.getPaymentRequests();
            setRequests(data);
        } catch (error) {
            console.error('Error loading requests:', error);
            toast.error('Failed to load payment requests');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (userId: string, paymentId: string, planType: string) => {
        try {
            await paymentService.approvePayment({ userId, paymentId, planType });
            toast.success('Payment approved and user upgraded');
            loadRequests();
        } catch (error) {
            toast.error('Failed to approve payment');
        }
    };

    const handleReject = async (userId: string, paymentId: string) => {
        if (!confirm('Are you sure you want to reject this payment?')) return;
        try {
            await paymentService.rejectPayment({ userId, paymentId });
            toast.success('Payment rejected');
            loadRequests();
        } catch (error) {
            toast.error('Failed to reject payment');
        }
    };

    const handleRefund = async (userId: string, paymentId: string) => {
        if (!confirm('Confirm refund and downgrade user?')) return;
        try {
            await paymentService.confirmRefund({ userId, paymentId });
            toast.success('Refund confirmed');
            loadRequests();
        } catch (error) {
            toast.error('Failed to process refund');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Requests</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Manage subscriptions and refunds</p>
                </div>
                <button
                    onClick={loadRequests}
                    className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
                >
                    <RefreshCcw className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {requests.length === 0 ? (
                    <div className="p-12 text-center">
                        <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No pending payment requests</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {requests.map((req) => (
                            <div key={req._id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${req.type === 'subscription'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                                }`}>
                                                {req.type.toUpperCase()}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {new Date(req.date).toLocaleString()}
                                            </span>
                                        </div>

                                        <h4 className="font-semibold text-gray-900 dark:text-white">{req.userName}</h4>
                                        <p className="text-sm text-gray-500 mb-2">{req.userEmail}</p>

                                        <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                                            <div>
                                                <span className="text-gray-500 block">Method</span>
                                                <span className="font-medium capitalize">{req.method}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 block">Transaction ID</span>
                                                <span className="font-mono font-medium">{req.transactionId}</span>
                                            </div>
                                            {req.type === 'subscription' && (
                                                <div>
                                                    <span className="text-gray-500 block">Amount</span>
                                                    <span className="font-medium text-[#6366F1]">৳{req.amount}</span>
                                                </div>
                                            )}
                                            {req.type === 'refund' && (
                                                <div>
                                                    <span className="text-gray-500 block">Refund Number</span>
                                                    <span className="font-medium">{req.refundNumber}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        {req.type === 'subscription' ? (
                                            <>
                                                <button
                                                    onClick={() => handleApprove(req.userId, req._id, req.amount > 500 ? 'PRO_LIFETIME' : 'PRO_MONTHLY')}
                                                    className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-1 text-sm font-medium"
                                                >
                                                    <Check className="w-4 h-4" />
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleReject(req.userId, req._id)}
                                                    className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-1 text-sm font-medium"
                                                >
                                                    <X className="w-4 h-4" />
                                                    Reject
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => handleRefund(req.userId, req._id)}
                                                className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-1 text-sm font-medium"
                                            >
                                                <Check className="w-4 h-4" />
                                                Confirm Refund
                                            </button>
                                        )}
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
