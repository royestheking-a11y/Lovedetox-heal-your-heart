import { useState, useEffect } from 'react';
import { Check, X, Trash2, ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';
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

    const getRefundAmount = (user: any) => {
        // Find last approved subscription payment
        if (!user.paymentHistory || user.paymentHistory.length === 0) return 0;
        const lastPayment = [...user.paymentHistory].reverse().find((p: any) => p.status === 'approved' && p.type === 'subscription');
        return lastPayment ? lastPayment.amount : 0;
    };

    return (
        <div className="space-y-6">
            {/* Header & Tabs */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Management</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Manage transactions, requests, and cancellations</p>
                </div>
                <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('requests')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'requests'
                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                    >
                        Requests
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'history'
                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                    >
                        History
                    </button>
                    <button
                        onClick={() => setActiveTab('cancellations')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'cancellations'
                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                    >
                        Cancellations
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                {activeTab === 'requests' && (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User Details</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan & Amount</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment Info</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {loading ? (
                                    <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading...</td></tr>
                                ) : requests.length === 0 ? (
                                    <tr><td colSpan={5} className="p-12 text-center text-gray-500">No pending requests</td></tr>
                                ) : (
                                    requests.map((req) => (
                                        <tr key={req._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                                                        {req.userName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900 dark:text-white">{req.userName}</div>
                                                        <div className="text-xs text-gray-500">{req.userEmail}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {req.planType === 'PRO_LIFETIME' ? 'Lifetime Access' : 'Monthly Plan'}
                                                    </span>
                                                    <span className="text-xs text-gray-500">৳{req.amount}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium capitalize text-gray-900 dark:text-white">{req.method}</span>
                                                    <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded w-fit mt-1">
                                                        {req.transactionId}
                                                    </code>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(req.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleApprove(req.userId, req._id, req.planType)}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                        title="Approve"
                                                    >
                                                        <Check className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(req.userId, req._id)}
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
                )}

                {activeTab === 'history' && (
                    <>
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-end">
                            <button
                                onClick={handleClearAll}
                                className="flex items-center gap-2 px-3 py-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-sm font-medium transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                                Clear History
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Transaction</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Details</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {loading ? (
                                        <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading...</td></tr>
                                    ) : history.length === 0 ? (
                                        <tr><td colSpan={5} className="p-12 text-center text-gray-500">No history found</td></tr>
                                    ) : (
                                        history.map((record) => (
                                            <tr key={record._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-lg ${record.isRefund
                                                            ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                                            : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                                                            }`}>
                                                            {record.isRefund ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-gray-900 dark:text-white">
                                                                {record.isRefund ? '-' : '+'}৳{record.amount}
                                                            </div>
                                                            <div className="text-xs text-gray-500">{new Date(record.date).toLocaleDateString()}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-gray-900 dark:text-white">{record.userName}</div>
                                                    <div className="text-xs text-gray-500">{record.userEmail}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 w-fit">
                                                            {record.plan === 'Refund' ? 'Refund' : (record.planType === 'PRO_LIFETIME' ? 'Lifetime' : 'Monthly')}
                                                        </span>
                                                        <span className="text-xs text-gray-500 capitalize">{record.method} • {record.transactionId}</span>
                                                    </div>
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
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => handleDelete(record._id)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {activeTab === 'cancellations' && (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User & Plan</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Refund Details</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Reason</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Requested</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {loading ? (
                                    <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading...</td></tr>
                                ) : cancellations.length === 0 ? (
                                    <tr><td colSpan={5} className="p-12 text-center text-gray-500">No pending cancellations</td></tr>
                                ) : (
                                    cancellations.map((user) => {
                                        const refundAmount = getRefundAmount(user);
                                        return (
                                            <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 font-bold">
                                                            {user.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                                                            <div className="text-xs text-gray-500">{user.email}</div>
                                                            <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                                                                {user.plan}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                                                            Refund: ৳{refundAmount}
                                                        </span>
                                                        <div className="text-xs text-gray-500">
                                                            <span className="capitalize">{user.cancellationRequest.paymentMethod || 'Unknown Method'}</span>
                                                            <span className="mx-1">•</span>
                                                            <span className="font-mono">{user.cancellationRequest.accountNumber || 'No Account #'}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="max-w-xs">
                                                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2" title={user.cancellationRequest.reason}>
                                                            {user.cancellationRequest.reason || 'No reason provided'}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {user.cancellationRequest.requestedAt ? new Date(user.cancellationRequest.requestedAt).toLocaleDateString() : 'N/A'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => handleApproveCancellation(user._id)}
                                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium shadow-sm transition-all hover:shadow-md"
                                                    >
                                                        Approve Refund
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
