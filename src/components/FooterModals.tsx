import { useEffect, useRef } from 'react';
import { X, CheckCircle, Heart, Zap, Brain, Shield, TrendingUp, BookOpen, Users, Mail, Phone, MapPin, Lock, FileText } from 'lucide-react';

interface FooterModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'features' | 'pricing' | 'how-it-works' | 'ai-technology' | 'blog' | 'healing-guide' | 'community' | 'faq' | 'about' | 'privacy' | 'terms' | 'contact' | null;
  onAction?: (action: string) => void;
}

export function FooterModal({ isOpen, onClose, type, onAction }: FooterModalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [isOpen, type]);

  const handleAction = (action: string) => {
    if (onAction) {
      onAction(action);
    }
  };
  if (!isOpen || !type) return null;

  const renderContent = () => {
    switch (type) {
      case 'features':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold gradient-text mb-2">Powerful Features</h2>
              <p className="text-gray-600">Everything you need to heal from heartbreak</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: Brain,
                  title: 'AI Emotional Support',
                  desc: '24/7 AI companion trained in emotional healing and breakup recovery. Get instant support whenever you need it.',
                  features: ['Empathetic conversations', '5 specialized modes', 'Unlimited messages (Pro)', 'Context-aware responses']
                },
                {
                  icon: CheckCircle,
                  title: 'Daily Recovery Tasks',
                  desc: 'Science-backed exercises designed to rebuild your emotional strength day by day.',
                  features: ['30-day healing program', 'Progress tracking', 'Personalized tasks', 'Achievement system']
                },
                {
                  icon: TrendingUp,
                  title: 'Mood Tracking & Analytics',
                  desc: 'Visual insights into your emotional patterns and healing progress over time.',
                  features: ['Daily mood logging', 'Emotion analytics', 'Progress graphs', 'Pattern recognition']
                },
                {
                  icon: BookOpen,
                  title: 'Private Journal',
                  desc: 'Secure, encrypted space to process your thoughts and feelings privately.',
                  features: ['Unlimited entries', 'Rich text editor', 'Search functionality', 'Export options']
                },
                {
                  icon: Shield,
                  title: 'No-Contact Guard',
                  desc: 'Stay accountable to no-contact with tracking and emergency support when tempted.',
                  features: ['Temptation tracker', 'Emergency interventions', 'Progress streaks', 'Victory celebrations']
                },
                {
                  icon: Users,
                  title: 'Healing Community',
                  desc: 'Connect with others on the same journey. Share, support, and grow together.',
                  features: ['Anonymous forums', 'Success stories', 'Group challenges', 'Peer support']
                }
              ].map((feature, i) => (
                <div key={i} className="card-3d p-6 rounded-2xl">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6366F1]/10 to-[#8B5CF6]/10 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-[#6366F1]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{feature.desc}</p>
                      <ul className="space-y-1">
                        {feature.features.map((f, j) => (
                          <li key={j} className="flex items-center gap-2 text-xs text-gray-500">
                            <CheckCircle className="w-3 h-3 text-[#6366F1]" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-2xl text-white text-center">
              <h3 className="text-xl font-semibold mb-2">Plus Many More Features</h3>
              <p className="text-white/90 mb-4">Breathing exercises, letter therapy, achievements, and more...</p>
              <button onClick={() => handleAction('start_free')} className="px-6 py-3 bg-white text-[#6366F1] rounded-full font-semibold hover:shadow-lg transition-all">
                Start Free Trial
              </button>
            </div>
          </div>
        );

      case 'pricing':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-lg">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold gradient-text mb-2">Simple, Transparent Pricing</h2>
              <p className="text-gray-600">Choose the plan that works best for you</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  name: 'Free',
                  price: '$0',
                  period: 'forever',
                  desc: 'Try before you commit',
                  features: [
                    '10 AI chat messages total',
                    'Basic mood tracking',
                    'Limited community access',
                    '5 journal entries',
                    'Basic daily tasks',
                    'Email support'
                  ],
                  cta: 'Start Free',
                  action: 'start_free',
                  popular: false
                },
                {
                  name: 'Pro',
                  price: '$19',
                  period: 'per month',
                  desc: 'Full healing toolkit',
                  features: [
                    'Unlimited AI support',
                    'All recovery programs',
                    'Advanced mood analytics',
                    'Full community access',
                    'Unlimited journaling',
                    'No-contact guard',
                    'Priority support',
                    'All future features'
                  ],
                  cta: 'Start 7-Day Free Trial',
                  action: 'start_free',
                  popular: true
                },
                {
                  name: 'Lifetime',
                  price: '$199',
                  period: 'one-time payment',
                  desc: 'Lifetime access',
                  features: [
                    'Everything in Pro',
                    'Lifetime updates',
                    'Exclusive workshops',
                    'Personal coach sessions',
                    'Early feature access',
                    'VIP support',
                    'Transferable license',
                    'No recurring fees'
                  ],
                  cta: 'Get Lifetime Access',
                  action: 'start_free',
                  popular: false
                }
              ].map((plan, i) => (
                <div key={i} className={`relative card-3d rounded-2xl p-6 ${plan.popular ? 'scale-105 shadow-2xl ring-2 ring-[#6366F1]' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="px-4 py-1 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white text-xs font-semibold rounded-full shadow-lg">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="mb-2">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-500 text-sm ml-2">/{plan.period}</span>
                    </div>
                    <p className="text-sm text-gray-600">{plan.desc}</p>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-[#6366F1] flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleAction((plan as any).action || 'start_free')}
                    className={`w-full py-3 rounded-full font-semibold transition-all ${plan.popular
                      ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white hover:shadow-lg'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}>
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 p-6 bg-blue-50 rounded-2xl">
              <h4 className="font-semibold text-gray-900 mb-3">Money-Back Guarantee</h4>
              <p className="text-sm text-gray-600">
                Try LoveDetox risk-free. If you're not satisfied within the first 30 days, we'll refund your money—no questions asked.
              </p>
            </div>
          </div>
        );

      case 'how-it-works':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold gradient-text mb-2">How LoveDetox Works</h2>
              <p className="text-gray-600">Your journey to emotional freedom in 4 simple steps</p>
            </div>

            <div className="space-y-6">
              {[
                {
                  step: '01',
                  title: 'Create Your Account',
                  desc: 'Sign up in under 60 seconds. No credit card required to start.',
                  details: [
                    'Simple email registration',
                    'Secure, encrypted data',
                    'Instant access to free features',
                    'Optional profile customization'
                  ]
                },
                {
                  step: '02',
                  title: 'Take the Assessment',
                  desc: 'Complete our 5-minute emotional wellness assessment.',
                  details: [
                    'Understand your current state',
                    'Get personalized recommendations',
                    'Set your healing goals',
                    'Receive your custom roadmap'
                  ]
                },
                {
                  step: '03',
                  title: 'Follow Your Daily Plan',
                  desc: 'Complete daily tasks designed for your healing journey.',
                  details: [
                    'Evidence-based exercises',
                    '10-15 minutes per day',
                    'Track your progress',
                    'Earn achievements'
                  ]
                },
                {
                  step: '04',
                  title: 'Heal & Grow',
                  desc: 'Watch yourself transform over the 30-day program.',
                  details: [
                    'Reduced emotional pain',
                    'Increased self-confidence',
                    'Better coping strategies',
                    'Emotional independence'
                  ]
                }
              ].map((item, i) => (
                <div key={i} className="card-3d p-6 rounded-2xl">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white text-2xl font-bold">
                        {item.step}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600 mb-4">{item.desc}</p>
                      <ul className="grid grid-cols-2 gap-2">
                        {item.details.map((detail, j) => (
                          <li key={j} className="flex items-center gap-2 text-sm text-gray-500">
                            <CheckCircle className="w-4 h-4 text-[#6366F1]" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-2xl text-white">
              <h3 className="text-xl font-semibold mb-2">Ready to Start Your Healing Journey?</h3>
              <p className="text-white/90 mb-4">Join 10,000+ people who chose to heal and grow.</p>
              <button onClick={() => handleAction('start_free')} className="px-6 py-3 bg-white text-[#6366F1] rounded-full font-semibold hover:shadow-lg transition-all">
                Get Started Free
              </button>
            </div>
          </div>
        );

      case 'ai-technology':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold gradient-text mb-2">Advanced AI Technology</h2>
              <p className="text-gray-600">Powered by cutting-edge emotional intelligence</p>
            </div>

            <div className="prose max-w-none">
              <div className="card-3d p-6 rounded-2xl mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">How Our AI Works</h3>
                <p className="text-gray-600 mb-4">
                  LoveDetox uses advanced natural language processing and therapeutic frameworks to provide empathetic, contextual support. Our AI is trained on thousands of breakup recovery conversations and evidence-based healing methodologies.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="card-3d p-6 rounded-2xl">
                  <h4 className="font-semibold text-gray-900 mb-3">5 Specialized AI Modes</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#6366F1] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600"><strong>Empathy Mode:</strong> Compassionate listening and validation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#6366F1] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600"><strong>Coach Mode:</strong> Actionable advice and motivation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#6366F1] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600"><strong>Therapist Mode:</strong> CBT and DBT techniques</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#6366F1] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600"><strong>Friend Mode:</strong> Casual, supportive conversations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#6366F1] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600"><strong>Tough Love Mode:</strong> Direct accountability</span>
                    </li>
                  </ul>
                </div>

                <div className="card-3d p-6 rounded-2xl">
                  <h4 className="font-semibold text-gray-900 mb-3">Privacy & Security</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Shield className="w-4 h-4 text-[#6366F1] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">End-to-end encryption for all conversations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Shield className="w-4 h-4 text-[#6366F1] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">No human ever reads your messages</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Shield className="w-4 h-4 text-[#6366F1] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">Data stored securely and never shared</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Shield className="w-4 h-4 text-[#6366F1] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">Full GDPR & HIPAA compliance</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="card-3d p-6 rounded-2xl">
                <h4 className="font-semibold text-gray-900 mb-3">Limitations & Disclaimers</h4>
                <p className="text-sm text-gray-600 mb-3">
                  While our AI is highly advanced, it's important to understand its role:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-sm text-gray-600">• LoveDetox AI is a supportive tool, not a replacement for professional therapy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sm text-gray-600">• If you're experiencing severe depression, anxiety, or suicidal thoughts, please seek professional help immediately</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sm text-gray-600">• The AI provides guidance based on general therapeutic principles, not personalized medical advice</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sm text-gray-600">• Crisis resources: National Suicide Prevention Lifeline: 1-800-273-8255</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'blog':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold gradient-text mb-2">LoveDetox Blog</h2>
              <p className="text-gray-600">Expert insights on healing and personal growth</p>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: 'The Science Behind Heartbreak: Why It Hurts So Much',
                  category: 'Science',
                  date: 'Nov 28, 2024',
                  readTime: '8 min read',
                  excerpt: 'Understanding the neurological and psychological reasons why breakups feel like physical pain.'
                },
                {
                  title: '30-Day No Contact Challenge: Complete Guide',
                  category: 'Recovery',
                  date: 'Nov 25, 2024',
                  readTime: '12 min read',
                  excerpt: 'A step-by-step guide to successfully implementing and maintaining no contact with your ex.'
                },
                {
                  title: 'How to Stop Obsessive Thoughts About Your Ex',
                  category: 'Mental Health',
                  date: 'Nov 22, 2024',
                  readTime: '10 min read',
                  excerpt: 'Practical cognitive techniques to break free from rumination and intrusive thoughts.'
                },
                {
                  title: 'Self-Love After a Breakup: 15 Daily Practices',
                  category: 'Self-Care',
                  date: 'Nov 20, 2024',
                  readTime: '6 min read',
                  excerpt: 'Simple, effective habits to rebuild your self-worth and confidence after heartbreak.'
                },
                {
                  title: 'When to Get Back Together vs. Move On',
                  category: 'Relationships',
                  date: 'Nov 18, 2024',
                  readTime: '15 min read',
                  excerpt: 'How to make an informed decision about reconciliation based on healthy relationship principles.'
                }
              ].map((post, i) => (
                <div key={i} className="card-3d p-6 rounded-2xl hover:shadow-lg transition-all cursor-pointer">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-[#6366F1]/10 text-[#6366F1] text-xs font-semibold rounded-full">
                          {post.category}
                        </span>
                        <span className="text-xs text-gray-500">{post.date}</span>
                        <span className="text-xs text-gray-500">• {post.readTime}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
                      <p className="text-sm text-gray-600">{post.excerpt}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button onClick={() => handleAction('blog')} className="btn-primary">
                View All Articles
              </button>
            </div>
          </div>
        );

      case 'healing-guide':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-lg">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold gradient-text mb-2">Complete Healing Guide</h2>
              <p className="text-gray-600">Your comprehensive roadmap to emotional recovery</p>
            </div>

            <div className="space-y-6">
              {[
                {
                  phase: 'Phase 1: Acceptance (Days 1-7)',
                  desc: 'Acknowledge the pain and begin the healing process',
                  tasks: [
                    'Accept that the relationship is over',
                    'Allow yourself to grieve fully',
                    'Cut off all contact with your ex',
                    'Reach out to your support system',
                    'Start journaling your feelings'
                  ]
                },
                {
                  phase: 'Phase 2: Detachment (Days 8-14)',
                  desc: 'Break emotional dependency and thought patterns',
                  tasks: [
                    'Remove reminders of your ex',
                    'Identify and challenge obsessive thoughts',
                    'Practice mindfulness meditation',
                    'Establish new daily routines',
                    'Focus on physical self-care'
                  ]
                },
                {
                  phase: 'Phase 3: Rediscovery (Days 15-21)',
                  desc: 'Reconnect with yourself and your identity',
                  tasks: [
                    'Rediscover old hobbies and interests',
                    'Try new activities and experiences',
                    'Reconnect with friends and family',
                    'Set personal goals unrelated to relationships',
                    'Practice self-compassion daily'
                  ]
                },
                {
                  phase: 'Phase 4: Growth (Days 22-30)',
                  desc: 'Transform pain into personal development',
                  tasks: [
                    'Reflect on lessons learned',
                    'Work on personal development areas',
                    'Build emotional resilience',
                    'Create your new life vision',
                    'Celebrate your progress'
                  ]
                }
              ].map((phase, i) => (
                <div key={i} className="card-3d p-6 rounded-2xl">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{phase.phase}</h3>
                  <p className="text-gray-600 mb-4">{phase.desc}</p>
                  <ul className="space-y-2">
                    {phase.tasks.map((task, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-[#6366F1] flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-600">{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="p-6 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-2xl text-white">
              <h3 className="text-xl font-semibold mb-2">Download the Complete PDF Guide</h3>
              <p className="text-white/90 mb-4">Get the full 50-page healing guide with worksheets and exercises.</p>
              <button onClick={() => handleAction('download_guide')} className="px-6 py-3 bg-white text-[#6366F1] rounded-full font-semibold hover:shadow-lg transition-all">
                Download Free Guide
              </button>
            </div>
          </div>
        );

      case 'community':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold gradient-text mb-2">Join Our Community</h2>
              <p className="text-gray-600">You're not alone. Connect with 10,000+ healing hearts</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="card-3d p-6 rounded-2xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Community Features</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#6366F1] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Anonymous Forums</h4>
                      <p className="text-sm text-gray-600">Share your story safely without judgment</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#6366F1] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Success Stories</h4>
                      <p className="text-sm text-gray-600">Read inspiring recovery journeys</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#6366F1] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Group Challenges</h4>
                      <p className="text-sm text-gray-600">Participate in 30-day healing challenges</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#6366F1] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Peer Support</h4>
                      <p className="text-sm text-gray-600">Get and give support from those who understand</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="card-3d p-6 rounded-2xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Community Stats</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-br from-[#6366F1]/10 to-[#8B5CF6]/10 rounded-xl">
                    <div className="text-3xl font-bold text-[#6366F1] mb-1">10,000+</div>
                    <div className="text-sm text-gray-600">Active Members</div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-[#8B5CF6]/10 to-[#FB7185]/10 rounded-xl">
                    <div className="text-3xl font-bold text-[#8B5CF6] mb-1">5,000+</div>
                    <div className="text-sm text-gray-600">Success Stories</div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-[#FB7185]/10 to-[#F472B6]/10 rounded-xl">
                    <div className="text-3xl font-bold text-[#FB7185] mb-1">50,000+</div>
                    <div className="text-sm text-gray-600">Support Messages</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-3d p-6 rounded-2xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Community Guidelines</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-sm text-gray-600">• Be kind and respectful to all members</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sm text-gray-600">• Keep all shared information confidential</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sm text-gray-600">• No judgmental or harmful language</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sm text-gray-600">• Support others as you would like to be supported</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sm text-gray-600">• Report any inappropriate behavior to moderators</span>
                </li>
              </ul>
            </div>
          </div>
        );

      case 'faq':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold gradient-text mb-2">Frequently Asked Questions</h2>
              <p className="text-gray-600">Everything you need to know about LoveDetox</p>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: 'How long does it take to feel better?',
                  a: 'Most users report significant improvement within 2-3 weeks of consistent use. Our 30-day program is designed to create lasting change through daily practice. However, healing is personal and varies by individual. Some may feel better sooner, while others may need more time.'
                },
                {
                  q: 'Is my data private and secure?',
                  a: 'Absolutely. All your journals, mood data, and conversations are encrypted and stored securely using industry-standard encryption. We never share your personal information with third parties. You have full control over your data and can delete it at any time.'
                },
                {
                  q: 'Can I really talk to AI about my feelings?',
                  a: 'Yes! Our AI is trained specifically for emotional support and breakup recovery. It uses advanced natural language processing and therapeutic frameworks to provide empathetic, contextual responses. It\'s available 24/7 and provides judgment-free guidance based on cognitive behavioral therapy (CBT) and dialectical behavior therapy (DBT) principles.'
                },
                {
                  q: 'What if I need to cancel?',
                  a: 'You can cancel anytime with just one click from your profile settings. No contracts, no hassles. If you cancel during your 7-day trial, you won\'t be charged. Pro-rated refunds are available within 30 days of purchase.'
                },
                {
                  q: 'Is this a replacement for therapy?',
                  a: 'LoveDetox is a powerful self-help tool, but not a replacement for professional therapy. If you\'re experiencing severe depression, anxiety, suicidal thoughts, or trauma, please seek professional help. We can complement therapy but should not replace it for serious mental health concerns.'
                },
                {
                  q: 'Will this help me get my ex back?',
                  a: 'LoveDetox focuses on your healing and personal growth, not on getting your ex back. However, many users report that focusing on themselves leads to better outcomes—whether that means moving on successfully or reconciling from a position of strength and self-worth.'
                },
                {
                  q: 'How does the no-contact feature work?',
                  a: 'The No-Contact Guard helps you track your progress, provides emergency interventions when you\'re tempted to reach out, and celebrates your victories. It includes a temptation tracker, coping strategies, and community support to help you maintain no contact.'
                },
                {
                  q: 'Can I use LoveDetox on mobile?',
                  a: 'Yes! LoveDetox works on all devices through your web browser. We\'re also developing native iOS and Android apps, which will be available in early 2025.'
                },
                {
                  q: 'What makes LoveDetox different from other apps?',
                  a: 'LoveDetox combines AI emotional support, evidence-based recovery programs, mood analytics, and community support in one platform. We focus specifically on breakup recovery and emotional detachment, with features designed by therapists and relationship experts.'
                },
                {
                  q: 'Do you offer refunds?',
                  a: 'Yes. We offer a 30-day money-back guarantee. If you\'re not satisfied with LoveDetox for any reason, contact us within 30 days of purchase for a full refund.'
                }
              ].map((faq, i) => (
                <details key={i} className="group card-3d rounded-2xl overflow-hidden">
                  <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors list-none">
                    <h5 className="font-semibold text-gray-900 pr-8">{faq.q}</h5>
                    <CheckCircle className="w-5 h-5 text-[#6366F1] group-open:rotate-180 transition-transform flex-shrink-0" />
                  </summary>
                  <div className="px-6 pb-6">
                    <p className="text-gray-600">{faq.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-lg">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold gradient-text mb-2">About LoveDetox</h2>
              <p className="text-gray-600">Helping hearts heal, one day at a time</p>
            </div>

            <div className="prose max-w-none space-y-6">
              <div className="card-3d p-8 rounded-2xl">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  LoveDetox was created to help people break free from the pain of heartbreak and emotional attachment. We believe that everyone deserves to heal, grow, and find happiness again—whether that's moving on or reconciling from a place of strength.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Our platform combines the latest in AI technology with evidence-based therapeutic approaches to provide accessible, affordable, and effective emotional support for anyone going through a breakup.
                </p>
              </div>

              <div className="card-3d p-8 rounded-2xl">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Our Story</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Founded in 2024, LoveDetox emerged from the personal experience of our founders who struggled to find effective support during their own breakups. Traditional therapy was expensive and hard to access, while generic self-help apps didn't address the specific challenges of heartbreak.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  We assembled a team of therapists, AI engineers, and relationship experts to create a comprehensive platform specifically designed for breakup recovery. Today, we're proud to serve over 10,000 users worldwide.
                </p>
              </div>

              <div className="card-3d p-8 rounded-2xl">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Our Values</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Heart className="w-6 h-6 text-[#6366F1] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Compassion First</h4>
                      <p className="text-gray-600">We lead with empathy and understanding, never judgment</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="w-6 h-6 text-[#6366F1] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Privacy Matters</h4>
                      <p className="text-gray-600">Your healing journey is personal and protected</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Brain className="w-6 h-6 text-[#6366F1] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Evidence-Based</h4>
                      <p className="text-gray-600">All our methods are grounded in psychological research</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Users className="w-6 h-6 text-[#6366F1] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Community Support</h4>
                      <p className="text-gray-600">Healing happens better together</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="card-3d p-8 rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] text-white">
                <h3 className="text-2xl font-semibold mb-4">Join Our Mission</h3>
                <p className="text-white/90 mb-4">
                  We're always looking for therapists, researchers, and passionate individuals to join our team and help us reach more people who need support.
                </p>
                <button onClick={() => handleAction('careers')} className="px-6 py-3 bg-white text-[#6366F1] rounded-full font-semibold hover:shadow-lg transition-all">
                  View Open Positions
                </button>
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-lg">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold gradient-text mb-2">Privacy Policy</h2>
              <p className="text-gray-600">Last updated: November 30, 2024</p>
            </div>

            <div className="prose max-w-none space-y-6">
              <div className="card-3d p-6 rounded-2xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Introduction</h3>
                <p className="text-gray-600">
                  At LoveDetox, your privacy is our top priority. This Privacy Policy explains how we collect, use, protect, and share your personal information when you use our services.
                </p>
              </div>

              <div className="card-3d p-6 rounded-2xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Information We Collect</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• <strong>Account Information:</strong> Email, name, password (encrypted)</li>
                  <li>• <strong>Usage Data:</strong> Mood entries, journal entries, task completion, AI conversations</li>
                  <li>• <strong>Technical Data:</strong> IP address, browser type, device information</li>
                  <li>• <strong>Optional Data:</strong> Profile information you choose to share</li>
                </ul>
              </div>

              <div className="card-3d p-6 rounded-2xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">How We Use Your Information</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• To provide and improve our services</li>
                  <li>• To personalize your healing experience</li>
                  <li>• To analyze usage patterns and improve AI responses</li>
                  <li>• To send important service updates and notifications</li>
                  <li>• To ensure platform security and prevent fraud</li>
                </ul>
              </div>

              <div className="card-3d p-6 rounded-2xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Data Security</h3>
                <p className="text-gray-600 mb-3">We implement industry-standard security measures:</p>
                <ul className="space-y-2 text-gray-600">
                  <li>• End-to-end encryption for all sensitive data</li>
                  <li>• Secure SSL/TLS connections</li>
                  <li>• Regular security audits and updates</li>
                  <li>• Limited employee access to user data</li>
                  <li>• GDPR and HIPAA compliance</li>
                </ul>
              </div>

              <div className="card-3d p-6 rounded-2xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Your Rights</h3>
                <p className="text-gray-600 mb-3">You have the right to:</p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Access your personal data</li>
                  <li>• Correct inaccurate data</li>
                  <li>• Request deletion of your data</li>
                  <li>• Export your data</li>
                  <li>• Opt-out of marketing communications</li>
                  <li>• Withdraw consent at any time</li>
                </ul>
              </div>

              <div className="card-3d p-6 rounded-2xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Data Sharing</h3>
                <p className="text-gray-600">
                  We <strong>never</strong> sell your personal information. We only share data with:
                </p>
                <ul className="space-y-2 text-gray-600 mt-3">
                  <li>• Service providers who help us operate the platform (under strict contracts)</li>
                  <li>• Law enforcement when legally required</li>
                  <li>• With your explicit consent</li>
                </ul>
              </div>

              <div className="card-3d p-6 rounded-2xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Contact Us</h3>
                <p className="text-gray-600">
                  For privacy concerns or data requests, contact us at:<br />
                  <strong>privacy@lovedetox.com</strong>
                </p>
              </div>
            </div>
          </div>
        );

      case 'terms':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold gradient-text mb-2">Terms of Service</h2>
              <p className="text-gray-600">Last updated: November 30, 2024</p>
            </div>

            <div className="prose max-w-none space-y-6">
              <div className="card-3d p-6 rounded-2xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h3>
                <p className="text-gray-600">
                  By accessing and using LoveDetox, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                </p>
              </div>

              <div className="card-3d p-6 rounded-2xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Service Description</h3>
                <p className="text-gray-600">
                  LoveDetox provides emotional support tools, AI-powered chat, mood tracking, journaling, and community features for individuals recovering from heartbreak. Our services are for self-help purposes and do not constitute professional therapy or medical advice.
                </p>
              </div>

              <div className="card-3d p-6 rounded-2xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">3. User Responsibilities</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• You must be 18 years or older to use LoveDetox</li>
                  <li>• You are responsible for maintaining account security</li>
                  <li>• You agree to provide accurate information</li>
                  <li>• You will not misuse or abuse the platform</li>
                  <li>• You will respect other community members</li>
                </ul>
              </div>

              <div className="card-3d p-6 rounded-2xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">4. Prohibited Activities</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Harassing or threatening other users</li>
                  <li>• Sharing inappropriate or harmful content</li>
                  <li>• Attempting to hack or compromise platform security</li>
                  <li>• Using the service for commercial purposes without permission</li>
                  <li>• Impersonating others</li>
                </ul>
              </div>

              <div className="card-3d p-6 rounded-2xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">5. Subscription and Payment</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Subscriptions renew automatically unless canceled</li>
                  <li>• You can cancel anytime from your account settings</li>
                  <li>• Refunds are available within 30 days of purchase</li>
                  <li>• Prices may change with 30 days notice</li>
                </ul>
              </div>

              <div className="card-3d p-6 rounded-2xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">6. Disclaimer</h3>
                <p className="text-gray-600">
                  <strong>Important:</strong> LoveDetox is not a substitute for professional mental health care. If you are experiencing severe depression, anxiety, suicidal thoughts, or any mental health crisis, please seek immediate professional help.
                </p>
                <p className="text-gray-600 mt-3">
                  Crisis Resources:<br />
                  • National Suicide Prevention Lifeline: 1-800-273-8255<br />
                  • Crisis Text Line: Text HOME to 741741
                </p>
              </div>

              <div className="card-3d p-6 rounded-2xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">7. Limitation of Liability</h3>
                <p className="text-gray-600">
                  LoveDetox and its affiliates are not liable for any indirect, incidental, or consequential damages arising from your use of the service. Our total liability is limited to the amount you paid for the service.
                </p>
              </div>

              <div className="card-3d p-6 rounded-2xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">8. Changes to Terms</h3>
                <p className="text-gray-600">
                  We may update these terms from time to time. We will notify you of significant changes via email or platform notification. Continued use after changes constitutes acceptance.
                </p>
              </div>

              <div className="card-3d p-6 rounded-2xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">9. Contact</h3>
                <p className="text-gray-600">
                  For questions about these Terms of Service:<br />
                  <strong>legal@lovedetox.com</strong>
                </p>
              </div>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-lg">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold gradient-text mb-2">Contact Us</h2>
              <p className="text-gray-600">We're here to help you on your healing journey</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="card-3d p-6 rounded-2xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Get in Touch</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-[#6366F1]/10 to-[#8B5CF6]/10 rounded-xl">
                      <Mail className="w-6 h-6 text-[#6366F1]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                      <p className="text-gray-600">lovedetox.org@gmail.com</p>
                      <p className="text-sm text-gray-500">We respond within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-[#8B5CF6]/10 to-[#FB7185]/10 rounded-xl">
                      <Phone className="w-6 h-6 text-[#8B5CF6]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                      <p className="text-gray-600">+880(162) 569-1878</p>
                      <p className="text-sm text-gray-500">Mon-Fri, 9am-5pm PST</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-[#FB7185]/10 to-[#F472B6]/10 rounded-xl">
                      <MapPin className="w-6 h-6 text-[#FB7185]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Location</h4>
                      <p className="text-gray-600">Gulshan 2, Dhaka.</p>
                      <p className="text-sm text-gray-500">Bangladesh</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-3d p-6 rounded-2xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Send a Message</h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#6366F1] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Email</label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#6366F1] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea
                      rows={4}
                      placeholder="How can we help you?"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#6366F1] focus:outline-none resize-none transition-colors"
                    />
                  </div>
                  <button type="submit" className="w-full btn-primary">
                    Send Message
                  </button>
                </form>
              </div>
            </div>

            <div className="card-3d p-6 rounded-2xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Department Contacts</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-2">Support</h4>
                  <p className="text-sm text-gray-600">support@lovedetox.com</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-2">Privacy</h4>
                  <p className="text-sm text-gray-600">privacy@lovedetox.com</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-2">Business</h4>
                  <p className="text-sm text-gray-600">business@lovedetox.com</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-5xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="w-8" /> {/* Spacer for centering */}
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
