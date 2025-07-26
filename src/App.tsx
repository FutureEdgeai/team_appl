import React, { useState } from 'react';
import { FFTSection } from './components/FFTSection';
import { EODSection } from './components/EODSection';
import { CloserSection } from './components/CloserSection';
import { SetterSection } from './components/SetterSection';
import { Header } from './components/Header';
import { QuoteDisplay } from './components/QuoteDisplay';
import { TaskLegend } from './components/TaskLegend';
import { Toaster } from 'react-hot-toast';

type TabType = 'fft' | 'eod' | 'closer' | 'setter';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('fft');

  return (
    <div className="min-h-screen py-8 px-4">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(0, 12, 32, 0.9)',
            color: '#fff',
            border: '1px solid rgba(255, 196, 0, 0.3)',
          },
        }} 
      />
      
      <div className="max-w-4xl mx-auto">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        <QuoteDisplay />
        {(activeTab === 'fft' || activeTab === 'eod') && <TaskLegend />}
        
        <div className="glass-panel p-6 rounded-lg">
          {activeTab === 'fft' && <FFTSection />}
          {activeTab === 'eod' && <EODSection />}
          {activeTab === 'closer' && <CloserSection />}
          {activeTab === 'setter' && <SetterSection />}
        </div>
      </div>
    </div>
  );
}