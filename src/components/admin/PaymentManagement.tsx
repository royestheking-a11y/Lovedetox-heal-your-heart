import { useState, useEffect } from 'react';
import { Check, X, CreditCard, RefreshCcw, Trash2, History, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import paymentService from '../../services/paymentService';
import adminService from '../../services/adminService';

export function PaymentManagement() {
    const [activeTab, setActiveTab] = useState<'requests' | 'history' | 'cancellations'>('requests');
    const [requests, setRequests] = useState<any[]>([]);
    const [history, setHistory] = useState<any[]>([]);
    const [cancellations, setCancellations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (activeTab === 'requests') {
            loadRequests();
        } else if (activeTab === 'history') {
            loadHistory();
        } else {
            loadCancellations();
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

    const loadCancellations = async () => {
        setLoading(true);
        try {
            const users = await adminService.getUsers();
            const pendingCancellations = users.filter((u: any) => u.cancellationRequest?.status === 'pending');
            setCancellations(pendingCancellations);
        } catch (error) {
            console.error('Error loading cancellations:', error);
            toast.error('Failed to load cancellation requests');
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

    const handleApproveCancellation = async (userId: string) => {
        if (!confirm('Approve cancellation? This will downgrade the user and record a refund.')) return;
        try {
            await paymentService.approveCancellation(userId);
            toast.success('Cancellation approved');
            loadCancellations();
        } catch (error) {
            toast.error('Failed to approve cancellation');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => setActiveTab('requests')}
                    className={`pb-4 px-2 font-medium transition-colors relative ${activeTab === 'requests'
                        ? 'text-[#6366F1]'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                        }`}
                >
                    Payment Requests
                    {activeTab === 'requests' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6366F1]" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`pb-4 px-2 font-medium transition-colors relative ${activeTab === 'history'
                        ? 'text-[#6366F1]'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                        }`}
                >
                    Transaction History
                    {activeTab === 'history' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6366F1]" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('cancellations')}
                    className={`pb-4 px-2 font-medium transition-colors relative ${activeTab === 'cancellations'
                        ? 'text-[#6366F1]'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                        }`}
                >
                    Cancellation Requests
                    {activeTab === 'cancellations' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6366F1]" />
                    )}
                </button>
            </div>

            {activeTab === 'requests' && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">User</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Plan</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Amount</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Method</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Transaction ID</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Date</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                            Loading requests...
                                        </td>
                                    </tr>
                                ) : requests.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                            No pending payment requests
                                        </td>
                                    </tr>
                                ) : (
                                    requests.map((request) => (
                                        <tr key={request._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-white">{request.userName}</div>
                                                    <div className="text-sm text-gray-500">{request.userEmail}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                                                    {request.planType === 'PRO_LIFETIME' ? 'Lifetime' : 'Monthly'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                                                ৳{request.amount}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 capitalize">
                                                {request.method}
                                            </td>
                                            <td className="px-6 py-4 font-mono text-sm text-gray-500">
                                                {request.transactionId}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(request.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleApprove(request.userId, request._id, request.planType)}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                        title="Approve"
                                                    >
                                                        <Check className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(request.userId, request._id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Reject"
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'history' && (
                <div className="space-y-4">
                    <div className="flex justify-end">
                        <button
                            onClick={handleClearAll}
                            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm font-medium"
                        >
                            <Trash2 className="w-4 h-4" />
                            Clear All History
                        </button>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">User</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Plan</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Amount</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Method</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Transaction ID</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Date</th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                                                Loading history...
                                            </td>
                                        </tr>
                                    ) : history.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                                                No payment history found
                                            </td>
                                        </tr>
                                    ) : (
                                        history.map((record) => (
                                            <tr key={record._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <div className="font-medium text-gray-900 dark:text-white">{record.userName}</div>
                                                        <div className="text-sm text-gray-500">{record.userEmail}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${record.plan === 'Refund'
                                                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                                            : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                                                        }`}>
                                                        {record.plan === 'Refund' ? 'Refund' : (record.planType === 'PRO_LIFETIME' ? 'Lifetime' : 'Monthly')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                                                    {record.isRefund ? '-' : ''}৳{record.amount}
                                                </td>
                                                <td className="px-6 py-4 text-gray-500 capitalize">
                                                    {record.method}
                                                </td>
                                                <td className="px-6 py-4 font-mono text-sm text-gray-500">
                                                    {record.transactionId}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${record.status === 'completed'
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                            : record.status === 'refunded'
                                                                ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                                                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                                        }`}>
                                                        {record.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {new Date(record.date).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => handleDelete(record._id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete Record"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'cancellations' && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">User</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Reason</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Refund Method</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Account Number</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Requested At</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                            Loading cancellations...
                                        </td>
                                    </tr>
                                ) : cancellations.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                            No pending cancellation requests
                                        </td>
                                    </tr>
                                ) : (
                                    cancellations.map((user) => (
                                        <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate" title={user.cancellationRequest.reason}>
                                                {user.cancellationRequest.reason}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 capitalize">
                                                {user.cancellationRequest.paymentMethod}
                                            </td>
                                            <td className="px-6 py-4 font-mono text-sm text-gray-500">
                                                {user.cancellationRequest.accountNumber}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(user.cancellationRequest.requestedAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleApproveCancellation(user._id)}
                                                    className="px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50 rounded-lg text-sm font-medium transition-colors"
                                                >
                                                    Approve & Refund
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
