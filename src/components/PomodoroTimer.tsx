'use client';

import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';
import { motion } from 'framer-motion';

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

const TIMER_CONFIG = {
  work: { duration: 25 * 60, label: 'Focus Time', color: 'from-red-500 to-orange-500' },
  shortBreak: { duration: 5 * 60, label: 'Short Break', color: 'from-green-500 to-teal-500' },
  longBreak: { duration: 15 * 60, label: 'Long Break', color: 'from-blue-500 to-indigo-500' },
};

interface PomodoroTimerProps {
  onComplete?: () => void;
}

export default function PomodoroTimer({ onComplete }: PomodoroTimerProps) {
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(TIMER_CONFIG.work.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);

  const playSound = useCallback(() => {
    const audio = new Audio('/sounds/bell.mp3');
    audio.play().catch(() => {});
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      playSound();
      setIsRunning(false);
      
      if (mode === 'work') {
        setSessions((prev) => prev + 1);
        if ((sessions + 1) % 4 === 0) {
          setMode('longBreak');
          setTimeLeft(TIMER_CONFIG.longBreak.duration);
        } else {
          setMode('shortBreak');
          setTimeLeft(TIMER_CONFIG.shortBreak.duration);
        }
      } else {
        setMode('work');
        setTimeLeft(TIMER_CONFIG.work.duration);
      }
      
      onComplete?.();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, sessions, onComplete, playSound]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(TIMER_CONFIG[mode].duration);
  };

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(TIMER_CONFIG[newMode].duration);
    setIsRunning(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((TIMER_CONFIG[mode].duration - timeLeft) / TIMER_CONFIG[mode].duration) * 100;

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white">
      <div className="flex justify-center gap-2 mb-6">
        <button
          onClick={() => switchMode('work')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-all ${
            mode === 'work' ? 'bg-white/20' : 'hover:bg-white/10'
          }`}
        >
          <Brain size={16} /> Focus
        </button>
        <button
          onClick={() => switchMode('shortBreak')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-all ${
            mode === 'shortBreak' ? 'bg-white/20' : 'hover:bg-white/10'
          }`}
        >
          <Coffee size={16} /> Short
        </button>
        <button
          onClick={() => switchMode('longBreak')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-all ${
            mode === 'longBreak' ? 'bg-white/20' : 'hover:bg-white/10'
          }`}
        >
          <Coffee size={16} /> Long
        </button>
      </div>

      <div className="relative w-48 h-48 mx-auto mb-6">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="88"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
          />
          <motion.circle
            cx="96"
            cy="96"
            r="88"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={553}
            initial={{ strokeDashoffset: 553 }}
            animate={{ strokeDashoffset: 553 - (553 * progress) / 100 }}
            transition={{ duration: 0.5 }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold font-mono">{formatTime(timeLeft)}</span>
          <span className="text-sm opacity-70">{TIMER_CONFIG[mode].label}</span>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={toggleTimer}
          className="p-4 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
        >
          {isRunning ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button
          onClick={resetTimer}
          className="p-4 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
        >
          <RotateCcw size={24} />
        </button>
      </div>

      <div className="text-center mt-4 text-sm opacity-70">
        Sessions completed: {sessions}
      </div>
    </div>
  );
}
