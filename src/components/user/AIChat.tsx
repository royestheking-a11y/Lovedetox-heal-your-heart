import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../AuthContext';
import { Send, Bot, User, Sparkles, Volume2, VolumeX, Heart, Brain, Target, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { PremiumIcon } from '../PremiumIcon';
import { geminiService } from '../../services/gemini';
import { SoundEffects } from '../SoundEffects';
import dataService from '../../services/dataService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

type AiMode = 'comfort' | 'bestfriend' | 'therapist' | 'coach' | 'toughlove';

const aiModes = {
  comfort: {
    name: 'Comfort',
    icon: Heart,
    color: 'from-pink-500 to-rose-500',
    description: 'Gentle & supportive',
    responses: [
      "I understand how difficult this must be for you. Heartbreak is one of the most painful experiences we can go through.",
      "It's completely normal to feel this way. Your emotions are valid, and healing takes time.",
      "Be gentle with yourself. You're doing the best you can, and that's more than enough.",
      "Remember, it's okay to not be okay. Take all the time you need to heal.",
      "You're stronger than you know. This pain is temporary, even when it doesn't feel like it."
    ]
  },
  bestfriend: {
    name: 'Best Friend',
    icon: Sparkles,
    color: 'from-purple-500 to-pink-500',
    description: 'Casual & understanding',
    responses: [
      "Hey, I'm here for you. Want to talk about what's going on?",
      "That sounds really tough. I'm so sorry you're going through this. 💜",
      "You know what? You're amazing, and they're missing out. Their loss!",
      "Let's take this one day at a time. We'll get through this together!",
      "Remember when you thought you'd never get over that last thing? But you did! You'll get through this too."
    ]
  },
  therapist: {
    name: 'Therapist',
    icon: Brain,
    color: 'from-blue-500 to-indigo-500',
    description: 'Professional & insightful',
    responses: [
      "Let's explore these feelings. What do you think is at the root of this emotion?",
      "It's important to acknowledge that grief is a process. Where do you feel you are in that process?",
      "Your worth isn't defined by this relationship. You are complete on your own.",
      "Have you considered how this experience might help you grow and understand yourself better?",
      "The no-contact period is crucial for your healing. It allows you to rebuild your sense of self."
    ]
  },
  coach: {
    name: 'Coach',
    icon: Target,
    color: 'from-orange-500 to-amber-500',
    description: 'Motivational & action-focused',
    responses: [
      "Let's turn this pain into power! What's one action you can take today for yourself?",
      "Every day of no contact is a victory. You're reclaiming your emotional freedom!",
      "Remember your goals. You're not just healing—you're leveling up!",
      "What would the best version of yourself do right now? Let's work towards that!",
      "Progress, not perfection! Each small step forward counts. What's your next move?"
    ]
  },
  toughlove: {
    name: 'Tough Love',
    icon: Zap,
    color: 'from-red-500 to-orange-500',
    description: 'Direct & empowering',
    responses: [
      "It's time to stop dwelling and start doing. What are you going to change today?",
      "You're stronger than this. Stop giving them power over your happiness!",
      "Enough excuses. If you want to heal, you need to commit to the process. Are you ready?",
      "They're not thinking about you as much as you're thinking about them. Focus on YOU.",
      "Real talk: This relationship ended for a reason. Time to move forward, not backward."
    ]
  }
};

export function AIChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedMode, setSelectedMode] = useState<AiMode>('comfort');
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const chatLimit = user?.isPro ? Infinity : 3;

  useEffect(() => {
    if (!user) return;

    // Check for API Key
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      toast.error('Gemini API Key is missing! Please check Vercel settings and redeploy.');
      console.error('VITE_GEMINI_API_KEY is missing');
    }

    loadMessages();
    setSoundEnabled(SoundEffects.isEnabled());
    const storedMode = localStorage.getItem(`aiMode_${user.id}`);
    if (storedMode) setSelectedMode(storedMode as AiMode);
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    if (!user) return;
    try {
      const fetchedMessages = await dataService.getChatHistory();
      // Map backend messages to frontend format
      const mappedMessages = fetchedMessages.map((m: any) => ({
        id: m._id,
        text: m.content,
        sender: m.role === 'assistant' ? 'ai' : 'user',
        timestamp: m.timestamp
      }));
      setMessages(mappedMessages);
    } catch (error) {
      console.error('Error loading chat history:', error);
      toast.error('Failed to load chat history');
    }
  };

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const { scrollHeight, clientHeight } = messagesContainerRef.current;
      messagesContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: 'smooth'
      });
    }
  };

  const handleModeChange = (mode: AiMode) => {
    setSelectedMode(mode);
    if (user) {
      localStorage.setItem(`aiMode_${user.id}`, mode);
    }
    toast.success(`AI mode switched to ${aiModes[mode].name}`);
  };

  const handleSend = async () => {
    if (!input.trim() || !user) return;

    const userMessageCount = messages.filter(m => m.sender === 'user').length;
    if (!user.isPro && userMessageCount >= chatLimit) {
      toast.error('Upgrade to Pro for unlimited AI chat!');
      return;
    }

    const tempUserMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, tempUserMessage]);
    setInput('');
    setIsTyping(true);

    if (soundEnabled) SoundEffects.play('notification');

    try {
      // Save user message to backend
      await dataService.sendMessage({
        role: 'user',
        content: tempUserMessage.text
      });

      const history = messages.map(m => ({
        role: m.sender,
        parts: m.text
      }));

      const responseText = await geminiService.generateResponse(tempUserMessage.text, selectedMode, history);

      const tempAiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'ai',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, tempAiMessage]);

      // Save AI message to backend
      await dataService.sendMessage({
        role: 'assistant',
        content: responseText
      });

      if (soundEnabled) SoundEffects.play('success');
    } catch (error) {
      console.error('Failed to generate response:', error);
      toast.error('Failed to get AI response. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  const toggleSound = () => {
    SoundEffects.toggle();
    setSoundEnabled(!soundEnabled);
  };

  const userMessageCount = messages.filter(m => m.sender === 'user').length;
  const remainingMessages = user?.isPro ? Infinity : Math.max(0, chatLimit - userMessageCount);

  const currentMode = aiModes[selectedMode];

  return (
    <div className="h-[calc(100dvh-6rem)] md:h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="card-3d p-4 md:p-6 rounded-2xl mb-2 md:mb-4">
        <div className="flex items-center justify-between mb-2 md:mb-4">
          <div className="flex items-center gap-3 md:gap-4">
            <PremiumIcon Icon={Bot} size="md" variant="3d" gradient="from-[#6366F1] to-[#8B5CF6]" animate={true} />
            <div>
              <h3 className="gradient-text text-lg md:text-xl">AI Support Companion</h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Online & Ready to Help</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={toggleSound}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
            >
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {!user?.isPro && (
              <div className="hidden sm:block px-3 py-1.5 bg-gradient-to-r from-[#6366F1]/10 to-[#8B5CF6]/10 rounded-full">
                <p className="text-xs font-medium text-[#6366F1] dark:text-[#8B5CF6]">
                  {remainingMessages} messages left
                </p>
              </div>
            )}
          </div>
        </div>

        {/* AI Mode Selector */}
        <div className="grid grid-cols-5 gap-1 md:gap-2">
          {(Object.keys(aiModes) as AiMode[]).map((mode) => {
            const modeData = aiModes[mode];
            const ModeIcon = modeData.icon;
            const isSelected = selectedMode === mode;

            return (
              <button
                key={mode}
                onClick={() => handleModeChange(mode)}
                className={`p-2 md:p-3 rounded-xl transition-all duration-300 ${isSelected
                  ? 'bg-gradient-to-br ' + modeData.color + ' shadow-lg scale-105'
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
              >
                <ModeIcon className={`w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 ${isSelected ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                  }`} />
                <p className={`text-[10px] md:text-xs font-medium truncate ${isSelected ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                  }`}>
                  {modeData.name}
                </p>
              </button>
            );
          })}
        </div>

        <div className="mt-2 md:mt-3 text-center hidden sm:block">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            <span className="font-medium text-gray-700 dark:text-gray-300">{currentMode.name} Mode:</span> {currentMode.description}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div ref={messagesContainerRef} className="flex-1 card-3d rounded-2xl p-4 md:p-6 overflow-y-auto space-y-4 mb-2 md:mb-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-md">
              <PremiumIcon
                Icon={Sparkles}
                size="xl"
                variant="3d"
                gradient="from-[#6366F1] to-[#8B5CF6]"
                animate={true}
              />
              <h4 className="text-gray-900 dark:text-white mt-6 mb-2">Start Your Conversation</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                I'm here to listen and support you through your healing journey. Share what's on your mind.
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => setInput("I'm struggling with moving on...")}
                  className="w-full p-3 text-left text-sm border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-[#6366F1] hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-gray-700 dark:text-gray-300"
                >
                  💭 I'm struggling with moving on...
                </button>
                <button
                  onClick={() => setInput("I keep thinking about them...")}
                  className="w-full p-3 text-left text-sm border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-[#6366F1] hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-gray-700 dark:text-gray-300"
                >
                  💔 I keep thinking about them...
                </button>
                <button
                  onClick={() => setInput("How do I stop the pain?")}
                  className="w-full p-3 text-left text-sm border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-[#6366F1] hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-gray-700 dark:text-gray-300"
                >
                  😢 How do I stop the pain?
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                {message.sender === 'ai' && (
                  <div className={`w-8 h-8 md:w-11 md:h-11 rounded-full bg-gradient-to-br ${currentMode.color} flex items-center justify-center flex-shrink-0 shadow-lg ring-2 ring-white dark:ring-gray-800 relative`}>
                    {/* Cute Robot Face */}
                    <div className="relative transform scale-75 md:scale-100">
                      <Bot className="w-6 h-6 text-white" />
                      {/* Robot antenna */}
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-white/50 rounded-full" />
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    </div>
                  </div>
                )}
                <div
                  className={`max-w-[85%] md:max-w-[70%] p-3 md:p-4 rounded-2xl shadow-md backdrop-blur-sm ${message.sender === 'user'
                    ? 'bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] shadow-purple-500/20'
                    : 'bg-white/80 dark:bg-gray-700/80 shadow-gray-200/50 dark:shadow-gray-900/50'
                    }`}
                >
                  <p className={`text-sm leading-relaxed ${message.sender === 'user' ? 'text-white' : 'text-gray-900 dark:text-white'
                    }`} style={message.sender === 'user' ? { color: '#ffffff !important' } : {}}>{message.text}</p>
                  <p className={`text-[10px] md:text-xs mt-1 md:mt-2 ${message.sender === 'user' ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                {message.sender === 'user' && (
                  <div className="w-8 h-8 md:w-11 md:h-11 rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center flex-shrink-0 shadow-lg ring-2 ring-white dark:ring-gray-800">
                    <User className="w-4 h-4 md:w-6 md:h-6 text-white" />
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3 justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className={`w-8 h-8 md:w-11 md:h-11 rounded-full bg-gradient-to-br ${currentMode.color} flex items-center justify-center flex-shrink-0 shadow-lg ring-2 ring-white dark:ring-gray-800 relative`}>
                  {/* Cute Robot Face */}
                  <div className="relative transform scale-75 md:scale-100">
                    <Bot className="w-6 h-6 text-white animate-pulse" />
                    {/* Robot antenna */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-white/50 rounded-full" />
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  </div>
                </div>
                <div className="max-w-[70%] p-4 rounded-2xl bg-white/80 dark:bg-gray-700/80 shadow-md backdrop-blur-sm">
                  <div className="flex gap-1">
                    <div className="w-2.5 h-2.5 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2.5 h-2.5 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2.5 h-2.5 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

          </>
        )}
      </div>

      {/* Input */}
      <div className="card-3d p-3 md:p-4 rounded-2xl">
        <div className="flex gap-2 md:gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-[#8B5CF6] focus:outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="btn-primary px-4 md:px-6 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}