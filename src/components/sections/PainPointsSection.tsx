import { Brain, MessageCircle, TrendingUp, Heart } from 'lucide-react';
import { PremiumIcon } from '../PremiumIcon';

export function PainPointsSection() {
    return (
        <section id="pain-points" className="py-24 bg-white dark:bg-gray-900">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="gradient-text mb-4">You're Not Alone in This Pain</h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Heartbreak isn't just sadness—it's a cycle of thoughts, feelings, and behaviors that keep you stuck.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        {
                            Icon: Brain,
                            title: 'Obsessive Thoughts',
                            desc: 'Can\'t stop thinking about them all day long',
                            gradient: 'from-[#6366F1] to-[#8B5CF6]'
                        },
                        {
                            Icon: MessageCircle,
                            title: 'Urge to Contact',
                            desc: 'Constantly fighting the impulse to text them',
                            gradient: 'from-[#8B5CF6] to-[#FB7185]'
                        },
                        {
                            Icon: TrendingUp,
                            title: 'Emotional Rollercoaster',
                            desc: 'Fine one moment, devastated the next',
                            gradient: 'from-[#FB7185] to-[#F472B6]'
                        },
                        {
                            Icon: Heart,
                            title: 'Lost Motivation',
                            desc: 'Everything feels meaningless without them',
                            gradient: 'from-[#6366F1] to-[#8B5CF6]'
                        }
                    ].map((pain, i) => (
                        <div key={i} className="card-3d p-8 rounded-2xl text-center group">
                            <div className="flex justify-center mb-6">
                                <PremiumIcon
                                    Icon={pain.Icon}
                                    size="lg"
                                    variant="3d"
                                    gradient={pain.gradient}
                                />
                            </div>
                            <h5 className="text-gray-900 dark:text-white mb-3 font-semibold">{pain.title}</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{pain.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <div className="inline-block card-3d px-8 py-6 rounded-2xl">
                        <p className="text-xl text-gray-900 dark:text-white font-semibold">
                            You're not weak. You're experiencing emotional withdrawal—and it can be healed.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
