import { User } from 'lucide-react';

interface UserAvatarProps {
  gender: 'male' | 'female' | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function UserAvatar({ gender, size = 'md', className = '' }: UserAvatarProps) {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24'
  };

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-14 h-14'
  };

  // Male avatar gradient: Blue tones
  // Female avatar gradient: Pink/Purple tones
  const gradientClass = gender === 'male' 
    ? 'bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600' 
    : gender === 'female'
    ? 'bg-gradient-to-br from-pink-400 via-purple-500 to-pink-600'
    : 'bg-gradient-to-br from-gray-400 to-gray-600';

  return (
    <div className={`${sizeClasses[size]} ${gradientClass} rounded-full flex items-center justify-center shadow-lg ${className}`}>
      <div className="relative">
        {/* Head */}
        <div className={`bg-white rounded-full ${
          size === 'sm' ? 'w-3 h-3' : 
          size === 'md' ? 'w-5 h-5' : 
          size === 'lg' ? 'w-6 h-6' : 'w-7 h-7'
        } absolute ${
          size === 'sm' ? '-top-1 left-1/2 -translate-x-1/2' : 
          size === 'md' ? '-top-2 left-1/2 -translate-x-1/2' : 
          size === 'lg' ? '-top-2 left-1/2 -translate-x-1/2' : '-top-3 left-1/2 -translate-x-1/2'
        }`} />
        
        {/* Body */}
        <div className={`bg-white ${
          size === 'sm' ? 'w-5 h-3 rounded-t-full' : 
          size === 'md' ? 'w-8 h-5 rounded-t-full' : 
          size === 'lg' ? 'w-10 h-6 rounded-t-full' : 'w-12 h-7 rounded-t-full'
        } ${
          size === 'sm' ? 'mt-1' : 
          size === 'md' ? 'mt-2' : 
          size === 'lg' ? 'mt-3' : 'mt-4'
        }`} />
        
        {/* Gender indicator */}
        {gender === 'female' && (
          <div className={`absolute ${
            size === 'sm' ? 'w-1 h-2 -right-2 top-0' : 
            size === 'md' ? 'w-2 h-3 -right-3 top-1' : 
            size === 'lg' ? 'w-2 h-4 -right-4 top-1' : 'w-3 h-5 -right-5 top-2'
          } bg-white rounded-full`} />
        )}
      </div>
    </div>
  );
}
