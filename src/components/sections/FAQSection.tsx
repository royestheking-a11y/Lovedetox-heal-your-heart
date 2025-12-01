import { ChevronDown } from 'lucide-react';

export function FAQSection() {
    return (
        <section id="faq" className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="text-[#6366F1] dark:text-[#8B5CF6] font-semibold mb-2 block">FAQ</span>
                    <h2 className="gradient-text mb-4">Questions? We Have Answers</h2>
                </div>

                <div className="space-y-4">
                    {[
                        {
                            q: 'How long does it take to feel better?',
                            a: 'Most users report significant improvement within 2-3 weeks of consistent use. Our 30-day program is designed to create lasting change through daily practice.'
                        },
                        {
                            q: 'Is my data private and secure?',
                            a: 'Absolutely. All your journals, mood data, and conversations are encrypted and stored securely. We never share your personal information.'
                        },
                        {
                            q: 'Can I really talk to AI about my feelings?',
                            a: 'Yes! Our AI is trained specifically for emotional support and breakup recovery. It\'s available 24/7 and provides judgment-free guidance based on therapeutic principles.'
                        },
                        {
                            q: 'What if I need to cancel?',
                            a: 'You can cancel anytime with just one click. No contracts, no hassles. If you cancel during your trial, you won\'t be charged.'
                        },
                        {
                            q: 'Is this a replacement for therapy?',
                            a: 'LoveDetox is a powerful self-help tool, but not a replacement for professional therapy. If you\'re experiencing severe depression or anxiety, please seek professional help.'
                        }
                    ].map((faq, i) => (
                        <details key={i} className="group card-3d rounded-2xl overflow-hidden">
                            <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors list-none">
                                <h5 className="text-gray-900 dark:text-white pr-8">{faq.q}</h5>
                                <ChevronDown className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0" />
                            </summary>
                            <div className="px-6 pb-6">
                                <p className="text-gray-600 dark:text-gray-400">{faq.a}</p>
                            </div>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}
