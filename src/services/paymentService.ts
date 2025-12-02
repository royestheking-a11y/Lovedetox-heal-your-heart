import api from './api';

const startTrial = async () => {
    const response = await api.post('/payments/start-trial');
    return response.data;
};

const submitPayment = async (data: { transactionId: string; method: string; amount: number; planType: string }) => {
    const response = await api.post('/payments/submit', data);
    return response.data;
};

const cancelSubscription = async (data: { refundNumber: string; method: string; reason: string }) => {
    const response = await api.post('/payments/cancel', data);
    return response.data;
};

// Admin functions
const getPaymentRequests = async () => {
    const response = await api.get('/payments/admin/requests');
    return response.data;
};

const approvePayment = async (data: { userId: string; paymentId: string; planType?: string }) => {
    const response = await api.post('/payments/admin/approve', data);
    return response.data;
};

const rejectPayment = async (data: { userId: string; paymentId: string }) => {
    const response = await api.post('/payments/admin/reject', data);
    return response.data;
};

const confirmRefund = async (data: { userId: string; paymentId: string }) => {
    const response = await api.post('/payments/admin/refund', data);
    return response.data;
};

const getPaymentHistory = async () => {
    const response = await api.get('/admin/payments');
    return response.data;
};

const deletePayment = async (id: string) => {
    const response = await api.delete(`/admin/payments/${id}`);
    return response.data;
};

const clearAllPayments = async () => {
    const response = await api.delete('/admin/payments/all');
    return response.data;
};

const paymentService = {
    startTrial,
    submitPayment,
    cancelSubscription,
    getPaymentRequests,
    approvePayment,
    rejectPayment,
    confirmRefund,
    getPaymentHistory,
    deletePayment,
    clearAllPayments
};

export default paymentService;
