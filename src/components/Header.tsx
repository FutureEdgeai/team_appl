import React from 'react';
import { ClipboardList, Sunset, PhoneCall, CalendarPlus } from 'lucide-react';
import { Button } from './ui/Button';
import { cn } from '../utils/cn';

interface HeaderProps {
  activeTab: 'fft' | 'eod' | 'closer' | 'setter';
  setActiveTab: (tab: 'fft' | 'eod' | 'closer' | 'setter') => void;
}

export function Header({ activeTab, setActiveTab }: HeaderProps) {
  return (
    <div className="text-center mb-12">
      <div className="floating-element inline-flex items-center gap-3 mb-8">
        <img 
          src="https://storage.googleapis.com/msgsndr/TNVxeQZsDGFld42jVNO3/media/68255735b12e57c575bac475.png" 
          alt="Future Edge AI Logo" 
          className="h-32 glow-logo"
        />
      </div>
      
      <div className="flex flex-wrap justify-center gap-4 mt-8">
        <Button
          variant={activeTab === 'fft' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('fft')}
          className={cn(
            'flex-1 max-w-[200px] text-lg',
            activeTab === 'fft' && 'scale-105 shadow-[0_0_25px_rgba(255,196,0,0.5)]'
          )}
        >
          <ClipboardList className="w-5 h-5 inline-block mr-2" />
          Focus For Today
        </Button>
        <Button
          variant={activeTab === 'eod' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('eod')}
          className={cn(
            'flex-1 max-w-[200px] text-lg',
            activeTab === 'eod' && 'scale-105 shadow-[0_0_25px_rgba(255,196,0,0.5)]'
          )}
        >
          <Sunset className="w-5 h-5 inline-block mr-2" />
          End of Day
        </Button>
        <Button
          variant={activeTab === 'closer' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('closer')}
          className={cn(
            'flex-1 max-w-[200px] text-lg',
            activeTab === 'closer' && 'scale-105 shadow-[0_0_25px_rgba(255,196,0,0.5)]'
          )}
        >
          <PhoneCall className="w-5 h-5 inline-block mr-2" />
          Closer Report
        </Button>
        <Button
          variant={activeTab === 'setter' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('setter')}
          className={cn(
            'flex-1 max-w-[200px] text-lg',
            activeTab === 'setter' && 'scale-105 shadow-[0_0_25px_rgba(255,196,0,0.5)]'
          )}
        >
          <CalendarPlus className="w-5 h-5 inline-block mr-2" />
          Setter Report
        </Button>
      </div>
    </div>
  );
}