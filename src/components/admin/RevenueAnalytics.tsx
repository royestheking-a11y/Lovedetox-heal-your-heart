import { useState, useEffect } from 'react';
import { DollarSign, Calendar as CalendarIcon, TrendingUp, TrendingDown, ChevronLeft, ChevronRight } from 'lucide-react';
import adminService from '../../services/adminService';
import { toast } from 'sonner';

export function RevenueAnalytics() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date()); // For calendar navigation

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const data = await adminService.getRevenueStats();
            setStats(data);
        } catch (error) {
            console.error('Error loading revenue stats:', error);
            toast.error('Failed to load revenue analytics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading analytics...</div>;
    if (!stats) return <div className="p-8 text-center">No data available</div>;

    // Helper to get days in month
    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    // Helper to get first day of month (0-6)
    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();
    const currentMonthKey = currentDate.toISOString().slice(0, 7); // YYYY-MM

    // Calculate stats for current view
    const todayKey = new Date().toISOString().split('T')[0];
    const todayRevenue = stats.daily[todayKey] || 0;
    const monthRevenue = stats.monthly[currentMonthKey] || 0;
    const yearRevenue = stats.yearly[year.toString()] || 0;

    const changeMonth = (offset: number) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + offset);
        setCurrentDate(newDate);
    };

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                            <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="text-xs font-medium px-2 py-1 bg-green-50 text-green-700 rounded-lg">Today</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">৳{todayRevenue.toLocaleString()}</h3>
                    <p className="text-sm text-gray-500 mt-1">Daily Revenue</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                            <CalendarIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-700 rounded-lg">This Month</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">৳{monthRevenue.toLocaleString()}</h3>
                    <p className="text-sm text-gray-500 mt-1">Monthly Revenue</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                            <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <span className="text-xs font-medium px-2 py-1 bg-purple-50 text-purple-700 rounded-lg">This Year</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">৳{yearRevenue.toLocaleString()}</h3>
                    <p className="text-sm text-gray-500 mt-1">Yearly Revenue</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                            <DollarSign className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <span className="text-xs font-medium px-2 py-1 bg-indigo-50 text-indigo-700 rounded-lg">Total</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">৳{stats.total.toLocaleString()}</h3>
                    <p className="text-sm text-gray-500 mt-1">All Time Revenue</p>
                </div>
            </div>

            {/* Calendar View */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Revenue Calendar</h3>
                    <div className="flex items-center gap-4">
                        <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="font-semibold text-gray-900 dark:text-white w-32 text-center">
                            {monthName} {year}
                        </span>
                        <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-7 gap-4 mb-4">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-center text-sm font-medium text-gray-500">
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-4">
                        {Array.from({ length: firstDay }).map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square" />
                        ))}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const dateStr = `${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                            const revenue = stats.daily[dateStr] || 0;
                            const isToday = dateStr === todayKey;

                            return (
                                <div
                                    key={day}
                                    className={`aspect-square rounded-xl border p-2 flex flex-col items-center justify-center transition-all ${isToday ? 'ring-2 ring-[#6366F1] border-transparent' : 'border-gray-200 dark:border-gray-700'
                                        } ${revenue > 0 ? 'bg-green-50 dark:bg-green-900/10' : 'bg-gray-50 dark:bg-gray-800/50'}`}
                                >
                                    <span className={`text-sm font-medium mb-1 ${isToday ? 'text-[#6366F1]' : 'text-gray-700 dark:text-gray-300'}`}>
                                        {day}
                                    </span>
                                    {revenue !== 0 && (
                                        <span className={`text-xs font-bold ${revenue > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                            ৳{revenue.toLocaleString()}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
