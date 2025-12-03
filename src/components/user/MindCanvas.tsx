import { useState } from 'react';
import { Sparkles, Download, Heart, Palette, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../AuthContext';
import dataService from '../../services/dataService';
import { UpgradeModal } from './UpgradeModal';

interface GeneratedImage {
    _id: string;
    image_url: string;
    text_note: string;
    style: string;
    date: string;
}

export function MindCanvas() {
    const { user } = useAuth();
    const [emotion, setEmotion] = useState('');
    const [selectedStyle, setSelectedStyle] = useState('Cinematic');
    const [isGenerating, setIsGenerating] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);
    const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
    const [loadingQuote, setLoadingQuote] = useState('');
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);


    const styles = [
        'Cinematic', 'Soft Watercolor', 'Dreamy', 'Minimalist',
        'Abstract Expressionism', 'Cyberpunk', 'Magic', 'Surrealist'
    ];

    const quotes = [
        "Turning pain into peace...",
        "Visualizing your inner world...",
        "Creating beauty from emotion...",
        "Letting your feelings flow...",
        "Healing through art..."
    ];

    // Check if user is Pro or in Trial
    const isPro = user?.isPro || (user?.plan === 'PRO_TRIAL' && user.trialEndDate && new Date(user.trialEndDate) > new Date());



    const handleGenerate = async () => {
        if (!isPro) {
            setShowUpgradeModal(true);
            return;
        }

        if (!emotion.trim()) {
            toast.error('Please describe your feeling first');
            return;
        }

        setIsGenerating(true);
        setImageLoading(true);
        setLoadingQuote(quotes[Math.floor(Math.random() * quotes.length)]);

        try {
            const response = await dataService.generateMindCanvasImage({
                user_id: user?.id,
                prompt: emotion,
                style: selectedStyle,
                is_pro: true // User is verified as Pro above
            });

            if (response.success) {
                const newImage: GeneratedImage = {
                    _id: response.imageId,
                    image_url: response.imageUrl,
                    text_note: emotion,
                    style: selectedStyle,
                    date: new Date().toISOString()
                };

                setCurrentImage(newImage);
                toast.success('Masterpiece created! 🎨');
            }
        } catch (error: any) {
            console.error('Generation error:', error);
            if (error.response?.status === 403) {
                toast.error('Daily limit reached. Upgrade to Pro for unlimited art! 🚀');
            } else {
                toast.error('Failed to create art. Please try again.');
            }
        } finally {
            setIsGenerating(false);
        }
    };

    const downloadImage = async (url: string, filename: string) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `lovedetox-${filename}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Download failed:', error);
            toast.error('Download failed');
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg mb-4">
                    <Palette className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                    Mind Canvas
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                    Transform your emotions into beautiful AI-generated art. Visualizing your feelings is the first step to healing.
                </p>
            </div>

            {/* Creation Studio */}
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                How are you feeling right now?
                            </label>
                            <textarea
                                value={emotion}
                                onChange={(e) => setEmotion(e.target.value)}
                                placeholder="I miss her but I know I must move on..."
                                className="w-full h-32 p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-purple-500 resize-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                Choose an Art Style
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {styles.map((style) => (
                                    <button
                                        key={style}
                                        onClick={() => setSelectedStyle(style)}
                                        className={`p-3 rounded-xl text-sm font-medium transition-all ${selectedStyle === style
                                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md transform scale-105'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                                            }`}
                                    >
                                        {style}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    Creating Magic...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-6 h-6" />
                                    Generate Art
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Preview Section */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center min-h-[500px] relative overflow-hidden group">
                    {isGenerating ? (
                        <div className="flex flex-col items-center justify-center p-12 space-y-6">
                            <div className="relative">
                                <div className="absolute inset-0 bg-purple-500 blur-xl opacity-20 animate-pulse rounded-full"></div>
                                <Loader2 className="w-16 h-16 text-purple-600 animate-spin relative z-10" />
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Creating your art...</h3>
                                <p className="text-gray-500 dark:text-gray-400 animate-pulse">
                                    {loadingQuote || "Weaving your emotions into reality..."}
                                </p>
                            </div>
                        </div>
                    ) : currentImage ? (
                        <div className="relative w-full h-full flex flex-col items-center">
                            {imageLoading && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6 bg-white dark:bg-gray-800 z-10">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-purple-500 blur-xl opacity-20 animate-pulse rounded-full"></div>
                                        <Loader2 className="w-16 h-16 text-purple-600 animate-spin relative z-10" />
                                    </div>
                                    <div className="text-center space-y-2">
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Finishing touches...</h3>
                                        <p className="text-gray-500 dark:text-gray-400 animate-pulse">
                                            Almost ready...
                                        </p>
                                    </div>
                                </div>
                            )}
                            <img
                                src={currentImage.image_url}
                                alt="Generated Art"
                                onLoad={() => setImageLoading(false)}
                                className={`w-full h-auto max-h-[400px] object-cover rounded-2xl shadow-2xl mb-6 transform transition-transform duration-700 hover:scale-[1.02] ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                            />
                            {!imageLoading && (
                                <>
                                    <div className="flex gap-4 w-full justify-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                                        <button
                                            onClick={() => downloadImage(currentImage.image_url, 'mind-canvas')}
                                            className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                        >
                                            <Download className="w-5 h-5" />
                                            Download
                                        </button>
                                        <button
                                            onClick={() => toast.success('Saved to your gallery!')}
                                            className="flex items-center gap-2 px-6 py-3 bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 rounded-xl font-medium hover:bg-pink-100 dark:hover:bg-pink-900/40 transition-colors"
                                        >
                                            <Heart className="w-5 h-5" />
                                            Save
                                        </button>
                                    </div>
                                    <p className="mt-4 text-sm text-gray-500 italic animate-in fade-in duration-1000">"{currentImage.text_note}"</p>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="text-center text-gray-400">
                            <ImageIcon className="w-24 h-24 mx-auto mb-4 opacity-20" />
                            <p className="text-lg">Your masterpiece will appear here</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Gallery Section Removed as per user request */}
            {/* Upgrade Modal */}
            <UpgradeModal
                isOpen={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
                type="trial"
            />
        </div >
    );
}
