import { useState, useEffect, useRef } from 'react';
import { X, Send, MessageCircle, Bot } from 'lucide-react';
import { geminiService } from '../services/gemini';

interface GuestChatModalProps {
  onClose: () => void;
  onSignup: () => void;
}

interface Message {
  role: 'user' | 'ai';
  content: string;
}

export function GuestChatModal({ onClose, onSignup }: GuestChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content: "Hello! I'm your AI healing companion. This is a free preview - you can send up to 10 messages. How are you feeling right now?"
    }
  ]);
  const [input, setInput] = useState('');
  const [messageCount, setMessageCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }

    // Check for API Key
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      console.error('VITE_GEMINI_API_KEY is missing');
      // We don't show a toast here to avoid spamming guests, but we log it.
      // Or we could show a friendly message in the chat.
      setMessages(prev => [...prev, { role: 'ai', content: "⚠️ System Note: AI service is currently unavailable (Missing Configuration). Please contact support." }]);
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim() || messageCount >= 10) return;

    const userMessage = input.trim();
    const updatedMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(updatedMessages);
    setInput('');
    setMessageCount(prev => prev + 1);
    setIsTyping(true);

    try {
      // Filter out the initial welcome message and ensure history starts with user if possible, 
      // but mainly just exclude the current new message which is in 'updatedMessages' but not 'messages' yet.
      // Actually, 'messages' is the state before update.
      // Also filter out any initial AI message if it's the very first one, as Gemini often prefers starting with User.
      const historyMessages = messages.filter((_, index) => index > 0 || messages[0].role !== 'ai');

      const history = historyMessages.map(m => ({
        role: m.role,
        parts: m.content
      }));

      const responseText = await geminiService.generateResponse(userMessage, 'guest', history);

      const aiResponse = responseText;

      if (messageCount === 9) {
        setMessages(prev => [...prev,
        { role: 'ai', content: aiResponse },
        { role: 'ai', content: "🎯 This is your last free message! Create an account to continue our conversation and unlock unlimited AI support, daily healing tasks, mood tracking, and much more. Your healing journey is just beginning!" }
        ]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
      }
    } catch (error) {
      console.error('Gemini API Error:', error);
      setMessages(prev => [...prev, { role: 'ai', content: "I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full h-[80vh] md:h-[550px] flex flex-col relative shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-[#4B0082] font-semibold">AI Emotional Support</h4>
              <p className="text-xs md:text-sm text-gray-500">Guest Preview ({10 - messageCount} left)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.map((message, i) => (
            <div
              key={i}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] px-4 py-3 rounded-2xl ${message.role === 'user'
                  ? 'bg-gradient-to-r from-[#4B0082] to-[#FF8DAA] text-white shadow-md'
                  : 'bg-gray-100 text-gray-800'
                  }`}
                style={message.role === 'user' ? { color: 'white' } : {}}
              >
                <p className={`text-sm leading-relaxed ${message.role === 'user' ? '!text-white' : ''}`} style={message.role === 'user' ? { color: 'white' } : {}}>{message.content}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                <Bot className="w-4 h-4 text-gray-400 animate-pulse" />
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 md:p-6 border-t border-gray-200">
          {messageCount < 10 ? (
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="flex-1 min-w-0 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FF8DAA] focus:outline-none transition-colors bg-white text-gray-900 text-sm md:text-base"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="px-4 md:px-6 py-3 gradient-primary text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-600 mb-4 text-sm">Guest preview limit reached</p>
              <button
                onClick={onSignup}
                className="w-full py-3 gradient-primary text-white rounded-xl hover:opacity-90 transition-opacity font-medium"
              >
                Sign Up to Continue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}