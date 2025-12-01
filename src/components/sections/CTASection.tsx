interface CTASectionProps {
    onStartFree: () => void;
    onTalkToAI: () => void;
}

export function CTASection({ onStartFree, onTalkToAI }: CTASectionProps) {
    return (
        <section className="py-24 bg-gradient-to-br from-[#6366F1] via-[#8B5CF6] to-[#FB7185] relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                <h2 className="text-white mb-6">Ready to Start Your Healing Journey?</h2>
                <p className="text-white/90 text-xl mb-12 max-w-2xl mx-auto">
                    Join 10,000+ people who chose to heal, grow, and become the best version of themselves.
                </p>

                <div className="flex gap-4 justify-center flex-wrap">
                    <button onClick={onStartFree} className="px-8 py-4 bg-white text-[#6366F1] rounded-full font-semibold transition-all hover:scale-105 hover:shadow-2xl ripple">
                        Start Your 7-Day Free Trial
                    </button>
                    <button onClick={onTalkToAI} className="px-8 py-4 bg-white/10 text-white border-2 border-white/50 rounded-full font-semibold backdrop-blur-sm transition-all hover:bg-white/20 ripple">
                        Try AI Chat Free
                    </button>
                </div>

                <p className="text-white/70 text-sm mt-8">
                    No credit card required • Cancel anytime • 100% secure
                </p>
            </div>
        </section>
    );
}
