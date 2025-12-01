import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Menu, X } from 'lucide-react';
import { useAuth } from './AuthContext';

export function Navbar() {
    const { user, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleStartFree = () => {
        navigate('/register');
    };

    const handleLogin = () => {
        navigate('/login');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass dark:bg-gray-900/90 border-b border-white/20 dark:border-gray-700/50">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-lg icon-3d">
                            <Heart className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-2xl font-bold gradient-text">LoveDetox</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/features" className="text-gray-700 dark:text-gray-300 hover:text-[#6366F1] dark:hover:text-[#8B5CF6] transition-colors font-medium">Features</Link>
                        <Link to="/how-it-works" className="text-gray-700 dark:text-gray-300 hover:text-[#6366F1] dark:hover:text-[#8B5CF6] transition-colors font-medium">How It Works</Link>
                        <Link to="/pricing" className="text-gray-700 dark:text-gray-300 hover:text-[#6366F1] dark:hover:text-[#8B5CF6] transition-colors font-medium">Pricing</Link>
                        <Link to="/faq" className="text-gray-700 dark:text-gray-300 hover:text-[#6366F1] dark:hover:text-[#8B5CF6] transition-colors font-medium">FAQ</Link>
                    </div>

                    {/* CTA Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        {user ? (
                            <Link to={isAdmin ? "/admin" : "/dashboard"} className="btn-primary">
                                {isAdmin ? "Admin Panel" : "Dashboard"}
                            </Link>
                        ) : (
                            <>
                                <button onClick={handleLogin} className="px-6 py-2.5 text-[#6366F1] dark:text-[#8B5CF6] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors font-medium">
                                    Sign In
                                </button>
                                <button onClick={handleStartFree} className="btn-primary">
                                    Start Free
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden mt-4 pb-4 space-y-3 animate-in slide-in-from-top duration-300">
                        <Link to="/features" onClick={() => setMobileMenuOpen(false)} className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">Features</Link>
                        <Link to="/how-it-works" onClick={() => setMobileMenuOpen(false)} className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">How It Works</Link>
                        <Link to="/pricing" onClick={() => setMobileMenuOpen(false)} className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">Pricing</Link>
                        <Link to="/faq" onClick={() => setMobileMenuOpen(false)} className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">FAQ</Link>
                        <div className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
                            {user ? (
                                <Link to={isAdmin ? "/admin" : "/dashboard"} onClick={() => setMobileMenuOpen(false)} className="block w-full btn-primary text-center">
                                    {isAdmin ? "Admin Panel" : "Dashboard"}
                                </Link>
                            ) : (
                                <>
                                    <button onClick={() => { handleLogin(); setMobileMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-[#6366F1] dark:text-[#8B5CF6] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">Sign In</button>
                                    <button onClick={() => { handleStartFree(); setMobileMenuOpen(false); }} className="block w-full btn-primary text-center">Start Free</button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
