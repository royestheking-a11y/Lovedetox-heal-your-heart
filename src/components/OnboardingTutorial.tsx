import { useState } from 'react';
import { X, ArrowRight, Check, Sparkles } from 'lucide-react';
import { PremiumIcon } from './PremiumIcon';

interface OnboardingStep {
  title: string;
  description: string;
  icon: any;
  gradient: string;
}

const steps: OnboardingStep[] = [
  {
    title: 'Welcome to LoveDetox',
    description: 'Your journey to emotional freedom starts here. We\'re here to support you every step of the way.',
    icon: Sparkles,
    gradient: 'from-[#6366F1] to-[#8B5CF6]'
  },
  {
    title: 'Daily Recovery Tasks',
    description: 'Complete bite-sized healing exercises each day to rebuild your emotional strength and break attachment patterns.',
    icon: Check,
    gradient: 'from-[#8B5CF6] to-[#FB7185]'
  },
  {
    title: 'AI Support Companion',
    description: 'Chat with our AI anytime you need support. It\'s trained in emotional healing and available 24/7.',
    icon: Sparkles,
    gradient: 'from-[#FB7185] to-[#F472B6]'
  },
  {
    title: 'Track Your Progress',
    description: 'Monitor your mood, celebrate milestones, and watch your emotional strength grow day by day.',
    icon: Check,
    gradient: 'from-[#6366F1] to-[#8B5CF6]'
  }
];

export function OnboardingTutorial({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    onComplete();
  };

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-lg flex items-center justify-center p-4 animate-in fade-in duration-500">
      <div className="card-3d max-w-2xl w-full p-8 md:p-12 rounded-3xl relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 opacity-5">
          <div className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br ${step.gradient} rounded-full blur-3xl`} />
        </div>

        <button
          onClick={handleComplete}
          className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-all z-10"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <div className="relative">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <PremiumIcon
              Icon={step.icon}
              size="xl"
              variant="3d"
              gradient={step.gradient}
              animate={true}
            />
          </div>

          {/* Content */}
          <div className="text-center mb-8">
            <h2 className="gradient-text mb-4">{step.title}</h2>
            <p className="text-gray-600 text-lg max-w-xl mx-auto">
              {step.description}
            </p>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-8">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${index === currentStep
                  ? 'w-8 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]'
                  : index < currentStep
                    ? 'w-2 bg-[#6366F1]'
                    : 'w-2 bg-gray-300'
                  }`}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex-1 px-6 py-3 border-2 border-gray-200 rounded-full hover:border-[#6366F1] transition-all"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              {currentStep === steps.length - 1 ? (
                <>
                  <Check className="w-5 h-5" />
                  Get Started
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {/* Skip button */}
          <button
            onClick={handleComplete}
            className="w-full mt-4 text-gray-500 hover:text-[#6366F1] transition-colors text-sm"
          >
            Skip Tutorial
          </button>
        </div>
      </div>
    </div>
  );
}
