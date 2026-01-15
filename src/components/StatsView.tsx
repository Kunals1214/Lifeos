'use client';

import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Habit } from '@/lib/types';
import { format, subDays } from 'date-fns';
import { motion } from 'framer-motion';
import { Zap, Activity } from 'lucide-react';

interface StatsViewProps {
  habits: Habit[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 p-2 rounded-lg shadow-xl">
        <p className="text-zinc-500 text-[10px] uppercase tracking-wider mb-1">{label}</p>
        <p className="text-emerald-400 font-mono font-bold">
          {Math.round(payload[0].value)}% <span className="text-zinc-600 text-[10px]">COMPLETION</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function StatsView({ habits }: StatsViewProps) {
  // Calculate completion rate for the last 7 days
  const data = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    let completedCount = 0;
    let totalTarget = 0;

    habits.forEach(habit => {
      // Only count daily habits for simplicity in this view
      if (habit.frequency === 'daily') {
        totalTarget += 1;
        if (habit.completedDates.includes(dateStr)) {
          completedCount += 1;
        }
      }
    });

    return {
      name: format(date, 'EEE'),
      date: dateStr,
      completion: totalTarget > 0 ? (completedCount / totalTarget) * 100 : 0,
      completed: completedCount,
      total: totalTarget
    };
  });

  const todayRate = Math.round(data[data.length - 1].completion);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden mt-6 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <Activity size={16} className="text-emerald-500" />
                Weekly Velocity
            </h2>
            <p className="text-[10px] text-zinc-500 font-mono mt-1">LAST 7 DAYS PERFORMANCE</p>
        </div>
        <div className="text-right">
             <div className="text-2xl font-bold text-white font-mono">{todayRate}%</div>
             <div className="text-[10px] text-emerald-500 uppercase tracking-widest flex items-center justify-end gap-1">
                <Zap size={10} /> Current Pace
             </div>
        </div>
      </div>

      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#52525b', fontSize: 10, fontWeight: 'bold' }} 
              dy={10}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#27272a', opacity: 0.4 }} />
            <Bar dataKey="completion" radius={[2, 2, 0, 0]}>
              {data.map((entry, index) => (
                <Cell 
                    key={`cell-${index}`} 
                    fill={entry.completion >= 100 ? '#10b981' : '#3f3f46'} 
                    className="hover:opacity-80 transition-opacity"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-zinc-800 pt-4">
        <div className="text-center w-1/2 border-r border-zinc-800">
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Active Protocols</p>
          <p className="text-xl font-bold text-white font-mono">{habits.length}</p>
        </div>
        <div className="text-center w-1/2">
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Efficiency Ratio</p>
          <p className="text-xl font-bold text-emerald-500 font-mono">
            {Math.round(data.reduce((acc, d) => acc + d.completion, 0) / 7)}%
          </p>
        </div>
      </div>
    </motion.div>
  );
}
