import { useState, useEffect } from 'react';
import { DollarSign, Calendar as CalendarIcon, TrendingUp, ChevronLeft, ChevronRight, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
        <div className="flex items-center justify-center h-96">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <div className="mt-4 text-indigo-600 font-medium">Loading Analytics...</div>
            </div>
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

    // Prepare chart data (last 7 days or current month trend)
    const chartData = Object.keys(stats.daily)
        .sort()
        .slice(-30) // Last 30 days
        .map(date => ({
            date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            amount: stats.daily[date]
        }));

    const StatCard = ({ title, amount, icon: Icon, gradient, trend }: any) => (
        <div className={`relative overflow-hidden rounded-3xl p-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] group`}>
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110`} />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                    {trend && (
                        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-900/50">
                            <TrendingUp className="w-3 h-3 text-green-600 dark:text-green-400" />
                            <span className="text-xs font-bold text-green-600 dark:text-green-400">+12.5%</span>
                        </div>
                    )}
                </div>

                <div className="space-y-1">
                    <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                        ৳{amount.toLocaleString()}
                    </h3>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                        Revenue Analytics
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Financial overview and performance metrics</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border border-gray-100 dark:border-gray-700">
                    <Activity className="w-4 h-4 text-indigo-500" />
                    Last updated: {new Date().toLocaleTimeString()}
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Today's Revenue"
                    amount={todayRevenue}
                    icon={DollarSign}
                    gradient="from-emerald-400 to-emerald-600"
                    trend={true}
                />
                <StatCard
                    title="Monthly Revenue"
                    amount={monthRevenue}
                    icon={CalendarIcon}
                    gradient="from-blue-400 to-blue-600"
                    trend={true}
                />
                <StatCard
                    title="Yearly Revenue"
                    amount={yearRevenue}
                    icon={TrendingUp}
                    gradient="from-violet-400 to-violet-600"
                    trend={true}
                />
                <StatCard
                    title="Total Revenue"
                    amount={stats.total}
                    icon={DollarSign}
                    gradient="from-indigo-400 to-indigo-600"
                />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 md:p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Revenue Trend</h3>
                            <p className="text-sm text-gray-500">Last 30 days performance</p>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6B7280', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6B7280', fontSize: 12 }}
                                    tickFormatter={(value) => `৳${value}`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="#6366F1"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Calendar View */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-gray-900 dark:text-white">Calendar</h3>
                            <div className="flex items-center gap-2 bg-white dark:bg-gray-700 p-1 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600">
                                <button onClick={() => changeMonth(-1)} className="p-1.5 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg transition-colors">
                                    <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                </button>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white w-24 text-center select-none">
                                    {monthName} {year}
                                </span>
                                <button onClick={() => changeMonth(1)} className="p-1.5 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg transition-colors">
                                    <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 flex-1">
                        <div className="grid grid-cols-7 gap-2 mb-4">
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                <div key={day} className="text-center text-xs font-bold text-gray-400 uppercase">
                                    {day}
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-2">
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
                                            aspect-square rounded-xl flex flex-col items-center justify-center relative group transition-all duration-300 cursor-default
                                            ${isToday
                                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-110 z-10'
                                                : hasRevenue
                                                    ? revenue > 0
                                                        ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/50'
                                                        : 'bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50'
                                                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-400'
                                            }
                                        `}
                                    >
                                        <span className={`text-xs font-medium ${isToday ? 'text-white' : ''}`}>
                                            {day}
                                        </span>

                                        {hasRevenue && (
                                            <div className={`mt-0.5 w-1.5 h-1.5 rounded-full ${isToday ? 'bg-white' : revenue > 0 ? 'bg-emerald-500' : 'bg-red-500'
                                                }`} />
                                        )}

                                        {/* Tooltip */}
                                        {hasRevenue && (
                                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20 shadow-xl">
                                                {revenue > 0 ? '+' : '-'}৳{Math.abs(revenue)}
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
