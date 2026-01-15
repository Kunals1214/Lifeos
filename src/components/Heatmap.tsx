'use client';

import { useMemo } from 'react';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { Habit } from '@/lib/types';
import { motion } from 'framer-motion';
import { Grid } from 'lucide-react';

interface HeatmapProps {
  habits: Habit[];
  weeks?: number;
}

export default function Heatmap({ habits, weeks = 12 }: HeatmapProps) {
  const today = useMemo(() => new Date(), []);
  const startDate = useMemo(() => subDays(today, weeks * 7), [today, weeks]);

  const days = useMemo(() => {
    return eachDayOfInterval({ start: startDate, end: today });
  }, [startDate, today]);

  const completionsByDate = useMemo(() => {
    const map: Record<string, number> = {};
    
    habits.forEach((habit) => {
      (habit.completedDates || []).forEach((date) => {
        map[date] = (map[date] || 0) + 1;
      });
    });

    return map;
  }, [habits]);

  const maxCompletions = Math.max(...Object.values(completionsByDate), 1);

  const getColor = (count: number) => {
    if (count === 0) return 'bg-zinc-800/50';
    const intensity = count / maxCompletions;
    if (intensity < 0.25) return 'bg-emerald-900/40 border border-emerald-900/50';
    if (intensity < 0.5) return 'bg-emerald-800/60 border border-emerald-800/50';
    if (intensity < 0.75) return 'bg-emerald-600/80 border border-emerald-600/50 shadow-[0_0_8px_rgba(16,185,129,0.2)]';
    return 'bg-emerald-500 border border-emerald-400/50 shadow-[0_0_12px_rgba(16,185,129,0.4)]';
  };

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Group days by week
  const weekGroups: Date[][] = [];
  let currentWeek: Date[] = [];
  
  days.forEach((day, index) => {
    currentWeek.push(day);
    if (day.getDay() === 0 || index === days.length - 1) {
      weekGroups.push([...currentWeek]);
      currentWeek = [];
    }
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <Grid size={16} className="text-emerald-500" />
        <h3 className="text-sm font-bold text-white uppercase tracking-widest">Consistency Matrix</h3>
      </div>
      
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-1">
          <div className="flex flex-col gap-1 text-[9px] text-zinc-500 uppercase tracking-widest pr-2 font-mono h-full justify-between py-0.5">
            {weekDays.map((day, i) => (
              <div key={day} className="h-3 flex items-center">
                {i % 2 === 0 && <span>{day.substring(0, 1)}</span>}
              </div>
            ))}
          </div>
          
          <div className="flex gap-1.5">
            {weekGroups.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1.5">
                {Array.from({ length: 7 }).map((_, dayIndex) => {
                  const day = week.find((d) => d.getDay() === (dayIndex + 1) % 7);
                  if (!day) {
                    return <div key={dayIndex} className="w-3 h-3" />;
                  }
                  
                  const dateStr = format(day, 'yyyy-MM-dd');
                  const count = completionsByDate[dateStr] || 0;
                  
                  return (
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      key={dayIndex}
                      className={`w-3 h-3 rounded-sm ${getColor(count)} cursor-pointer transition-all duration-300`}
                      title={`${format(day, 'MMM d')}: ${count} interactions`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 mt-4 text-[10px] text-zinc-500 uppercase tracking-widest font-mono">
        <span>Idle</span>
        <div className="flex gap-1">
          {['bg-zinc-800/50', 'bg-emerald-900/40', 'bg-emerald-700/60', 'bg-emerald-500'].map((color, i) => (
            <div key={i} className={`w-3 h-3 rounded-sm ${color}`} />
          ))}
        </div>
        <span>Max Output</span>
      </div>
    </motion.div>
  );
}
