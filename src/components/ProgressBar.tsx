'use client';

import { motion } from 'framer-motion';
import { Trophy, Flame, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEffect, useState } from 'react';

interface ProgressBarProps {
  completed: number;
  total: number;
  streak: number;
}

export default function ProgressBar({ completed, total, streak }: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const [celebrated, setCelebrated] = useState(false);

  useEffect(() => {
    if (percentage === 100 && !celebrated && total > 0) {
      setCelebrated(true);
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.3 },
        colors: ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4']
      });
    }
    if (percentage < 100) {
      setCelebrated(false);
    }
  }, [percentage, celebrated, total]);

  const getMilestoneIcon = () => {
    if (streak >= 100) return <Trophy className="text-yellow-400" size={20} />;
    if (streak >= 30) return <Star className="text-purple-400" size={20} />;
    if (streak >= 7) return <Flame className="text-orange-400" size={20} />;
    return null;
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span className="text-white font-medium">Today's Progress</span>
          {getMilestoneIcon()}
        </div>
        <span className="text-white/80 text-sm">
          {completed}/{total} habits ({percentage}%)
        </span>
      </div>
      
      <div className="h-3 bg-black/20 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: percentage === 100 
              ? 'linear-gradient(90deg, #ffd700, #ff6b6b)' 
              : 'linear-gradient(90deg, #4ade80, #22d3ee)'
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {percentage === 100 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-2 text-yellow-300 font-bold text-sm"
        >
          🎉 Perfect Day! You're amazing!
        </motion.div>
      )}

      {streak > 0 && (
        <div className="flex items-center justify-center gap-1 mt-2 text-white/70 text-xs">
          <Flame size={14} className="text-orange-400" />
          <span>{streak} day streak</span>
          {streak === 7 && <span className="ml-1">🔥 1 Week!</span>}
          {streak === 30 && <span className="ml-1">⭐ 1 Month!</span>}
          {streak === 100 && <span className="ml-1">🏆 100 Days!</span>}
        </div>
      )}
    </div>
  );
}
