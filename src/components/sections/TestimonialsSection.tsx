import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

export function TestimonialsSection() {
    const [testimonialIndex, setTestimonialIndex] = useState(0);

    const testimonials = [
        {
            name: 'Sarah M.',
            role: '28, Marketing Manager',
            gender: 'female' as const,
            avatar: '👩',
            text: 'After 2 years together, I thought I would never recover. LoveDetox gave me structure when I had none. The AI chat helped me at 3 AM when I felt most alone.',
            rating: 5
        },
        {
            name: 'James K.',
            role: '34, Software Engineer',
            gender: 'male' as const,
            avatar: '👨',
            text: 'I was skeptical about emotional healing apps, but this actually works. The no-contact tracker kept me accountable, and the daily tasks gave me purpose.',
            rating: 5
        },
        {
            name: 'Maya L.',
            role: '25, Teacher',
            gender: 'female' as const,
            avatar: '👩',
            text: 'The community feature is incredible. Knowing others are going through the same thing made me feel less crazy. I completed the 30-day program and feel like a new person.',
            rating: 5
        },
        {
            name: 'David R.',
            role: '31, Designer',
            gender: 'male' as const,
            avatar: '👨',
            text: 'The mood tracker helped me identify my emotional patterns. I can now see how far I have come. This app is a game changer for anyone going through heartbreak.',
            rating: 5
        },
        {
            name: 'Emma W.',
            role: '27, Nurse',
            gender: 'female' as const,
            avatar: '👩',
            text: 'Daily recovery tasks kept me focused on healing rather than dwelling. The journal became my safe space. I am genuinely happy again and grateful for this platform.',
            rating: 5
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section id="testimonials" className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="text-[#6366F1] dark:text-[#8B5CF6] font-semibold mb-2 block">SUCCESS STORIES</span>
                    <h2 className="gradient-text mb-4">Real People, Real Healing</h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        Join thousands who transformed heartbreak into growth.
                    </p>
                </div>

                {/* Carousel */}
                <div className="relative">
                    <div className="card-3d p-10 rounded-3xl">
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-4xl shadow-xl">
                                {testimonials[testimonialIndex].avatar}
                            </div>
                            <div className="flex justify-center gap-1 mb-6">
                                {[...Array(testimonials[testimonialIndex].rating)].map((_, i) => (
                                    <Star key={i} className="w-6 h-6 fill-[#FB7185] text-[#FB7185]" />
                                ))}
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6 italic">
                                "{testimonials[testimonialIndex].text}"
                            </p>
                            <div>
                                <div className="font-semibold text-gray-900 dark:text-white text-lg">{testimonials[testimonialIndex].name}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{testimonials[testimonialIndex].role}</div>
                            </div>
                        </div>

                        {/* Dots */}
                        <div className="flex justify-center gap-2">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setTestimonialIndex(index)}
                                    className={`h-2 rounded-full transition-all ${index === testimonialIndex
                                        ? 'w-8 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]'
                                        : 'w-2 bg-gray-300 dark:bg-gray-600'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
