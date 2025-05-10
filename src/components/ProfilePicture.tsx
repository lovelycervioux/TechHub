import type { User as UserType } from '../types';
import { User as UserIcon } from 'lucide-react';

interface ProfilePictureProps {
  user: UserType | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function ProfilePicture({ user, size = 'md', className = '' }: ProfilePictureProps) {
  if (!user) return null;
  
  // Define sizes based on the size prop
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };
  
  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 24
  };
  
  if (user.profilePicture) {
    return (
      <img
        src={user.profilePicture}
        alt={user.name}
        className={`${sizeClasses[size]} rounded-full object-cover border border-purple-400 ${className}`}
      />
    );
  }
  
  return (
    <div className={`${sizeClasses[size]} rounded-full bg-purple-600 flex items-center justify-center ${className}`}>
      <UserIcon size={iconSizes[size]} className="text-purple-200" />
    </div>
  );
}
