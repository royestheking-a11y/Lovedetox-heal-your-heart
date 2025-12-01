import { Sparkles, ArrowRight, ChevronDown } from 'lucide-react';

interface HeroSectionProps {
    onStartFree: () => void;
    onTalkToAI: () => void;
    onScrollToPainPoints: () => void;
}

export function HeroSection({ onStartFree, onTalkToAI, onScrollToPainPoints }: HeroSectionProps) {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            <div className="absolute inset-0 bg-gradient-to-br from-[#6366F1] via-[#8B5CF6] to-[#FB7185] dark:from-[#4F46E5] dark:via-[#7C3AED] dark:to-[#EC4899]" />
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-sm mb-8 animate-bounce-subtle">
                    <Sparkles className="w-4 h-4" />
                    <span>Trusted by 10,000+ people healing from heartbreak</span>
                </div>

                <h1 className="text-white mb-6 max-w-4xl mx-auto animate-in slide-in-from-bottom duration-700">
                    Heal Your Heart, Reclaim Your Life
                </h1>

                <p className="text-white/90 text-xl max-w-2xl mx-auto mb-12 animate-in slide-in-from-bottom duration-700" style={{ animationDelay: '100ms' }}>
                    Break free from emotional attachment with AI-powered support, evidence-based recovery tasks, and a caring community.
                </p>

                <div className="flex gap-4 justify-center flex-wrap mb-16 animate-in slide-in-from-bottom duration-700" style={{ animationDelay: '200ms' }}>
                    <button onClick={onStartFree} className="px-8 py-4 bg-white text-[#6366F1] rounded-full font-semibold transition-all hover:scale-105 hover:shadow-2xl flex items-center gap-2 ripple">
                        Start Your Free Journey
                        <ArrowRight className="w-5 h-5" />
                    </button>
                    <button onClick={onTalkToAI} className="px-8 py-4 bg-white/10 text-white border-2 border-white/50 rounded-full font-semibold backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-105 ripple">
                        Try AI Chat Free
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto animate-in slide-in-from-bottom duration-700" style={{ animationDelay: '300ms' }}>
                    {[
                        { label: 'Recovery Rate', value: '94%' },
                        { label: 'Active Users', value: '10K+' },
                        { label: 'Avg Days to Healing', value: '30' },
                        { label: 'Success Stories', value: '5K+' }
                    ].map((stat, i) => (
                        <div key={i} className="glass-dark rounded-2xl p-6 card-hover">
                            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                            <div className="text-white/70 text-sm">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            <button
                onClick={onScrollToPainPoints}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
            >
                <ChevronDown className="w-8 h-8 text-white" />
            </button>
        </section>
    );
}
