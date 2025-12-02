import { Palette, ArrowRight, Lock } from 'lucide-react';

interface MindCanvasWidgetProps {
    onNavigate: (tab: 'mind-canvas') => void;
    isPro?: boolean;
}

export function MindCanvasWidget({ onNavigate, isPro = false }: MindCanvasWidgetProps) {
    return (
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl transition-transform duration-700 group-hover:scale-150" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-12 -mb-12 blur-xl transition-transform duration-700 group-hover:scale-150" />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                            <Palette className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-bold">Mind Canvas</h3>
                    </div>
                    {!isPro && (
                        <div className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full flex items-center gap-1">
                            <Lock className="w-3 h-3 text-white" />
                            <span className="text-xs font-bold text-white">PRO</span>
                        </div>
                    )}
                </div>

                <p className="text-white mb-6 text-sm leading-relaxed">
                    Transform your emotions into beautiful AI art. Visualizing your feelings is the first step to healing.
                </p>

                <button
                    onClick={() => isPro && onNavigate('mind-canvas')}
                    disabled={!isPro}
                    className={`w-full py-3 bg-white text-purple-600 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm ${!isPro ? 'opacity-70 cursor-not-allowed' : 'hover:bg-purple-50'}`}
                >
                    {!isPro ? (
                        <>
                            <Lock className="w-4 h-4" />
                            Upgrade to Unlock
                        </>
                    ) : (
                        <>
                            Create Today's Mood Art
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
