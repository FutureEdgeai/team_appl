import React from 'react';
import { Quote } from 'lucide-react';

const quotes = [
  "Alone we can do so little; together we can do so much.",
  "Teamwork makes the dream work.",
  "Coming together is a beginning. Keeping together is progress. Working together is success.",
  "The strength of the team is each individual member. The strength of each member is the team.",
];

export function QuoteDisplay() {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <div className="floating-element glass-panel p-4 rounded-lg mb-8">
      <div className="flex items-center gap-3">
        <Quote className="w-6 h-6 text-yellow-400 pulse-element" />
        <p className="text-gray-200 italic">{randomQuote}</p>
      </div>
    </div>
  );
}