'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, RefreshCw, Sparkles } from 'lucide-react';

const QUOTES = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
  { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" },
  { text: "Dream big and dare to fail.", author: "Norman Vaughan" },
  { text: "What you get by achieving your goals is not as important as what you become by achieving your goals.", author: "Zig Ziglar" },
  { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" },
  { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
  { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
  { text: "Quality is not an act, it is a habit.", author: "Aristotle" },
];

interface Props {
  variant?: 'card' | 'inline' | 'banner';
  className?: string;
}

export default function MotivationalQuote({ variant = 'card', className = '' }: Props) {
  const [quote, setQuote] = useState(QUOTES[0]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Get a random quote based on the day
    const dayIndex = new Date().getDate() % QUOTES.length;
    setQuote(QUOTES[dayIndex]);
  }, []);

  const refreshQuote = () => {
    setIsAnimating(true);
    const randomIndex = Math.floor(Math.random() * QUOTES.length);
    setTimeout(() => {
      setQuote(QUOTES[randomIndex]);
      setIsAnimating(false);
    }, 200);
  };

  if (variant === 'banner') {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-zinc-900/50 border border-emerald-500/20 rounded-lg p-4 ${className}`}
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <p className="text-sm text-zinc-300 font-mono uppercase tracking-wide">"{quote.text}"</p>
          <span className="text-xs text-emerald-500/70 font-mono uppercase flex-shrink-0">— {quote.author}</span>
        </div>
      </motion.div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-2 text-zinc-500 font-mono text-xs uppercase tracking-wide ${className}`}>
        <Quote className="w-3 h-3 flex-shrink-0 text-emerald-500" />
        <p className="truncate">"{quote.text}"</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`bg-zinc-900 border border-zinc-800 rounded-lg p-6 ${className}`}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20">
            <Quote className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Tactical Advisory</h3>
            <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Daily Doctrine</p>
          </div>
        </div>
        <button
          onClick={refreshQuote}
          className="p-2 rounded hover:bg-zinc-800 text-zinc-500 hover:text-emerald-500 transition-colors"
          disabled={isAnimating}
        >
          <RefreshCw className={`w-4 h-4 ${isAnimating ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={quote.text}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-lg text-zinc-200 italic mb-3">"{quote.text}"</p>
          <p className="text-sm text-zinc-500">— {quote.author}</p>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
