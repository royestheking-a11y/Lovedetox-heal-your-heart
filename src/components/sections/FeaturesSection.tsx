import { MessageCircle, CheckCircle, TrendingUp, BookOpen, Shield, Users } from 'lucide-react';
import { PremiumIcon } from '../PremiumIcon';

export function FeaturesSection() {
    return (
        <section id="features" className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="text-[#6366F1] dark:text-[#8B5CF6] font-semibold mb-2 block">POWERFUL FEATURES</span>
                    <h2 className="gradient-text mb-4">Everything You Need to Heal</h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        A comprehensive toolkit designed by therapists and powered by AI.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        {
                            Icon: MessageCircle,
                            title: 'AI Emotional Support',
                            desc: '24/7 AI companion trained in emotional healing',
                            gradient: 'from-[#6366F1] to-[#8B5CF6]'
                        },
                        {
                            Icon: CheckCircle,
                            title: 'Daily Recovery Tasks',
                            desc: 'Science-backed exercises to rebuild strength',
                            gradient: 'from-[#8B5CF6] to-[#FB7185]'
                        },
                        {
                            Icon: TrendingUp,
                            title: 'Mood Tracking',
                            desc: 'Visual analytics showing your progress',
                            gradient: 'from-[#FB7185] to-[#F472B6]'
                        },
                        {
                            Icon: BookOpen,
                            title: 'Private Journal',
                            desc: 'Encrypted space to process emotions',
                            gradient: 'from-[#6366F1] to-[#8B5CF6]'
                        },
                        {
                            Icon: Shield,
                            title: 'No-Contact Guard',
                            desc: 'Stay accountable and track progress',
                            gradient: 'from-[#8B5CF6] to-[#FB7185]'
                        },
                        {
                            Icon: Users,
                            title: 'Healing Community',
                            desc: 'Connect with others on the same journey',
                            gradient: 'from-[#FB7185] to-[#F472B6]'
                        }
                    ].map((feature, i) => (
                        <div key={i} className="card-3d p-8 rounded-2xl group">
                            <div className="mb-6">
                                <PremiumIcon
                                    Icon={feature.Icon}
                                    size="lg"
                                    variant="3d"
                                    gradient={feature.gradient}
                                />
                            </div>
                            <h4 className="text-gray-900 dark:text-white mb-3 font-semibold">{feature.title}</h4>
                            <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
