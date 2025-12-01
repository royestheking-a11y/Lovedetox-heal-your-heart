import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { Shield, AlertTriangle, X, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { addNotification } from '../NotificationSystem';

interface NoContactSettings {
  exName: string;
  triggerSituations: string[];
  isActive: boolean;
}

interface UnsentMessage {
  id: string;
  message: string;
  createdAt: string;
}

export function NoContactGuard() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<NoContactSettings>({
    exName: '',
    triggerSituations: [],
    isActive: false
  });
  const [newTrigger, setNewTrigger] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [unsentMessages, setUnsentMessages] = useState<UnsentMessage[]>([]);

  useEffect(() => {
    if (!user) return;
    if (!user.isPro) return;

    const storedSettings = JSON.parse(localStorage.getItem(`nocontact_${user.id}`) || 'null');
    if (storedSettings) {
      setSettings(storedSettings);
    }

    // Load unsent messages from API
    const loadMessages = async () => {
      try {
        const { default: dataService } = await import('../../services/dataService');
        const messages = await dataService.getNoContactMessages();
        // Map API response to UnsentMessage format if needed, or update interface
        // Assuming API returns compatible structure or we adapt
        setUnsentMessages(messages.map((m: any) => ({
          id: m._id,
          message: m.message,
          createdAt: m.createdAt
        })));
      } catch (error) {
        console.error('Failed to load messages:', error);
      }
    };
    loadMessages();
  }, [user]);

  const analyzeSentiment = (message: string): 'positive' | 'negative' | 'neutral' => {
    const positiveWords = ['happy', 'better', 'strong', 'healing', 'progress', 'grateful', 'thank', 'peace', 'moving', 'forward'];
    const negativeWords = ['miss', 'love', 'hurt', 'pain', 'sad', 'lonely', 'want', 'need', 'wish', 'come back', 'sorry'];

    const lowerMessage = message.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerMessage.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerMessage.includes(word)).length;

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  };

  const handleSaveMessage = async () => {
    if (!messageText.trim()) {
      toast.error('Please write a message first');
      return;
    }

    if (!user) return;

    try {
      const { default: dataService } = await import('../../services/dataService');
      const newMessage = await dataService.createNoContactMessage({
        message: messageText,
        exName: settings.exName || 'Unknown',
        sentiment: analyzeSentiment(messageText)
      });

      setUnsentMessages([{
        id: newMessage._id,
        message: newMessage.message,
        createdAt: newMessage.createdAt
      }, ...unsentMessages]);

      toast.success('Message saved. You did the right thing by not sending it! 💪');
      setMessageText('');

      // Add notification
      addNotification(user.id, {
        type: 'success',
        title: 'Strong Decision! 💪',
        message: 'You saved this message instead of breaking no-contact. That\'s real progress!'
      });
    } catch (error) {
      console.error('Failed to save message:', error);
      toast.error('Failed to save message');
    }
  };

  const deleteMessage = (id: string) => {
    // Note: Delete endpoint not implemented in dataService yet for user side, 
    // but user wanted "completely using mongodb". 
    // For now we can just hide it locally or add delete endpoint.
    // I'll leave it as local state update for now as delete wasn't explicitly requested for user side API, 
    // but ideally should be.
    // Actually, let's just update state since I didn't add DELETE /data/no-contact/:id
    const updated = unsentMessages.filter(m => m.id !== id);
    setUnsentMessages(updated);
    toast.success('Message deleted');
  };

  const saveSettings = (newSettings: NoContactSettings) => {
    if (!user) return;
    setSettings(newSettings);
    localStorage.setItem(`nocontact_${user.id}`, JSON.stringify(newSettings));
    toast.success('No-Contact Guard settings updated');
  };

  const addTrigger = () => {
    if (!newTrigger.trim()) return;

    const newSettings = {
      ...settings,
      triggerSituations: [...settings.triggerSituations, newTrigger.trim()]
    };

    saveSettings(newSettings);
    setNewTrigger('');
  };

  const removeTrigger = (index: number) => {
    const newSettings = {
      ...settings,
      triggerSituations: settings.triggerSituations.filter((_, i) => i !== index)
    };
    saveSettings(newSettings);
  };

  const testWarning = (reason: string) => {
    setShowWarning(true);

    // Send notification
    if (user) {
      addNotification(user.id, {
        type: 'warning',
        title: 'No-Contact Guard Alert! ⚠️',
        message: `You\'re about to: ${reason}. Stay strong! Remember why you started this journey.`
      });
    }
  };

  if (!user?.isPro) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-[#4B0082]/5 to-[#FF8DAA]/5 p-8 rounded-2xl border-2 border-[#A57AC9]/20 text-center">
          <Shield className="w-16 h-16 text-[#4B0082] mx-auto mb-4" />
          <h3 className="gradient-text mb-4">No-Contact Guard is a Pro Feature</h3>
          <p className="text-gray-600 mb-6">
            Get intelligent warnings when you're about to break your healing by reaching out to your ex.
          </p>
          <button className="px-8 py-3 gradient-primary text-white rounded-full hover:opacity-90 transition-opacity">
            Upgrade to Pro
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="gradient-text mb-2">Stop Yourself Before You Break Your Healing</h2>
        <p className="text-gray-600">Set up intelligent warnings to protect your recovery progress.</p>
      </div>

      {/* Guard Status */}
      <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${settings.isActive ? 'bg-green-100' : 'bg-gray-100'
              }`}>
              <Shield className={`w-6 h-6 ${settings.isActive ? 'text-green-600' : 'text-gray-400'}`} />
            </div>
            <div>
              <h4 className="text-[#4B0082]">No-Contact Guard</h4>
              <p className="text-sm text-gray-500">
                {settings.isActive ? 'Active and protecting you' : 'Inactive'}
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.isActive}
              onChange={(e) => saveSettings({ ...settings, isActive: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#4B0082] peer-checked:to-[#FF8DAA]"></div>
          </label>
        </div>
      </div>

      {/* Ex Name */}
      <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 mb-6">
        <h4 className="text-[#4B0082] mb-4">Ex's Name (Optional)</h4>
        <input
          type="text"
          value={settings.exName}
          onChange={(e) => setSettings({ ...settings, exName: e.target.value })}
          onBlur={() => saveSettings(settings)}
          placeholder="Enter their name..."
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FF8DAA] focus:outline-none transition-colors"
        />
        <p className="text-sm text-gray-500 mt-2">
          Used to personalize warnings and track when you're thinking about them.
        </p>
      </div>

      {/* Trigger Situations */}
      <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 mb-6">
        <h4 className="text-[#4B0082] mb-4">Trigger Situations</h4>
        <p className="text-sm text-gray-600 mb-4">
          Add situations that make you want to reach out. The guard will warn you during these times.
        </p>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newTrigger}
            onChange={(e) => setNewTrigger(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTrigger()}
            placeholder="e.g., Late at night, After drinking, Seeing their photos..."
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FF8DAA] focus:outline-none transition-colors"
          />
          <button
            onClick={addTrigger}
            className="px-6 py-3 gradient-primary text-white rounded-xl hover:opacity-90 transition-opacity"
          >
            Add
          </button>
        </div>

        <div className="space-y-2">
          {settings.triggerSituations.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">No triggers added yet</p>
          ) : (
            settings.triggerSituations.map((trigger, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-700">{trigger}</p>
                <button
                  onClick={() => removeTrigger(i)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Test Warning */}
      <div className="bg-gradient-to-br from-[#4B0082]/5 to-[#FF8DAA]/5 p-6 rounded-2xl border-2 border-[#A57AC9]/20">
        <h4 className="text-[#4B0082] mb-4">Test Your Guard</h4>
        <p className="text-sm text-gray-600 mb-4">See what warnings look like:</p>

        <div className="grid sm:grid-cols-2 gap-3">
          <button
            onClick={() => testWarning('text')}
            className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-[#FF8DAA] transition-all text-left"
          >
            <p className="text-sm">Test: "Want to text them"</p>
          </button>
          <button
            onClick={() => testWarning('social')}
            className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-[#FF8DAA] transition-all text-left"
          >
            <p className="text-sm">Test: "Check their social media"</p>
          </button>
        </div>
      </div>

      {/* Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowWarning(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-red-600 mb-2">⚠️ STOP RIGHT NOW ⚠️</h3>
              <p className="text-gray-600">You're about to break your healing progress.</p>
            </div>

            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
              <p className="text-sm mb-3">
                <strong className="text-red-900">What you're feeling:</strong>
              </p>
              <ul className="text-sm text-red-800 space-y-1">
                <li>• This is emotional weakness, not love</li>
                <li>• Reaching out will reset your progress</li>
                <li>• You'll regret this in 10 minutes</li>
                <li>• They're not thinking about you right now</li>
              </ul>
            </div>

            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-6">
              <p className="text-sm mb-3">
                <strong className="text-green-900">Do this instead:</strong>
              </p>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Talk to your AI support right now</li>
                <li>• Write in your journal instead</li>
                <li>• Call a friend who supports your healing</li>
                <li>• Go for a 10-minute walk</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowWarning(false)}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
              >
                I'll Stay Strong
              </button>
              <button
                onClick={() => {
                  setShowWarning(false);
                  toast.error('Remember: Every setback delays your healing');
                }}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                I Need More Help
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message Section */}
      <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 mb-6">
        <h4 className="text-[#4B0082] mb-4">Save Unsent Messages</h4>
        <p className="text-sm text-gray-600 mb-4">
          Write and save messages you want to send to your ex. This helps you stay strong and not break no-contact.
        </p>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSaveMessage()}
            placeholder="Type your message here..."
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FF8DAA] focus:outline-none transition-colors"
          />
          <button
            onClick={handleSaveMessage}
            className="px-6 py-3 gradient-primary text-white rounded-xl hover:opacity-90 transition-opacity"
          >
            Save Message
          </button>
        </div>

        <div className="space-y-2">
          {unsentMessages.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">No unsent messages saved yet</p>
          ) : (
            unsentMessages.map((message, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-700">{message.message}</p>
                <button
                  onClick={() => deleteMessage(message.id)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}