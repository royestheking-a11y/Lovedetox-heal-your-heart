import { useState, useEffect, useRef } from 'react';

export const useAudio = () => {
    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [error, setError] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Cleanup on unmount
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const play = async (url: string) => {
        try {
            setError(null);

            // If already playing this URL, just resume
            if (audioRef.current && audioRef.current.src === url) {
                await audioRef.current.play();
                setPlaying(true);
                return;
            }

            // Stop existing audio
            if (audioRef.current) {
                audioRef.current.pause();
            }

            // Create new audio
            const audio = new Audio(url);
            audio.volume = volume;
            audio.loop = true; // Sound therapy usually loops

            // Event listeners
            audio.onended = () => setPlaying(false);
            audio.onerror = (e) => {
                console.error("Audio Error:", e);
                setError("Failed to play audio");
                setPlaying(false);
            };

            audioRef.current = audio;
            await audio.play();
            setPlaying(true);
        } catch (err) {
            console.error("Play Error:", err);
            setError("Playback failed");
            setPlaying(false);
        }
    };

    const pause = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            setPlaying(false);
        }
    };

    const toggle = (url: string) => {
        if (playing && audioRef.current?.src === url) {
            pause();
        } else {
            play(url);
        }
    };

    const changeVolume = (val: number) => {
        setVolume(val);
        if (audioRef.current) {
            audioRef.current.volume = val;
        }
    };

    return {
        playing,
        toggle,
        pause,
        volume,
        setVolume: changeVolume,
        error
    };
};
