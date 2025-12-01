import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Instagram, Twitter, Linkedin, Facebook } from 'lucide-react';
import adminService from '../services/adminService';
import { FooterModal } from './FooterModals';
import { toast } from 'sonner';

export function AppFooter() {
    const [socialLinks, setSocialLinks] = useState({
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: ''
    });
    const [footerModal, setFooterModal] = useState<{
        isOpen: boolean;
        type: 'features' | 'pricing' | 'how-it-works' | 'ai-technology' | 'blog' | 'healing-guide' | 'community' | 'faq' | 'about' | 'privacy' | 'terms' | 'contact' | null;
    }>({ isOpen: false, type: null });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const settings = await adminService.getSettings();
            if (settings && settings.socialLinks) {
                setSocialLinks(settings.socialLinks);
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    };

    const handleFooterAction = (action: string) => {
        setFooterModal({ isOpen: false, type: null });

        switch (action) {
            case 'signup':
            case 'start_free':
                // Navigate to register
                window.location.href = '/register';
                break;
            case 'login':
                window.location.href = '/login';
                break;
            case 'download_guide':
                toast.success('Guide downloading...');
                setTimeout(() => {
                    const link = document.createElement('a');
                    link.href = '/healing-guide.pdf';
                    link.download = 'LoveDetox-Healing-Guide.pdf';
                    toast.success('Download started!');
                }, 1000);
                break;
            default:
                toast.info('This feature is coming soon!');
        }
    };

    return (
        <footer className="bg-gray-900 dark:bg-black text-white py-16">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                                <Heart className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold">LoveDetox</span>
                        </div>
                        <p className="text-gray-400 text-sm mb-6">
                            Helping hearts heal, one day at a time.
                        </p>
                        <div className="flex gap-3">
                            {socialLinks.instagram && (
                                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                                    <Instagram className="w-5 h-5" />
                                </a>
                            )}
                            {socialLinks.twitter && (
                                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                                    <Twitter className="w-5 h-5" />
                                </a>
                            )}
                            {socialLinks.linkedin && (
                                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                                    <Linkedin className="w-5 h-5" />
                                </a>
                            )}
                            {socialLinks.facebook && (
                                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                                    <Facebook className="w-5 h-5" />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 className="font-semibold mb-6">Product</h4>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
                            <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                            <li><Link to="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
                            <li><button onClick={() => setFooterModal({ isOpen: true, type: 'ai-technology' })} className="hover:text-white transition-colors">AI Technology</button></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="font-semibold mb-6">Resources</h4>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li><button onClick={() => setFooterModal({ isOpen: true, type: 'blog' })} className="hover:text-white transition-colors">Blog</button></li>
                            <li><button onClick={() => setFooterModal({ isOpen: true, type: 'healing-guide' })} className="hover:text-white transition-colors">Healing Guide</button></li>
                            <li><button onClick={() => setFooterModal({ isOpen: true, type: 'community' })} className="hover:text-white transition-colors">Community Stories</button></li>
                            <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-semibold mb-6">Company</h4>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li><button onClick={() => setFooterModal({ isOpen: true, type: 'about' })} className="hover:text-white transition-colors">About Us</button></li>
                            <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                            <li><button onClick={() => setFooterModal({ isOpen: true, type: 'privacy' })} className="hover:text-white transition-colors">Privacy Policy</button></li>
                            <li><button onClick={() => setFooterModal({ isOpen: true, type: 'terms' })} className="hover:text-white transition-colors">Terms of Service</button></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} LoveDetox. All rights reserved.</p>
                </div>
            </div>

            <FooterModal
                isOpen={footerModal.isOpen}
                onClose={() => setFooterModal({ isOpen: false, type: null })}
                type={footerModal.type}
                onAction={handleFooterAction}
            />
        </footer>
    );
}
