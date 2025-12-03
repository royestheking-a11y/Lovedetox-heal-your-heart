import { useState, useEffect } from 'react';
import { Play, Pause, Volume2, CloudRain, Waves, Trees, Wind, Moon, Coffee, Music } from 'lucide-react';
import dataService from '../../services/dataService';
import { toast } from 'sonner';
import ReactPlayer from 'react-player';

interface SoundTrack {
    _id: string;
    title: string;
    category: 'nature' | 'focus' | 'sleep' | 'anxiety' | 'relax';
    url: string;
    isPremium: boolean;
    duration: string;
    imageUrl?: string;
}

const getIconForCategory = (category: string) => {
    switch (category) {
        case 'nature': return Trees;
        case 'rain': return CloudRain;
        case 'water': return Waves;
        case 'focus': return Wind;
        case 'sleep': return Moon;
        case 'anxiety': return Waves;
        case 'relax': return Coffee;
        default: return Music;
    }
};

const getColorForCategory = (category: string) => {
    switch (category) {
        case 'nature': return 'from-green-400 to-emerald-600';
        case 'rain': return 'from-blue-400 to-blue-600';
        case 'water': return 'from-cyan-400 to-blue-500';
        case 'focus': return 'from-gray-400 to-gray-600';
        case 'sleep': return 'from-indigo-400 to-purple-600';
        case 'anxiety': return 'from-cyan-300 to-blue-400';
        default: return 'from-purple-400 to-pink-600';
    }
};

// Cast to any to avoid missing type definition error
const Player = ReactPlayer as any;

export function SoundTherapy() {
    const [tracks, setTracks] = useState<SoundTrack[]>([]);
    const [activeTrack, setActiveTrack] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [loading, setLoading] = useState(true);
    const [isBuffering, setIsBuffering] = useState(false);

    useEffect(() => {
        loadSounds();
    }, []);

    const loadSounds = async () => {
        try {
            const data = await dataService.getSounds();
            setTracks(data);
        } catch (error) {
            console.error('Failed to load sounds:', error);
            toast.error('Failed to load sound library');
        } finally {
            setLoading(false);
        }
    };

    const togglePlay = (trackId: string) => {
        if (activeTrack === trackId) {
            setIsPlaying(!isPlaying);
        } else {
            setActiveTrack(trackId);
            setIsPlaying(true);
        }
    };

    const currentTrack = tracks.find(t => t._id === activeTrack);
    const CurrentIcon = currentTrack ? getIconForCategory(currentTrack.category) : Music;

    if (loading) {
        return <div className="text-center py-12 text-gray-500">Loading sound library...</div>;
    }

    const [isReady, setIsReady] = useState(false);

    // Reset ready state when track changes
    useEffect(() => {
        setIsReady(false);
        setIsBuffering(true);
    }, [activeTrack]);

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center mb-8">
                <h2 className="gradient-text text-3xl font-bold mb-3">Sound Therapy</h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Immerse yourself in calming sounds to reduce anxiety and improve focus.
                </p>
            </div>

            {/* Hidden Player for YouTube/External Links */}
            {/* 
                CRITICAL FIX: 
                1. Opacity 1 (Fully visible to browser)
                2. Z-Index 9999 (On top of everything)
                3. 1px size (Tiny but exists)
                4. Bottom Right (In viewport)
            */}
            <div style={{
                position: 'fixed',
                bottom: '10px',
                right: '10px',
                width: '1px',
                height: '1px',
                opacity: 1,
                pointerEvents: 'none',
                zIndex: 9999,
                overflow: 'hidden'
            }}>
                <Player
                    url={currentTrack?.url}
                    playing={isPlaying && isReady}
                    volume={volume}
                    muted={false}
                    width="100%"
                    height="100%"
                    playsinline={true}
                    onReady={() => {
                        console.log("Player Ready");
                        setIsReady(true);
                    }}
                    onStart={() => {
                        console.log("Player Started");
                        toast.success("Audio started playing");
                    }}
                    onPlay={() => console.log("Player Playing")}
                    onBuffer={() => setIsBuffering(true)}
                    onBufferEnd={() => setIsBuffering(false)}
                    onEnded={() => setIsPlaying(false)}
                    onError={(e: any) => {
                        console.error("Player Error:", e);
                        if (isPlaying) {
                            toast.error("Playback error. Check URL.");
                            setIsPlaying(false);
                        }
                    }}
                    config={{
                        youtube: {
                            playerVars: {
                                showinfo: 0,
                                controls: 0,
                                playsinline: 1,
                                rel: 0,
                                modestbranding: 1,
                                iv_load_policy: 3,
                                disablekb: 1
                            }
                        },
                        vimeo: {
                            playerOptions: { playsinline: true }
                        }
                    }}
                />
            </div>

            {/* Now Playing Card (Sticky or Prominent) */}
            <div className={`bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-500 ${activeTrack ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4 pointer-events-none'}`}>
                <div className="flex items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br ${currentTrack ? getColorForCategory(currentTrack.category) : 'from-gray-200 to-gray-300'} shadow-lg`}>
                            <CurrentIcon className="w-8 h-8 text-white animate-pulse" />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                {isBuffering ? 'Loading Audio...' : 'Now Playing'}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{currentTrack?.title || 'Select a sound'}</h3>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Volume Control */}
                        <div className="hidden sm:flex items-center gap-2 group">
                            <Volume2 className="w-5 h-5 text-gray-400 group-hover:text-[#6366F1] transition-colors" />
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={volume}
                                onChange={(e) => setVolume(parseFloat(e.target.value))}
                                className="w-24 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#6366F1]"
                            />
                        </div>

                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="w-14 h-14 rounded-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                        >
                            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Track Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tracks.map((track) => {
                    const Icon = getIconForCategory(track.category);
                    const color = getColorForCategory(track.category);

                    return (
                        <button
                            key={track._id}
                            onClick={() => togglePlay(track._id)}
                            className={`group relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-300 border-2 ${activeTrack === track._id
                                ? 'border-[#6366F1] bg-[#6366F1]/5 shadow-md scale-[1.02]'
                                : 'border-transparent bg-white dark:bg-gray-800 hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-lg'
                                }`}
                        >
                            <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity`}>
                                <Icon className="w-24 h-24" />
                            </div>

                            <div className="relative z-10">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${color} mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>

                                <h4 className="font-bold text-gray-900 dark:text-white mb-1">{track.title}</h4>
                                <div className="flex items-center gap-2">
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{track.category}</p>
                                    {track.isPremium && (
                                        <span className="px-1.5 py-0.5 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded text-[10px] font-bold">PRO</span>
                                    )}
                                </div>
                            </div>

                            {activeTrack === track._id && isPlaying && (
                                <div className="absolute bottom-4 right-4 flex gap-1">
                                    <div className="w-1 h-3 bg-[#6366F1] rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                    <div className="w-1 h-3 bg-[#6366F1] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-1 h-3 bg-[#6366F1] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
