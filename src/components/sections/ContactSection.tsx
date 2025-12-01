import { Mail, Phone, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import dataService from '../../services/dataService';

export function ContactSection() {
    const handleSupportSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);

        const messageData = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            message: formData.get('message') as string,
        };

        try {
            await dataService.sendSupportMessage(messageData);
            toast.success('Message sent successfully! We will get back to you soon.');
            (e.target as HTMLFormElement).reset();
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message');
        }
    };

    return (
        <section id="contact" className="py-24 bg-white dark:bg-gray-900">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-12">
                    <div>
                        <h3 className="gradient-text mb-4">Get in Touch</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                            Have questions? Need support? We're here for you. Send us a message and we'll respond within 24 hours.
                        </p>

                        <div className="space-y-6">
                            {[
                                { Icon: Mail, label: 'Email', value: 'lovedetox.org@gmail.com' },
                                { Icon: Phone, label: 'Phone', value: '+880(162) 569-1878' },
                                { Icon: MapPin, label: 'Location', value: 'Gulshan 2, Dhaka. Bangladesh' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <div className="p-3 bg-gradient-to-br from-[#6366F1]/10 to-[#8B5CF6]/10 rounded-xl">
                                        <item.Icon className="w-6 h-6 text-[#6366F1]" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900 dark:text-white mb-1">{item.label}</div>
                                        <div className="text-gray-600 dark:text-gray-400">{item.value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <form onSubmit={handleSupportSubmit} className="space-y-4">
                            <input
                                type="text"
                                name="name"
                                placeholder="Your Name"
                                required
                                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:border-[#6366F1] focus:outline-none transition-colors"
                            />

                            <input
                                type="email"
                                name="email"
                                placeholder="Your Email"
                                required
                                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:border-[#6366F1] focus:outline-none transition-colors"
                            />

                            <textarea
                                name="message"
                                placeholder="Your Message"
                                required
                                rows={6}
                                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:border-[#6366F1] focus:outline-none transition-colors resize-none"
                            />

                            <button type="submit" className="w-full btn-primary">
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
