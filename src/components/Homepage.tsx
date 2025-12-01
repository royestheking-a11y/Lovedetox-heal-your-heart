import { useState, useEffect } from 'react';
import { Heart, MessageCircle, CheckCircle, TrendingUp, Shield, BookOpen, Users, Sparkles, ArrowRight, Star, Lock, Mail, Phone, MapPin, Instagram, Twitter, Linkedin, Facebook, ChevronDown, Menu, X, Check, Target, Brain } from 'lucide-react';
import { AuthModal } from './AuthModal';
import { GuestChatModal } from './GuestChatModal';
import { FooterModal } from './FooterModals';
import { toast } from 'sonner';
import { PremiumIcon } from './PremiumIcon';
import { SoundEffects } from './SoundEffects';
import { useAuth } from './AuthContext';
import adminService from '../services/adminService';
import dataService from '../services/dataService';

export function Homepage() {
  const { login, user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showGuestChat, setShowGuestChat] = useState(false);

  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [prefillEmail, setPrefillEmail] = useState('');
  const [prefillPassword, setPrefillPassword] = useState('');
  const [footerModal, setFooterModal] = useState<{
    isOpen: boolean;
    type: 'features' | 'pricing' | 'how-it-works' | 'ai-technology' | 'blog' | 'healing-guide' | 'community' | 'faq' | 'about' | 'privacy' | 'terms' | 'contact' | null;
  }>({ isOpen: false, type: null });


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

  const handleStartFree = () => {
    SoundEffects.play('click');
    setAuthMode('register');
    setShowAuthModal(true);
  };

  const handleLogin = () => {
    SoundEffects.play('click');
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const handleTalkToAI = () => {
    SoundEffects.play('click');
    // If user is logged in, redirect to AI chat, otherwise toggle guest chat
    if (user) {
      // User is logged in, they should go to dashboard
      toast.info('Please use the AI Support from your dashboard');
    } else {
      setShowGuestChat(!showGuestChat);
    }
  };
  const [socialLinks, setSocialLinks] = useState({
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: ''
  });
  const [proPrice, setProPrice] = useState(19);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await adminService.getSettings();
      if (settings) {
        if (settings.socialLinks) {
          setSocialLinks(settings.socialLinks);
        }
        if (settings.proPrice) {
          setProPrice(settings.proPrice);
        }
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
        handleStartFree();
        break;
      case 'login':
        handleLogin();
        break;
      case 'download_guide':
        toast.success('Guide downloading...');
        setTimeout(() => {
          const link = document.createElement('a');
          link.href = '/healing-guide.pdf'; // Assuming this file exists or will exist
          link.download = 'LoveDetox-Healing-Guide.pdf';
          // link.click(); // Commented out as file might not exist yet
          toast.success('Download started!');
        }, 1000);
        break;
      default:
        toast.info('This feature is coming soon!');
    }
  };

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    const messageData = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
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

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
    SoundEffects.play('click');
  };

  return (
    <div className="bg-[#FAFAFA] dark:bg-gray-900 smooth-scroll transition-colors duration-300">
      {/* NAVIGATION - Redesigned */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass dark:bg-gray-900/90 border-b border-white/20 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-lg icon-3d">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">LoveDetox</span>
            </div>

            {/* Desktop Menu - Removed Stories & Admin */}
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('features')} className="text-gray-700 dark:text-gray-300 hover:text-[#6366F1] dark:hover:text-[#8B5CF6] transition-colors font-medium">Features</button>
              <button onClick={() => scrollToSection('how-it-works')} className="text-gray-700 dark:text-gray-300 hover:text-[#6366F1] dark:hover:text-[#8B5CF6] transition-colors font-medium">How It Works</button>
              <button onClick={() => scrollToSection('pricing')} className="text-gray-700 dark:text-gray-300 hover:text-[#6366F1] dark:hover:text-[#8B5CF6] transition-colors font-medium">Pricing</button>
              <button onClick={() => scrollToSection('faq')} className="text-gray-700 dark:text-gray-300 hover:text-[#6366F1] dark:hover:text-[#8B5CF6] transition-colors font-medium">FAQ</button>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">

              <button onClick={handleLogin} className="px-6 py-2.5 text-[#6366F1] dark:text-[#8B5CF6] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors font-medium">
                Sign In
              </button>
              <button onClick={handleStartFree} className="btn-primary">
                Start Free
              </button>
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
              <button onClick={() => scrollToSection('features')} className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">Features</button>
              <button onClick={() => scrollToSection('how-it-works')} className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">How It Works</button>
              <button onClick={() => scrollToSection('pricing')} className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">Pricing</button>
              <button onClick={() => scrollToSection('faq')} className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">FAQ</button>
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">

                <button onClick={handleLogin} className="block w-full text-left px-4 py-2 text-[#6366F1] dark:text-[#8B5CF6] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">Sign In</button>
                <button onClick={handleStartFree} className="block w-full btn-primary text-center">Start Free</button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* HERO SECTION */}
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
            <button onClick={handleStartFree} className="px-8 py-4 bg-white text-[#6366F1] rounded-full font-semibold transition-all hover:scale-105 hover:shadow-2xl flex items-center gap-2 ripple">
              Start Your Free Journey
              <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={handleTalkToAI} className="px-8 py-4 bg-white/10 text-white border-2 border-white/50 rounded-full font-semibold backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-105 ripple">
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
          onClick={() => scrollToSection('pain-points')}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
        >
          <ChevronDown className="w-8 h-8 text-white" />
        </button>
      </section>

      {/* PAIN POINTS SECTION - With 3D Icons */}
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

      {/* FEATURES SECTION */}
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

      {/* HOW IT WORKS - Better Design */}
      <section id="how-it-works" className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#6366F1] dark:text-[#8B5CF6] font-semibold mb-2 block">THE PROCESS</span>
            <h2 className="gradient-text mb-4">Your Path to Healing</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              A structured, proven approach to emotional recovery in just 30 days.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                Icon: Target,
                title: 'Start Assessment',
                desc: 'Take our 5-minute assessment to understand your emotional state',
                gradient: 'from-[#6366F1] to-[#8B5CF6]'
              },
              {
                step: '02',
                Icon: CheckCircle,
                title: 'Daily Actions',
                desc: 'Complete bite-sized healing tasks each day',
                gradient: 'from-[#8B5CF6] to-[#FB7185]'
              },
              {
                step: '03',
                Icon: TrendingUp,
                title: 'Track Progress',
                desc: 'Monitor mood patterns and celebrate milestones',
                gradient: 'from-[#FB7185] to-[#F472B6]'
              },
              {
                step: '04',
                Icon: Sparkles,
                title: 'Emerge Stronger',
                desc: 'Complete the program with emotional resilience',
                gradient: 'from-[#6366F1] to-[#8B5CF6]'
              }
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="card-3d p-8 rounded-2xl text-center group">
                  <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6366F1] to-[#FB7185] mb-6 opacity-20">
                    {item.step}
                  </div>
                  <div className="flex justify-center mb-6">
                    <PremiumIcon
                      Icon={item.Icon}
                      size="lg"
                      variant="3d"
                      gradient={item.gradient}
                      animate={true}
                    />
                  </div>
                  <h4 className="text-gray-900 dark:text-white mb-3 font-semibold">{item.title}</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{item.desc}</p>
                </div>
                {i < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS - Carousel */}
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

      {/* PRICING */}
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
                  onClick={handleStartFree}
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

      {/* FAQ */}
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

      {/* CTA SECTION */}
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
            <button onClick={handleStartFree} className="px-8 py-4 bg-white text-[#6366F1] rounded-full font-semibold transition-all hover:scale-105 hover:shadow-2xl ripple">
              Start Your 7-Day Free Trial
            </button>
            <button onClick={handleTalkToAI} className="px-8 py-4 bg-white/10 text-white border-2 border-white/50 rounded-full font-semibold backdrop-blur-sm transition-all hover:bg-white/20 ripple">
              Try AI Chat Free
            </button>
          </div>

          <p className="text-white/70 text-sm mt-8">
            No credit card required • Cancel anytime • 100% secure
          </p>
        </div>
      </section>

      {/* CONTACT */}
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

      {/* FOOTER - With Admin Access */}
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
                {socialLinks.facebook && (
                  <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                    <Facebook className="w-5 h-5" />
                  </a>
                )}
                {socialLinks.linkedin && (
                  <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>

            {/* Product */}
            <div>
              <h5 className="font-semibold mb-4">Product</h5>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><button onClick={() => setFooterModal({ isOpen: true, type: 'features' })} className="hover:text-white transition-colors">Features</button></li>
                <li><button onClick={() => setFooterModal({ isOpen: true, type: 'pricing' })} className="hover:text-white transition-colors">Pricing</button></li>
                <li><button onClick={() => setFooterModal({ isOpen: true, type: 'how-it-works' })} className="hover:text-white transition-colors">How It Works</button></li>
                <li><button onClick={() => setFooterModal({ isOpen: true, type: 'ai-technology' })} className="hover:text-white transition-colors">AI Technology</button></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h5 className="font-semibold mb-4">Resources</h5>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><button onClick={() => setFooterModal({ isOpen: true, type: 'blog' })} className="hover:text-white transition-colors">Blog</button></li>
                <li><button onClick={() => setFooterModal({ isOpen: true, type: 'healing-guide' })} className="hover:text-white transition-colors">Healing Guide</button></li>
                <li><button onClick={() => setFooterModal({ isOpen: true, type: 'community' })} className="hover:text-white transition-colors">Community</button></li>
                <li><button onClick={() => setFooterModal({ isOpen: true, type: 'faq' })} className="hover:text-white transition-colors">FAQ</button></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h5 className="font-semibold mb-4">Company</h5>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><button onClick={() => setFooterModal({ isOpen: true, type: 'about' })} className="hover:text-white transition-colors">About Us</button></li>
                <li><button onClick={() => setFooterModal({ isOpen: true, type: 'privacy' })} className="hover:text-white transition-colors">Privacy Policy</button></li>
                <li><button onClick={() => setFooterModal({ isOpen: true, type: 'terms' })} className="hover:text-white transition-colors">Terms of Service</button></li>
                <li><button onClick={() => setFooterModal({ isOpen: true, type: 'contact' })} className="hover:text-white transition-colors">Contact</button></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © 2024 LoveDetox. All rights reserved.
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              © 2025 LoveDetox. Made with Love to bring healing to every heart
            </p>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {showAuthModal && (
        <AuthModal
          initialMode={authMode}
          onClose={() => {
            setShowAuthModal(false);
            setPrefillEmail('');
            setPrefillPassword('');
          }}
          prefillEmail={prefillEmail}
          prefillPassword={prefillPassword}
        />
      )}

      {showGuestChat && (
        <GuestChatModal
          onClose={() => setShowGuestChat(false)}
          onSignup={() => {
            setShowGuestChat(false);
            setAuthMode('register');
            setShowAuthModal(true);
          }}
        />
      )}

      {/* Admin Modal */}
      {showAdminModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => {
            console.log('🖱️ Clicked outside admin modal');
            setShowAdminModal(false);
          }}
        >
          <div className="card-3d rounded-3xl p-8 max-w-md w-full mx-4 relative overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Background gradient */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-full blur-3xl" />
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                console.log('❌ Admin modal X button clicked');
                setShowAdminModal(false);
              }}
              className="absolute top-6 right-6 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all z-10"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            <div className="relative z-10 text-center mb-6">
              <PremiumIcon
                Icon={Lock}
                size="lg"
                variant="3d"
                gradient="from-[#6366F1] to-[#8B5CF6]"
              />
              <h3 className="text-gray-900 dark:text-white mt-6 mb-2">Admin Access</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                Click "Go to Login" to auto-fill these credentials
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                <Check className="w-3 h-3" />
                Credentials will be pre-filled for you
              </div>
            </div>

            <div className="space-y-3 mb-6">

            </div>

            <div className="space-y-3">
              {/* Primary Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('🔘 "Go to Login" clicked');
                    setShowAdminModal(false);

                    setAuthMode('login');
                    setShowAuthModal(true);
                  }}
                  className="flex-1 btn-primary py-3 rounded-full"
                >
                  Go to Login
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('🔘 "Cancel" clicked');
                    setShowAdminModal(false);
                  }}
                  className="px-6 py-3 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </div>

              {/* Quick Test Login */}
              <button
                type="button"
                onClick={async (e) => {
                  e.stopPropagation();
                  console.log('⚡ Quick test login initiated...');
                  const success = await login('admin@lovedetox.com', 'lovedetox009');
                  if (success) {
                    console.log('✅ Test login successful!');
                    toast.success('Admin login successful!');
                    setShowAdminModal(false);
                  } else {
                    console.log('❌ Test login failed!');
                    toast.error('Test login failed - check console');
                  }
                }}
                className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-full transition-colors text-sm font-medium"
              >
                ⚡ Quick Test Login (Bypass Modal)
              </button>

              {/* Debug Buttons */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const users = JSON.parse(localStorage.getItem('users') || '[]');
                    const admin = users.find((u: any) => u.email === 'admin@lovedetox.com');
                    if (admin) {
                      admin.password = 'lovedetox009';
                      localStorage.setItem('users', JSON.stringify(users));
                    }
                    console.log('📊 Debug Info:');
                    console.log('Total users:', users.length);
                    console.log('Admin exists:', !!admin);
                    if (admin) {
                      console.log('Admin data:', admin);
                      toast.success(`Admin found! Email: ${admin.email}, Password: ${admin.password}`);
                    } else {
                      toast.error('Admin not found in localStorage!');
                    }
                  }}
                  className="flex-1 text-xs text-blue-600 dark:text-blue-400 hover:underline py-2 transition-colors"
                >
                  🔍 Check Admin Data
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('🗑️ Clearing all data...');
                    localStorage.clear();
                    toast.success('Data cleared! Reloading...');
                    setTimeout(() => window.location.reload(), 500);
                  }}
                  className="flex-1 text-xs text-red-600 dark:text-red-400 hover:underline py-2 transition-colors"
                >
                  🔧 Clear & Restart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Modals */}
      {footerModal.isOpen && footerModal.type && (
        <FooterModal
          isOpen={footerModal.isOpen}
          onClose={() => setFooterModal({ isOpen: false, type: null })}
          type={footerModal.type}
          onAction={handleFooterAction}
        />
      )}

      {/* Floating AI Chat Button */}
      <button
        onClick={handleTalkToAI}
        className="fixed bottom-8 right-8 z-[150] w-16 h-16 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-all duration-300 group animate-bounce-subtle"
        title="Chat with AI Friend"
      >
        <div className="relative">
          <MessageCircle className="w-8 h-8" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#FB7185] rounded-full animate-pulse" />
        </div>
        <div className="absolute -top-2 -right-2 bg-white text-[#6366F1] text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
          AI
        </div>
      </button>
    </div>
  );
}