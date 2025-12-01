import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import adminService from '../../services/adminService';

interface PricingSectionProps {
    onStartFree: () => void;
}

export function PricingSection({ onStartFree }: PricingSectionProps) {
    const [proPrice, setProPrice] = useState(19);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const settings = await adminService.getSettings();
            if (settings && settings.proPrice) {
                setProPrice(settings.proPrice);
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    };

    return (
        <section id="pricing" className="py-24 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="text-[#6366F1] dark:text-[#8B5CF6] font-semibold mb-2 block">SIMPLE PRICING</span>
                    <h2 className="gradient-text mb-4">Start Healing Today</h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Choose the plan that works for you. Cancel anytime.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {[
                        {
                            name: 'Free',
                            price: '$0',
                            period: 'forever',
                            desc: 'Try before you commit',
                            features: [
                                '3 AI chat messages/day',
                                'Basic mood tracking',
                                'Limited community access',
                                '5 journal entries'
                            ],
                            cta: 'Start Free',
                            popular: false
                        },
                        {
                            name: 'Pro',
                            price: `$${proPrice}`,
                            period: 'per month',
                            desc: 'Full healing toolkit',
                            features: [
                                'Unlimited AI support',
                                'All recovery programs',
                                'Advanced mood analytics',
                                'Full community access',
                                'Unlimited journaling',
                                'Priority support'
                            ],
                            cta: 'Start 7-Day Free Trial',
                            popular: true
                        },
                        {
                            name: 'Lifetime',
                            price: '$199',
                            period: 'one-time',
                            desc: 'Lifetime access',
                            features: [
                                'Everything in Pro',
                                'Lifetime updates',
                                'Exclusive workshops',
                                'Personal coach sessions',
                                'Early feature access'
                            ],
                            cta: 'Get Lifetime Access',
                            popular: false
                        }
                    ].map((plan, i) => (
                        <div key={i} className={`relative card-3d rounded-3xl p-8 ${plan.popular ? 'scale-105 shadow-2xl' : ''}`}>
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <span className="inline-block px-4 py-1 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white text-sm font-semibold rounded-full shadow-lg">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <div className="text-center mb-6">
                                <h4 className="text-gray-900 dark:text-white mb-2">{plan.name}</h4>
                                <div className="mb-2">
                                    <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                                    <span className="text-gray-500 dark:text-gray-400 ml-2">/{plan.period}</span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{plan.desc}</p>
                            </div>

                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, j) => (
                                    <li key={j} className="flex items-start gap-3">
                                        <Check className="w-5 h-5 text-[#6366F1] flex-shrink-0 mt-0.5" />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={onStartFree}
                                className={`w-full py-3 rounded-full font-semibold transition-all ${plan.popular
                                    ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white hover:shadow-lg hover:scale-105'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {plan.cta}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
