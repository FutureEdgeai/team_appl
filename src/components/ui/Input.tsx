import React from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className, ...props }: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <input
        className={cn(
          'w-full px-6 py-4 rounded-lg transition-all duration-300 text-base',
          'input-field focus:outline-none focus:ring-2 focus:ring-yellow-400/30',
          'placeholder:text-gray-500',
          className
        )}
        {...props}
      />
    </div>
  );
}