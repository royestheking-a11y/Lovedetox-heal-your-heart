import { useState } from 'react';
import { Mail, Send, Trash2, Eye, EyeOff, Lock, Heart, FileText, Sparkles } from 'lucide-react';
import { SoundEffects } from '../SoundEffects';
import { toast } from 'sonner';
import { useAuth } from '../AuthContext';

interface Letter {
  id: string;
  title: string;
  content: string;
  to: string;
  type: 'unsent' | 'closure' | 'gratitude' | 'anger' | 'forgiveness';
  createdAt: string;
  locked: boolean;
}

const letterTypes = [
  {
    type: 'unsent' as const,
    name: 'Unsent Letter',
    description: 'Express what you never got to say',
    icon: Mail,
    gradient: 'from-[#6366F1] to-[#8B5CF6]',
    color: '#6366F1'
  },
  {
    type: 'closure' as const,
    name: 'Closure Letter',
    description: 'Find peace by writing your goodbye',
    icon: FileText,
    gradient: 'from-[#8B5CF6] to-[#FB7185]',
    color: '#8B5CF6'
  },
  {
    type: 'anger' as const,
    name: 'Anger Release',
    description: 'Let out your frustration safely',
    icon: Sparkles,
    gradient: 'from-[#FB7185] to-[#F472B6]',
    color: '#FB7185'
  },
  {
    type: 'forgiveness' as const,
    name: 'Forgiveness Letter',
    description: 'Release resentment, find freedom',
    icon: Heart,
    gradient: 'from-[#6366F1] to-[#8B5CF6]',
    color: '#6366F1'
  },
  {
    type: 'gratitude' as const,
    name: 'Gratitude Letter',
    description: 'Remember the good, honor the lessons',
    icon: Heart,
    gradient: 'from-[#8B5CF6] to-[#FB7185]',
    color: '#8B5CF6'
  }
];

