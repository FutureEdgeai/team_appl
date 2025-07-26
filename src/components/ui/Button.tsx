import React from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export function Button({ children, className, variant = 'primary', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'relative px-6 py-3 rounded-lg font-space-grotesk transition-all duration-300',
        'bg-gradient-to-r from-yellow-400 to-amber-500',
        'hover:from-yellow-300 hover:to-amber-400',
        'transform hover:scale-105',
        'shadow-[0_0_15px_rgba(255,196,0,0.3)]',
        'hover:shadow-[0_0_25px_rgba(255,196,0,0.5)]',
        variant === 'primary' && 'text-gray-900 font-medium',
        variant === 'secondary' && 'bg-opacity-50 text-white',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}