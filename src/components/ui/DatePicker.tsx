import React from 'react';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import { cn } from '../../utils/cn';

interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  className?: string;
}

export function DatePicker({ value, onChange, className }: DatePickerProps) {
  return (
    <div className={cn('relative flex items-center', className)}>
      <Calendar className="absolute left-3 w-5 h-5 text-yellow-400" />
      <input
        type="date"
        value={format(value, 'yyyy-MM-dd')}
        onChange={(e) => onChange(new Date(e.target.value))}
        className="w-full pl-10 pr-4 py-2 rounded-lg input-field"
      />
    </div>
  );
}