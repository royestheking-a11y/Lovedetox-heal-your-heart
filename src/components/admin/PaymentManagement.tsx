import { useState, useEffect } from 'react';
import { Check, X, CreditCard, RefreshCcw, Trash2, History } from 'lucide-react';
import { toast } from 'sonner';
import paymentService from '../../services/paymentService';

export function PaymentManagement() {
    const [activeTab, setActiveTab] = useState<'requests' | 'history'>('requests');
    const [requests, setRequests] = useState<any[]>([]);
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (activeTab === 'requests') {
            loadRequests();
        } else {
            loadHistory();
        }
    }, [activeTab]);

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

    const loadHistory = async () => {
        setLoading(true);
        try {
            const data = await paymentService.getPaymentHistory();
            setHistory(data);
        } catch (error) {
            console.error('Error loading history:', error);
            toast.error('Failed to load payment history');
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

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this payment record?')) return;
        try {
            await paymentService.deletePayment(id);
            toast.success('Payment record deleted');
            loadHistory();
        } catch (error) {
            toast.error('Failed to delete payment');
        }
    };

    const handleClearAll = async () => {
        if (!confirm('WARNING: This will delete ALL payment history. This action cannot be undone. Are you sure?')) return;
        try {
            await paymentService.clearAllPayments();
            toast.success('All payment history cleared');
            loadHistory();
        } catch (error) {
            toast.error('Failed to clear history');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Management</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Manage subscriptions, refunds, and history</p>
                </div>
                <div className="flex gap-2">
                    {activeTab === 'history' && (
                        <button
                            onClick={handleClearAll}
                            className="px-4 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Clear All
                        </button>
                    )}
                    <button
                        onClick={activeTab === 'requests' ? loadRequests : loadHistory}
                        className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        <RefreshCcw className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => setActiveTab('requests')}
                    className={`pb-3 px-1 font-medium text-sm transition-colors relative ${activeTab === 'requests'
                        ? 'text-[#6366F1]'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                        }`}
                >
                    Payment Requests
                    {activeTab === 'requests' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#6366F1] rounded-t-full" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`pb-3 px-1 font-medium text-sm transition-colors relative ${activeTab === 'history'
                        ? 'text-[#6366F1]'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                        }`}
                >
                    Transaction History
                    {activeTab === 'history' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#6366F1] rounded-t-full" />
                    )}
                </button>
            </div>

            {activeTab === 'requests' ? (
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
                                                    <span className="text-gray-500 block">Amount</span>
                                                    <span className="font-medium text-[#6366F1]">৳{req.amount}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 block">Method</span>
                                                    <span className="font-medium text-gray-900 dark:text-white uppercase">{req.method}</span>
                                                </div>
                                                <div className="col-span-2">
                                                    <span className="text-gray-500 block">Transaction ID</span>
                                                    <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs font-mono">
                                                        {req.transactionId || req.refundNumber}
                                                    </code>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            {req.type === 'subscription' ? (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(req.userId, req._id, req.planType)}
                                                        className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                                                        title="Approve"
                                                    >
                                                        <Check className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(req.userId, req._id)}
                                                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                                        title="Reject"
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => handleRefund(req.userId, req._id)}
                                                    className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                                                >
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
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    {history.length === 0 ? (
                        <div className="p-12 text-center">
                            <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No payment history found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Date</th>
                                        <th className="px-6 py-4 font-medium">User</th>
                                        <th className="px-6 py-4 font-medium">Amount</th>
                                        <th className="px-6 py-4 font-medium">Method</th>
                                        <th className="px-6 py-4 font-medium">Status</th>
                                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {history.map((item) => (
                                        <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                                            <td className="px-6 py-4 text-gray-500">
                                                {new Date(item.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900 dark:text-white">{item.userName}</div>
                                                <div className="text-xs text-gray-500">{item.userEmail}</div>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                                ৳{item.amount}
                                            </td>
                                            <td className="px-6 py-4 uppercase text-gray-500">
                                                {item.method}
                                                <div className="text-xs font-mono text-gray-400">{item.transactionId}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${item.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                    item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        item.status === 'failed' ? 'bg-red-100 text-red-700' :
                                                            'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleDelete(item._id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete Record"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
