import { useState, useEffect } from 'react';
import { DollarSign, Calendar as CalendarIcon, TrendingUp, ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import adminService from '../../services/adminService';
import { toast } from 'sonner';

export function RevenueAnalytics() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());

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

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
    );

    if (!stats) return <div className="p-8 text-center text-gray-500">No data available</div>;

    const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();
    const currentMonthKey = currentDate.toISOString().slice(0, 7);

    const todayKey = new Date().toISOString().split('T')[0];
    const todayRevenue = stats.daily[todayKey] || 0;
    const monthRevenue = stats.monthly[currentMonthKey] || 0;
    const yearRevenue = stats.yearly[year.toString()] || 0;

    const changeMonth = (offset: number) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + offset);
        setCurrentDate(newDate);
    };

    const StatCard = ({ title, amount, icon: Icon, color, trend }: any) => (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`} />
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 bg-${color}-100 dark:bg-${color}-900/30 rounded-xl`}>
                        <Icon className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`} />
                    </div>
                    {trend && (
                        <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 bg-green-50 text-green-700 rounded-lg">
                            <TrendingUp className="w-3 h-3" />
                            +12%
                        </span>
                    )}
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">৳{amount.toLocaleString()}</h3>
                <p className="text-sm text-gray-500 mt-1">{title}</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Revenue Analytics</h2>
                <p className="text-gray-500 dark:text-gray-400">Track your earnings and financial growth</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Today's Revenue" amount={todayRevenue} icon={DollarSign} color="green" />
                <StatCard title="Monthly Revenue" amount={monthRevenue} icon={CalendarIcon} color="blue" />
                <StatCard title="Yearly Revenue" amount={yearRevenue} icon={TrendingUp} color="purple" />
                <StatCard title="Total Revenue" amount={stats.total} icon={DollarSign} color="indigo" />
            </div>

            {/* Calendar View */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-8 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Revenue Calendar</h3>
                        <p className="text-sm text-gray-500">Daily breakdown for {monthName} {year}</p>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900/50 p-1 rounded-xl">
                        <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg shadow-sm transition-all text-gray-600 dark:text-gray-300">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="font-semibold text-gray-900 dark:text-white w-32 text-center select-none">
                            {monthName} {year}
                        </span>
                        <button onClick={() => changeMonth(1)} className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg shadow-sm transition-all text-gray-600 dark:text-gray-300">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="p-8">
                    <div className="grid grid-cols-7 gap-4 mb-4">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-center text-sm font-semibold text-gray-400 uppercase tracking-wider">
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
                            const hasRevenue = revenue !== 0;

                            return (
                                <div
                                    key={day}
                                    className={`
                                        aspect-square rounded-2xl border flex flex-col items-center justify-center relative group transition-all duration-300
                                        ${isToday
                                            ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-gray-800 border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                                            : hasRevenue
                                                ? revenue > 0
                                                    ? 'border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-green-900/10 hover:shadow-md hover:-translate-y-1'
                                                    : 'border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-900/10'
                                                : 'border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                                        }
                                    `}
                                >
                                    <span className={`text-sm font-medium mb-1 ${isToday ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'}`}>
                                        {day}
                                    </span>
                                    {hasRevenue && (
                                        <div className={`flex items-center gap-0.5 text-xs font-bold ${revenue > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                                            {revenue > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownLeft className="w-3 h-3" />}
                                            <span>৳{Math.abs(revenue).toLocaleString()}</span>
                                        </div>
                                    )}

                                    {/* Tooltip-like detail on hover */}
                                    {hasRevenue && (
                                        <div className="absolute inset-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                                            <span className="text-xs font-bold text-gray-900 dark:text-white">
                                                {revenue > 0 ? '+' : '-'}৳{Math.abs(revenue)}
                                            </span>
                                        </div>
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
