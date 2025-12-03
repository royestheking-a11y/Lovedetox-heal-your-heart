import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Play, Pause, Save, X, RefreshCw, Music, BarChart3, Sparkles, Headphones } from 'lucide-react';
import { toast } from 'sonner';
import dataService from '../../services/dataService';
import ReactPlayer from 'react-player';

interface SoundTrack {
    _id: string;
    title: string;
    url: string;
    category: 'sleep' | 'focus' | 'anxiety' | 'nature' | 'relax';
    isPremium: boolean;
    duration: string;
    imageUrl: string;
}

export function SoundTherapyManagement() {
    const [sounds, setSounds] = useState<SoundTrack[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentSound, setCurrentSound] = useState<Partial<SoundTrack>>({});
    const [playingId, setPlayingId] = useState<string | null>(null);
    const [playingUrl, setPlayingUrl] = useState<string | null>(null);

    useEffect(() => {
        loadSounds();
    }, []);

    const loadSounds = async () => {
        try {
            const data = await dataService.getSounds();
            setSounds(data);
        } catch (error) {
            toast.error('Failed to load sounds');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            if (!currentSound.title || !currentSound.url || !currentSound.category) {
                toast.error('Please fill in all required fields');
                return;
            }

            if (currentSound._id) {
                await dataService.updateSound(currentSound._id, currentSound);
                toast.success('Sound updated successfully');
            } else {
                await dataService.createSound(currentSound);
                toast.success('Sound created successfully');
            }

            setIsEditing(false);
            setCurrentSound({});
            loadSounds();
        } catch (error) {
            toast.error('Failed to save sound');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this sound?')) {
            try {
                await dataService.deleteSound(id);
                toast.success('Sound deleted successfully');
                loadSounds();
            } catch (error) {
                toast.error('Failed to delete sound');
            }
        }
    };

    const togglePlay = (url: string, id: string) => {
        if (playingId === id) {
            setPlayingId(null);
            setPlayingUrl(null);
        } else {
            setPlayingUrl(url);
            setPlayingId(id);
        }
    };

    const filteredSounds = sounds.filter(sound =>
        sound.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sound.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Stats
    const totalSounds = sounds.length;
    const premiumSounds = sounds.filter(s => s.isPremium).length;
    const categories = Array.from(new Set(sounds.map(s => s.category))).length;

    // Cast to any to avoid missing type definition error
    const Player = ReactPlayer as any;

    const [isReady, setIsReady] = useState(false);

    // Reset ready state when track changes
    useEffect(() => {
        setIsReady(false);
    }, [playingUrl]);

    return (
        <div className="space-y-8">
            {/* Hidden Player for Preview */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '1px',
                height: '1px',
                opacity: 0.01,
                pointerEvents: 'none',
                zIndex: -1,
                overflow: 'hidden'
            }}>
                <Player
                    url={playingUrl || ''}
                    playing={!!playingId && isReady}
                    width="100%"
                    height="100%"
                    playsinline={true}
                    onReady={() => setIsReady(true)}
                    onEnded={() => {
                        setPlayingId(null);
                        setPlayingUrl(null);
                    }}
                    onError={() => {
                        // Only show error if we actually tried to play and failed
                        if (playingId) {
                            toast.error("Could not play this track. Check URL.");
                            setPlayingId(null);
                            setPlayingUrl(null);
                        }
                    }}
                    config={{
                        youtube: {
                            playerVars: {
                                showinfo: 0,
                                controls: 0,
                                playsinline: 1,
                                origin: window.location.origin,
                                rel: 0,
                                modestbranding: 1,
                                iv_load_policy: 3
                            }
                        }
                    }}
                />
            </div>

            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-transparent bg-clip-text">
                        Sound Therapy Manager
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Curate your healing audio library</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={loadSounds}
                        className="p-3 text-gray-500 hover:text-[#6366F1] bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-700 transition-all shadow-sm"
                        title="Refresh List"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => {
                            setCurrentSound({ category: 'relax', isPremium: false });
                            setIsEditing(true);
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all font-medium"
                    >
                        <Plus className="w-5 h-5" />
                        Add New Sound
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <Music className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Tracks</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{totalSounds}</h3>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Premium Content</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{premiumSounds}</h3>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <BarChart3 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Categories</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{categories}</h3>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search by title or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all shadow-sm"
                />
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full text-center py-20 text-gray-500">
                        <div className="animate-spin w-8 h-8 border-4 border-[#6366F1] border-t-transparent rounded-full mx-auto mb-4"></div>
                        Loading your sound library...
                    </div>
                ) : filteredSounds.length === 0 ? (
                    <div className="col-span-full text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
                        <Headphones className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No sounds found</p>
                        <button
                            onClick={() => {
                                setCurrentSound({ category: 'relax', isPremium: false });
                                setIsEditing(true);
                            }}
                            className="mt-4 text-[#6366F1] font-medium hover:underline"
                        >
                            Create your first track
                        </button>
                    </div>
                ) : (
                    filteredSounds.map((sound) => (
                        <div key={sound._id} className="group bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${sound.category === 'sleep' ? 'from-indigo-400 to-purple-600' :
                                        sound.category === 'nature' ? 'from-green-400 to-emerald-600' :
                                            sound.category === 'focus' ? 'from-blue-400 to-cyan-600' :
                                                'from-pink-400 to-rose-600'
                                        } shadow-lg text-white`}>
                                        <Music className="w-7 h-7" />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setCurrentSound(sound);
                                                setIsEditing(true);
                                            }}
                                            className="p-2 text-gray-400 hover:text-[#6366F1] hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(sound._id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 truncate">{sound.title}</h3>
                                <div className="flex items-center gap-2 mb-6">
                                    <span className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                                        {sound.category}
                                    </span>
                                    {sound.isPremium && (
                                        <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-200 to-yellow-400 text-yellow-900 text-xs font-bold flex items-center gap-1">
                                            <Sparkles className="w-3 h-3" /> PRO
                                        </span>
                                    )}
                                    <span className="text-xs text-gray-400">• {sound.duration}</span>
                                </div>

                                <button
                                    onClick={() => togglePlay(sound.url, sound._id)}
                                    className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-medium transition-all ${playingId === sound._id
                                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                        : 'bg-[#6366F1]/10 text-[#6366F1] hover:bg-[#6366F1] hover:text-white'
                                        }`}
                                >
                                    {playingId === sound._id ? (
                                        <>
                                            <Pause className="w-5 h-5" /> Pause
                                        </>
                                    ) : (
                                        <>
                                            <Play className="w-5 h-5" /> Play Preview
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Edit Modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-lg p-8 shadow-2xl border border-gray-100 dark:border-gray-700 scale-100 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {currentSound._id ? 'Edit Track' : 'New Track'}
                                </h3>
                                <p className="text-gray-500 text-sm mt-1">Enter the details for this sound therapy session</p>
                            </div>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Track Title</label>
                                <input
                                    type="text"
                                    value={currentSound.title || ''}
                                    onChange={(e) => setCurrentSound({ ...currentSound, title: e.target.value })}
                                    className="w-full px-5 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all"
                                    placeholder="e.g., Midnight Rain"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Audio URL</label>
                                <input
                                    type="text"
                                    value={currentSound.url || ''}
                                    onChange={(e) => setCurrentSound({ ...currentSound, url: e.target.value })}
                                    className="w-full px-5 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all"
                                    placeholder="https://..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Category</label>
                                    <select
                                        value={currentSound.category || 'relax'}
                                        onChange={(e) => setCurrentSound({ ...currentSound, category: e.target.value as any })}
                                        className="w-full px-5 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all appearance-none"
                                    >
                                        <option value="relax">Relax</option>
                                        <option value="sleep">Sleep</option>
                                        <option value="focus">Focus</option>
                                        <option value="anxiety">Anxiety</option>
                                        <option value="nature">Nature</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Duration</label>
                                    <input
                                        type="text"
                                        value={currentSound.duration || ''}
                                        onChange={(e) => setCurrentSound({ ...currentSound, duration: e.target.value })}
                                        className="w-full px-5 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all"
                                        placeholder="e.g., 10:00"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-700">
                                <input
                                    type="checkbox"
                                    id="isPremium"
                                    checked={currentSound.isPremium || false}
                                    onChange={(e) => setCurrentSound({ ...currentSound, isPremium: e.target.checked })}
                                    className="w-5 h-5 text-[#6366F1] rounded focus:ring-[#6366F1] border-gray-300"
                                />
                                <label htmlFor="isPremium" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none">
                                    Mark as Premium Content
                                </label>
                                <Sparkles className="w-4 h-4 text-amber-400 ml-auto" />
                            </div>

                            <button
                                onClick={handleSave}
                                className="w-full mt-2 py-4 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all font-bold text-lg flex items-center justify-center gap-2"
                            >
                                <Save className="w-5 h-5" />
                                Save Track
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