export function LetterTherapy() {
  const { user } = useAuth();
  const [letters, setLetters] = useState<Letter[]>(() => {
    const stored = localStorage.getItem(`letters_${user?.email}`);
    return stored ? JSON.parse(stored) : [];
  });
  const [isWriting, setIsWriting] = useState(false);
  const [selectedType, setSelectedType] = useState(letterTypes[0]);
  const [title, setTitle] = useState('');
  const [to, setTo] = useState('');
  const [content, setContent] = useState('');
  const [viewingLetter, setViewingLetter] = useState<Letter | null>(null);
  const [showContent, setShowContent] = useState<{ [key: string]: boolean }>({});

  const saveLetters = (updatedLetters: Letter[]) => {
    localStorage.setItem(`letters_${user?.email}`, JSON.stringify(updatedLetters));
    setLetters(updatedLetters);
  };

  const handleSaveLetter = () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in title and content');
      return;
    }

    const newLetter: Letter = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      to: to.trim() || 'Someone who mattered',
      type: selectedType.type,
      createdAt: new Date().toISOString(),
      locked: false
    };

    saveLetters([...letters, newLetter]);
    SoundEffects.play('success');
    toast.success('Letter saved. It will never be sent—this is just for you.');
    
    setTitle('');
    setTo('');
    setContent('');
    setIsWriting(false);
  };

  const handleDeleteLetter = (id: string) => {
    if (confirm('Are you sure you want to delete this letter?')) {
      saveLetters(letters.filter(l => l.id !== id));
      SoundEffects.play('click');
      toast.success('Letter deleted');
      setViewingLetter(null);
    }
  };

  const handleToggleLock = (id: string) => {
    saveLetters(letters.map(l => 
      l.id === id ? { ...l, locked: !l.locked } : l
    ));
    SoundEffects.play('click');
  };

  const getTypeInfo = (type: Letter['type']) => {
    return letterTypes.find(t => t.type === type) || letterTypes[0];
  };

  if (viewingLetter) {
    const typeInfo = getTypeInfo(viewingLetter.type);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setViewingLetter(null)}
            className="mb-6 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            ← Back to Letters
          </button>

          <div className="card-3d p-8 rounded-3xl">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${typeInfo.gradient} flex items-center justify-center shadow-lg`}>
                  <typeInfo.icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-gray-900 dark:text-white mb-1">{viewingLetter.title}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    To: {viewingLetter.to} • {new Date(viewingLetter.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleLock(viewingLetter.id)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title={viewingLetter.locked ? 'Unlock letter' : 'Lock letter'}
                >
                  <Lock className={`w-5 h-5 ${viewingLetter.locked ? 'text-[#6366F1]' : 'text-gray-400'}`} />
                </button>
                <button
                  onClick={() => handleDeleteLetter(viewingLetter.id)}
                  className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  title="Delete letter"
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>
              </div>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
                {viewingLetter.content}
              </div>
            </div>

            <div className="mt-8 p-4 bg-gradient-to-r from-[#6366F1]/10 to-[#8B5CF6]/10 rounded-xl border border-[#6366F1]/20">
              <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
                💌 This letter is safe with you. It was written for healing, not sending.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isWriting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setIsWriting(false)}
            className="mb-6 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            ← Back
          </button>

          <div className="card-3d p-8 rounded-3xl">
            <h2 className="gradient-text mb-6">Write Your {selectedType.name}</h2>

            {/* Letter Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Letter Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {letterTypes.map((type) => (
                  <button
                    key={type.type}
                    onClick={() => setSelectedType(type)}
                    className={`p-3 rounded-xl text-center transition-all ${
                      selectedType.type === type.type
                        ? `bg-gradient-to-r ${type.gradient} text-white shadow-lg`
                        : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <type.icon className={`w-6 h-6 mx-auto mb-2 ${
                      selectedType.type === type.type ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                    }`} />
                    <div className={`text-xs font-semibold ${
                      selectedType.type === type.type ? 'text-white' : 'text-gray-900 dark:text-white'
                    }`}>
                      {type.name.split(' ')[0]}
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {selectedType.description}
              </p>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Letter Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give this letter a title..."
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-[#6366F1] focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  To (Optional)
                </label>
                <input
                  type="text"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="Who is this letter for?"
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-[#6366F1] focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Your Letter
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write from your heart. This letter will never be sent—it's just for you to process your feelings..."
                  rows={12}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-[#6366F1] focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                />
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {content.length} characters
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSaveLetter}
                  className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Save Letter
                </button>
                <button
                  onClick={() => setIsWriting(false)}
                  className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                ⚠️ <strong>Remember:</strong> This letter will NEVER be sent. It's a safe space for you to express yourself honestly.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-lg icon-3d">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="gradient-text">Letter Therapy</h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Write letters you'll never send to process your emotions safely
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsWriting(true);
              SoundEffects.play('click');
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Mail className="w-5 h-5" />
            Write New Letter
          </button>
        </div>

        {/* Letters Grid */}
        {letters.length === 0 ? (
          <div className="card-3d p-12 rounded-3xl text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#6366F1]/10 to-[#8B5CF6]/10 flex items-center justify-center mx-auto mb-6">
                <Mail className="w-10 h-10 text-[#6366F1]" />
              </div>
              <h3 className="text-gray-900 dark:text-white mb-3">No Letters Yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Writing unsent letters is a powerful way to express emotions, find closure, and heal. Start your first letter today.
              </p>
              <button
                onClick={() => setIsWriting(true)}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Write Your First Letter
              </button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {letters.map((letter) => {
              const typeInfo = getTypeInfo(letter.type);
              const isContentVisible = showContent[letter.id];
              
              return (
                <div key={letter.id} className="card-3d p-6 rounded-2xl hover:shadow-xl transition-all">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${typeInfo.gradient} flex items-center justify-center flex-shrink-0`}>
                      <typeInfo.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-gray-900 dark:text-white mb-1 truncate">{letter.title}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        To: {letter.to}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {new Date(letter.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {letter.locked && (
                      <Lock className="w-4 h-4 text-[#6366F1] flex-shrink-0" />
                    )}
                  </div>

                  <div className="mb-4">
                    <div className={`text-sm text-gray-600 dark:text-gray-400 line-clamp-3 ${
                      !isContentVisible && 'blur-sm select-none'
                    }`}>
                      {letter.content}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setViewingLetter(letter)}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-full text-sm font-semibold hover:shadow-lg transition-all"
                    >
                      Read Full Letter
                    </button>
                    <button
                      onClick={() => setShowContent(prev => ({ ...prev, [letter.id]: !prev[letter.id] }))}
                      className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      title={isContentVisible ? 'Hide preview' : 'Show preview'}
                    >
                      {isContentVisible ? (
                        <EyeOff className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Info Card */}
        <div className="mt-8 card-3d p-6 rounded-2xl bg-gradient-to-r from-[#6366F1]/5 to-[#8B5CF6]/5">
          <h4 className="text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#6366F1]" />
            Why Letter Therapy Works
          </h4>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-[#6366F1] mt-0.5">✓</span>
              <span>Helps you organize chaotic thoughts and emotions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#6366F1] mt-0.5">✓</span>
              <span>Provides closure without needing to actually send the letter</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#6366F1] mt-0.5">✓</span>
              <span>Safe way to express anger, grief, or love without consequences</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#6366F1] mt-0.5">✓</span>
              <span>Proven therapeutic technique used by professionals worldwide</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
