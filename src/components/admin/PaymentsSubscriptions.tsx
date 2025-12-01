import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp } from 'lucide-react';
import adminService from '../../services/adminService';

export function PaymentsSubscriptions() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    proUsers: 0,
    transactions: [] as any[]
  });

  useEffect(() => {
    const loadPayments = async () => {
      try {
        const payments = await adminService.getPayments();

        // Calculate stats from payments
        const totalRevenue = payments.reduce((acc: number, curr: any) => acc + curr.amount, 0);

        // Monthly revenue (this month)
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const monthlyPayments = payments.filter((p: any) => new Date(p.date) >= startOfMonth);
        const monthlyRevenue = monthlyPayments.reduce((acc: number, curr: any) => acc + curr.amount, 0);

        // Unique pro users count from payments or fetch users? 
        // For now, let's assume unique userIds in payments represents pro users if we only log pro payments.
        // Better to use the stats from dashboard for pro users count, but here we can just count unique userIds in payments.
        const uniqueProUsers = new Set(payments.map((p: any) => p.userId)).size;

        setStats({
          totalRevenue,
          monthlyRevenue,
          proUsers: uniqueProUsers,
          transactions: payments.map((p: any) => ({
            id: p._id,
            userName: p.userName,
            userEmail: p.userEmail, // Add email
            amount: p.amount,
            date: p.date,
            status: p.status
          }))
        });
      } catch (error) {
        console.error('Error loading payments:', error);
      }
    };

    loadPayments();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="gradient-text mb-2">Revenue & Subscriptions</h2>
        <p className="text-gray-600">Track payments and manage subscriptions</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border-2 border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-8 h-8 text-green-600" />
            <h4 className="text-gray-600">MRR</h4>
          </div>
          <div className="text-3xl gradient-text">${stats.monthlyRevenue}</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border-2 border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <h4 className="text-gray-600">Total Revenue</h4>
          </div>
          <div className="text-3xl gradient-text">${stats.totalRevenue}</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border-2 border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-8 h-8 text-purple-600" />
            <h4 className="text-gray-600">Pro Users</h4>
          </div>
          <div className="text-3xl gradient-text">{stats.proUsers}</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h4 className="text-[#4B0082]">Recent Transactions</h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm text-gray-600">User</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">Amount</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">Date</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats.transactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    No transactions yet
                  </td>
                </tr>
              ) : (
                stats.transactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white font-bold text-sm">
                          {tx.userName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">{tx.userName}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{tx.userEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">${tx.amount}</td>
                    <td className="px-6 py-4">{new Date(tx.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
