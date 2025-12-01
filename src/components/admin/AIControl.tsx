import { useState } from 'react';
import { Sliders } from 'lucide-react';
import { toast } from 'sonner';

export function AIControl() {
  const [settings, setSettings] = useState({
    empathy: 75,
    directness: 50,
    motivationLevel: 60,
    crisisDetection: 80,
    responseLength: 'medium'
  });

  const saveSettings = () => {
    localStorage.setItem('aiSettings', JSON.stringify(settings));
    toast.success('AI settings updated');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="gradient-text mb-2">AI Emotional Behavior Control</h2>
        <p className="text-gray-600">Configure how the AI responds to users</p>
      </div>

      <div className="bg-white p-8 rounded-2xl border-2 border-gray-100 space-y-8">
        <div>
          <label className="flex items-center justify-between mb-3">
            <span className="text-gray-900">Empathy Level</span>
            <span className="gradient-text">{settings.empathy}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={settings.empathy}
            onChange={(e) => setSettings({ ...settings, empathy: Number(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FF8DAA]"
          />
          <p className="text-sm text-gray-500 mt-2">How emotionally supportive the AI should be</p>
        </div>

        <div>
          <label className="flex items-center justify-between mb-3">
            <span className="text-gray-900">Directness</span>
            <span className="gradient-text">{settings.directness}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={settings.directness}
            onChange={(e) => setSettings({ ...settings, directness: Number(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FF8DAA]"
          />
          <p className="text-sm text-gray-500 mt-2">How direct and honest the AI should be</p>
        </div>

        <div>
          <label className="flex items-center justify-between mb-3">
            <span className="text-gray-900">Motivation Level</span>
            <span className="gradient-text">{settings.motivationLevel}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={settings.motivationLevel}
            onChange={(e) => setSettings({ ...settings, motivationLevel: Number(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FF8DAA]"
          />
          <p className="text-sm text-gray-500 mt-2">How motivational and action-focused the AI should be</p>
        </div>

        <div>
          <label className="flex items-center justify-between mb-3">
            <span className="text-gray-900">Crisis Detection Sensitivity</span>
            <span className="gradient-text">{settings.crisisDetection}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={settings.crisisDetection}
            onChange={(e) => setSettings({ ...settings, crisisDetection: Number(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FF8DAA]"
          />
          <p className="text-sm text-gray-500 mt-2">How sensitive the AI should be to crisis situations</p>
        </div>

        <div>
          <label className="block text-gray-900 mb-3">Response Length</label>
          <div className="grid grid-cols-3 gap-3">
            {['short', 'medium', 'long'].map(length => (
              <button
                key={length}
                onClick={() => setSettings({ ...settings, responseLength: length })}
                className={`px-4 py-3 rounded-xl border-2 transition-all capitalize ${
                  settings.responseLength === length
                    ? 'border-[#FF8DAA] bg-gradient-to-br from-[#4B0082]/5 to-[#FF8DAA]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {length}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={saveSettings}
          className="w-full px-6 py-3 gradient-primary text-white rounded-xl hover:opacity-90 transition-opacity"
        >
          <Sliders className="w-5 h-5 inline-block mr-2" />
          Save AI Settings
        </button>
      </div>
    </div>
  );
}
