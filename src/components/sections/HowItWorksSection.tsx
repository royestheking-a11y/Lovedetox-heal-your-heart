import { Target, CheckCircle, TrendingUp, Sparkles } from 'lucide-react';
import { PremiumIcon } from '../PremiumIcon';

export function HowItWorksSection() {
    return (
        <section id="how-it-works" className="py-24 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="text-[#6366F1] dark:text-[#8B5CF6] font-semibold mb-2 block">THE PROCESS</span>
                    <h2 className="gradient-text mb-4">Your Path to Healing</h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        A structured, proven approach to emotional recovery in just 30 days.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        {
                            step: '01',
                            Icon: Target,
                            title: 'Start Assessment',
                            desc: 'Take our 5-minute assessment to understand your emotional state',
                            gradient: 'from-[#6366F1] to-[#8B5CF6]'
                        },
                        {
                            step: '02',
                            Icon: CheckCircle,
                            title: 'Daily Actions',
                            desc: 'Complete bite-sized healing tasks each day',
                            gradient: 'from-[#8B5CF6] to-[#FB7185]'
                        },
                        {
                            step: '03',
                            Icon: TrendingUp,
                            title: 'Track Progress',
                            desc: 'Monitor mood patterns and celebrate milestones',
                            gradient: 'from-[#FB7185] to-[#F472B6]'
                        },
                        {
                            step: '04',
                            Icon: Sparkles,
                            title: 'Emerge Stronger',
                            desc: 'Complete the program with emotional resilience',
                            gradient: 'from-[#6366F1] to-[#8B5CF6]'
                        }
                    ].map((item, i) => (
                        <div key={i} className="relative">
                            <div className="card-3d p-8 rounded-2xl text-center group">
                                <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6366F1] to-[#FB7185] mb-6 opacity-20">
                                    {item.step}
                                </div>
                                <div className="flex justify-center mb-6">
                                    <PremiumIcon
                                        Icon={item.Icon}
                                        size="lg"
                                        variant="3d"
                                        gradient={item.gradient}
                                        animate={true}
                                    />
                                </div>
                                <h4 className="text-gray-900 dark:text-white mb-3 font-semibold">{item.title}</h4>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">{item.desc}</p>
                            </div>
                            {i < 3 && (
                                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
