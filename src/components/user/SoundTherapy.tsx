import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, CloudRain, Waves, Trees, Wind, Moon, Sun, Coffee, Zap } from 'lucide-react';
import { PremiumIcon } from '../PremiumIcon';

interface SoundTrack {
    id: string;
    title: string;
    category: 'nature' | 'focus' | 'sleep' | 'anxiety';
    url: string;
    icon: any;
    color: string;
}

const tracks: SoundTrack[] = [
    {
        id: 'rain',
        title: 'Heavy Rain',
        category: 'nature',
        url: 'https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg',
        icon: CloudRain,
        color: 'from-blue-400 to-blue-600'
    },
    {
        id: 'ocean',
        title: 'Ocean Waves',
        category: 'anxiety',
        url: 'https://actions.google.com/sounds/v1/water/waves_crashing.ogg',
        icon: Waves,
        color: 'from-cyan-400 to-blue-500'
    },
    {
        id: 'forest',
        title: 'Morning Forest',
        category: 'nature',
        url: 'https://actions.google.com/sounds/v1/ambiences/forest_morning.ogg',
        icon: Trees,
        color: 'from-green-400 to-emerald-600'
    },
    {
        id: 'white-noise',
        title: 'Calm White Noise',
        category: 'focus',
        url: 'https://actions.google.com/sounds/v1/ambiences/humming_fan.ogg',
        icon: Wind,
        color: 'from-gray-400 to-gray-600'
    },
    {
        id: 'night',
        title: 'Night Ambience',
        category: 'sleep',
        url: 'https://actions.google.com/sounds/v1/nature/crickets_chirping.ogg',
        icon: Moon,
        color: 'from-indigo-400 to-purple-600'
    },
    {
        id: 'stream',
        title: 'Gentle Stream',
        category: 'anxiety',
        url: 'https://actions.google.com/sounds/v1/water/stream_water.ogg',
        icon: Waves,
        color: 'from-cyan-300 to-blue-400'
    }
];

export function SoundTherapy() {
    const [activeTrack, setActiveTrack] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    const togglePlay = (trackId: string) => {
        if (activeTrack === trackId) {
            if (isPlaying) {
                audioRef.current?.pause();
                setIsPlaying(false);
            } else {
                audioRef.current?.play();
                setIsPlaying(true);
            }
        } else {
            setActiveTrack(trackId);
            setIsPlaying(true);
            // Audio element will auto-play via the autoPlay prop when src changes, 
            // but we handle it explicitly in useEffect or just let React handle the src change
        }
    };

    // Effect to handle source change and playing
    useEffect(() => {
        if (activeTrack && audioRef.current) {
            audioRef.current.src = tracks.find(t => t.id === activeTrack)?.url || '';
            if (isPlaying) {
                audioRef.current.play().catch(e => console.error("Audio play failed:", e));
            }
        }
    }, [activeTrack]);

    // Effect to handle play/pause toggle without source change
    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(e => console.error("Audio play failed:", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying]);

    const currentTrack = tracks.find(t => t.id === activeTrack);

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center mb-8">
                <h2 className="gradient-text text-3xl font-bold mb-3">Sound Therapy</h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Immerse yourself in calming sounds to reduce anxiety and improve focus.
                </p>
            </div>

            {/* Now Playing Card (Sticky or Prominent) */}
            <div className={`bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-500 ${activeTrack ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4 pointer-events-none'}`}>
                <div className="flex items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br ${currentTrack?.color || 'from-gray-200 to-gray-300'} shadow-lg`}>
                            {currentTrack && <currentTrack.icon className="w-8 h-8 text-white animate-pulse" />}
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Now Playing</div>
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
                <audio ref={audioRef} loop className="hidden" />
            </div>

            {/* Track Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tracks.map((track) => (
                    <button
                        key={track.id}
                        onClick={() => togglePlay(track.id)}
                        className={`group relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-300 border-2 ${activeTrack === track.id
                                ? 'border-[#6366F1] bg-[#6366F1]/5 shadow-md scale-[1.02]'
                                : 'border-transparent bg-white dark:bg-gray-800 hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-lg'
                            }`}
                    >
                        <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity`}>
                            <track.icon className="w-24 h-24" />
                        </div>

                        <div className="relative z-10">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${track.color} mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                                <track.icon className="w-6 h-6 text-white" />
                            </div>

                            <h4 className="font-bold text-gray-900 dark:text-white mb-1">{track.title}</h4>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{track.category}</p>
                        </div>

                        {activeTrack === track.id && isPlaying && (
                            <div className="absolute bottom-4 right-4 flex gap-1">
                                <div className="w-1 h-3 bg-[#6366F1] rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                <div className="w-1 h-3 bg-[#6366F1] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-1 h-3 bg-[#6366F1] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
