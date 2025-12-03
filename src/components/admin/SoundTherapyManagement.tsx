import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Play, Pause, Save, X, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import dataService from '../../services/dataService';

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
    const [audio] = useState(new Audio());

    useEffect(() => {
        loadSounds();
        return () => {
            audio.pause();
            audio.src = '';
        };
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
            audio.pause();
            setPlayingId(null);
        } else {
            audio.src = url;
            audio.play();
            setPlayingId(id);
        }
    };

    const filteredSounds = sounds.filter(sound =>
        sound.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sound.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sound Therapy Manager</h2>
                    <p className="text-gray-500 dark:text-gray-400">Manage healing sounds and music tracks</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={loadSounds}
                        className="p-2 text-gray-500 hover:text-[#6366F1] hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                        title="Refresh List"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => {
                            setCurrentSound({ category: 'relax', isPremium: false });
                            setIsEditing(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-[#6366F1] text-white rounded-xl hover:bg-[#5558DD] transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Add New Sound
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search sounds..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all"
                />
            </div>

            {/* List */}
            <div className="grid gap-4">
                {loading ? (
                    <div className="text-center py-12 text-gray-500">Loading sounds...</div>
                ) : filteredSounds.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">No sounds found</div>
                ) : (
                    filteredSounds.map((sound) => (
                        <div key={sound._id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-between group hover:shadow-md transition-all">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => togglePlay(sound.url, sound._id)}
                                    className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-[#6366F1] hover:bg-[#6366F1] hover:text-white transition-colors"
                                >
                                    {playingId === sound._id ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                                </button>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">{sound.title}</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <span className="capitalize px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                                            {sound.category}
                                        </span>
                                        {sound.isPremium && (
                                            <span className="px-2 py-0.5 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-full text-xs">
                                                Premium
                                            </span>
                                        )}
                                        <span>• {sound.duration}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => {
                                        setCurrentSound(sound);
                                        setIsEditing(true);
                                    }}
                                    className="p-2 text-gray-400 hover:text-[#6366F1] hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <Edit2 className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleDelete(sound._id)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Edit Modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg p-6 shadow-xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {currentSound._id ? 'Edit Sound' : 'Add New Sound'}
                            </h3>
                            <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={currentSound.title || ''}
                                    onChange={(e) => setCurrentSound({ ...currentSound, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-[#6366F1] outline-none"
                                    placeholder="e.g., Ocean Waves"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Audio URL</label>
                                <input
                                    type="text"
                                    value={currentSound.url || ''}
                                    onChange={(e) => setCurrentSound({ ...currentSound, url: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-[#6366F1] outline-none"
                                    placeholder="https://..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                                    <select
                                        value={currentSound.category || 'relax'}
                                        onChange={(e) => setCurrentSound({ ...currentSound, category: e.target.value as any })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-[#6366F1] outline-none"
                                    >
                                        <option value="relax">Relax</option>
                                        <option value="sleep">Sleep</option>
                                        <option value="focus">Focus</option>
                                        <option value="anxiety">Anxiety</option>
                                        <option value="nature">Nature</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration</label>
                                    <input
                                        type="text"
                                        value={currentSound.duration || ''}
                                        onChange={(e) => setCurrentSound({ ...currentSound, duration: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-[#6366F1] outline-none"
                                        placeholder="e.g., 10:00"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isPremium"
                                    checked={currentSound.isPremium || false}
                                    onChange={(e) => setCurrentSound({ ...currentSound, isPremium: e.target.checked })}
                                    className="w-4 h-4 text-[#6366F1] rounded focus:ring-[#6366F1]"
                                />
                                <label htmlFor="isPremium" className="text-sm font-medium text-gray-700 dark:text-gray-300">Premium Content</label>
                            </div>

                            <button
                                onClick={handleSave}
                                className="w-full mt-4 py-3 bg-[#6366F1] text-white rounded-xl hover:bg-[#5558DD] transition-colors font-medium flex items-center justify-center gap-2"
                            >
                                <Save className="w-5 h-5" />
                                Save Sound Track
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
