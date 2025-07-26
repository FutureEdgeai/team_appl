import React from 'react';
import { cn } from '../../utils/cn';

const statuses = [
  { value: '🚧' },
  { value: '✅' },
  { value: '🔴' },
  { value: '⏩' },
  { value: '🎯' },
];

interface StatusSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function StatusSelect({ value, onChange, className }: StatusSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        'px-3 py-2 rounded-lg input-field appearance-none cursor-pointer',
        'bg-[rgba(0,12,32,0.5)] text-xl leading-none',
        'min-w-[60px]',
        className
      )}
    >
      {statuses.map((status) => (
        <option key={status.value} value={status.value} className="bg-[#000c20]">
          {status.value}
        </option>
      ))}
    </select>
  );
}