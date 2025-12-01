import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PremiumIconProps {
  Icon: LucideIcon;
  gradient?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: '3d' | 'flat' | 'gradient' | 'glow';
  animate?: boolean;
}

export function PremiumIcon({ 
  Icon, 
  gradient = 'from-[#6366F1] to-[#8B5CF6]', 
  size = 'md',
  variant = '3d',
  animate = false
}: PremiumIconProps) {
  
  const sizeClasses = {
    sm: 'w-8 h-8 p-2',
    md: 'w-12 h-12 p-3',
    lg: 'w-16 h-16 p-4',
    xl: 'w-20 h-20 p-5'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10'
  };

  if (variant === '3d') {
    return (
      <div className={`${sizeClasses[size]} icon-3d-box rounded-2xl ${animate ? 'animate-bounce-subtle' : ''}`}>
        <div className={`w-full h-full rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center relative`}>
          <div className="absolute inset-0 bg-white/20 rounded-xl" style={{ 
            backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)' 
          }} />
          <Icon className={`${iconSizes[size]} text-white relative z-10`} />
        </div>
      </div>
    );
  }

  if (variant === 'flat') {
    return (
      <div className={`${sizeClasses[size]} rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center ${animate ? 'animate-bounce-subtle' : ''}`}>
        <Icon className={`${iconSizes[size]} text-white`} />
      </div>
    );
  }

  if (variant === 'gradient') {
    return (
      <div className={`${sizeClasses[size]} rounded-2xl bg-gradient-to-br ${gradient.replace('to-', 'to-').split(' ').map(c => c + '/10').join(' ')} flex items-center justify-center border-2 border-transparent hover:border-opacity-50 transition-all ${animate ? 'animate-bounce-subtle' : ''}`}>
        <Icon className={`${iconSizes[size]} bg-gradient-to-br ${gradient} text-transparent bg-clip-text`} style={{ 
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 2px 4px rgba(99, 102, 241, 0.3))'
        }} />
      </div>
    );
  }

  if (variant === 'glow') {
    return (
      <div className={`${sizeClasses[size]} rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg ${animate ? 'animate-pulse-glow' : ''}`}
           style={{ boxShadow: '0 0 30px rgba(139, 92, 246, 0.5)' }}>
        <Icon className={`${iconSizes[size]} text-white`} />
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
      <Icon className={`${iconSizes[size]} text-white`} />
    </div>
  );
}
