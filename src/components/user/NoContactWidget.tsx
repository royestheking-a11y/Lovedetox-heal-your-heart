import { Shield, ArrowRight } from 'lucide-react';
import { PremiumIcon } from '../PremiumIcon';

interface NoContactWidgetProps {
    days: number;
    onNavigate: () => void;
}

export function NoContactWidget({ days, onNavigate }: NoContactWidgetProps) {
    // Milestones logic (duplicated for widget display)
    const milestones = [1, 3, 7, 14, 30, 60, 90, 180];
    const nextMilestone = milestones.find(m => m > days) || milestones[milestones.length - 1];
    const progress = Math.min(100, (days / nextMilestone) * 100);

    return (
        <button
            onClick={onNavigate}
            className="card-3d p-6 rounded-2xl text-left group cursor-pointer relative overflow-hidden w-full"
        >
            <div className="flex items-start justify-between mb-4">
                <PremiumIcon Icon={Shield} size="sm" variant="3d" gradient="from-[#6366F1] to-[#8B5CF6]" />
                <span className="text-xs text-white bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] px-2 py-1 rounded-full font-medium shadow-sm">
                    Active Streak
                </span>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{days}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Days Strong</div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2 mb-4">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Progress to {nextMilestone} days</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] transition-all duration-1000"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <span className="text-xs text-[#6366F1] dark:text-[#8B5CF6] font-medium">View Journey</span>
                <ArrowRight className="w-4 h-4 text-[#6366F1] dark:text-[#8B5CF6] group-hover:translate-x-1 transition-transform" />
            </div>
        </button>
    );
}
