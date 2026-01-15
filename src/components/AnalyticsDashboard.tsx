'use client';

import { useMemo } from 'react';
import { Habit } from '@/lib/types';
import { format, subDays, eachDayOfInterval, startOfMonth, endOfMonth, parseISO } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, Award, AlertTriangle, Activity, Target } from 'lucide-react';
import { motion } from 'framer-motion';

interface AnalyticsDashboardProps {
  habits: Habit[];
}

const COLORS = ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#ec4899', '#6366f1'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg shadow-xl">
        <p className="text-zinc-400 text-xs mb-1 uppercase tracking-wider">{label}</p>
        <p className="text-white font-bold text-lg">
          {payload[0].value}
          <span className="text-zinc-500 text-xs font-normal ml-1">UNITS</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function AnalyticsDashboard({ habits }: AnalyticsDashboardProps) {
  const today = useMemo(() => new Date(), []);

  // Weekly performance by day
  const weeklyData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const dayCounts: Record<string, number> = {};
    
    habits.forEach((habit) => {
      (habit.completedDates || []).forEach((dateStr) => {
        const date = parseISO(dateStr);
        const dayName = format(date, 'EEE');
        dayCounts[dayName] = (dayCounts[dayName] || 0) + 1;
      });
    });

    return days.map((day) => ({
      day,
      completions: dayCounts[day] || 0,
    }));
  }, [habits]);

  // Best/worst performing habits
  const habitPerformance = useMemo(() => {
    const last30Days = eachDayOfInterval({
      start: subDays(today, 30),
      end: today,
    }).map((d) => format(d, 'yyyy-MM-dd'));

    return habits.map((habit) => {
      const completed = (habit.completedDates || []).filter((d) => last30Days.includes(d)).length;
      const percentage = Math.round((completed / 30) * 100);
      return { ...habit, completed, percentage };
    }).sort((a, b) => b.percentage - a.percentage);
  }, [habits, today]);

  const bestHabits = habitPerformance.slice(0, 3);
  const worstHabits = habitPerformance.slice(-3).reverse();

  // Monthly trend
  const monthlyTrend = useMemo(() => {
    const last6Months = Array.from({ length: 6 }).map((_, i) => {
      const date = subDays(today, i * 30);
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd }).map((d) => format(d, 'yyyy-MM-dd'));
      
      let totalCompletions = 0;
      habits.forEach((habit) => {
        totalCompletions += (habit.completedDates || []).filter((d) => daysInMonth.includes(d)).length;
      });

      return {
        month: format(date, 'MMM'),
        completions: totalCompletions,
      };
    }).reverse();

    return last6Months;
  }, [habits, today]);

  // Category distribution
  const categoryData = useMemo(() => {
    const categories = { morning: 0, afternoon: 0, evening: 0, anytime: 0 };
    habits.forEach((habit) => {
      categories[habit.category || 'anytime']++;
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value })).filter((c) => c.value > 0);
  }, [habits]);

  // Total stats
  const totalCompletions = habits.reduce((acc, h) => acc + (h.completedDates?.length || 0), 0);
  const avgDaily = Math.round(totalCompletions / 30);

  return (
    <div className="space-y-6">
       
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Total Efficiency Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-zinc-900 border border-zinc-800 rounded-2xl p-6 group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity size={80} className="text-emerald-500" />
          </div>
          <div className="relative z-10">
            <h3 className="text-xs uppercase tracking-widest text-zinc-500 mb-2 font-medium">Total Efficiency</h3>
            <div className="text-4xl font-bold text-white mb-2">{totalCompletions}</div>
            <div className="flex items-center text-emerald-500 text-sm font-medium">
              <TrendingUp size={16} className="mr-1" />
              <span>+12% vs last month</span>
            </div>
          </div>
        </motion.div>

        {/* Daily Capacity Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden bg-zinc-900 border border-zinc-800 rounded-2xl p-6 group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Target size={80} className="text-cyan-500" />
          </div>
          <div className="relative z-10">
            <h3 className="text-xs uppercase tracking-widest text-zinc-500 mb-2 font-medium">Daily Output</h3>
            <div className="text-4xl font-bold text-white mb-2">{avgDaily}</div>
            <div className="flex items-center text-cyan-500 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-cyan-500 mr-2 animate-pulse" />
              <span>Optimal Range</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Performance */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Performance Metrics</h3>
            <select className="bg-zinc-800 border-none text-xs text-zinc-400 rounded-lg px-3 py-1 focus:ring-0 cursor-pointer">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis 
                  dataKey="day" 
                  tick={{ fontSize: 10, fill: '#71717a' }} 
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: '#71717a' }} 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#27272a', opacity: 0.4 }} />
                <Bar 
                  dataKey="completions" 
                  fill="#10b981" 
                  radius={[4, 4, 0, 0]} 
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Category Distribution */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
        >
          <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Focus Zones</h3>
          <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  dataKey="value"
                  paddingAngle={5}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">100%</div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Allocated</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Performers */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Award className="text-emerald-500" size={20} />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Top Performers</h3>
          </div>
          <div className="space-y-4">
            {bestHabits.map((habit, index) => (
              <div key={habit.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <span className="text-zinc-600 font-mono text-xs">0{index + 1}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full ring-2 ring-emerald-500/20" style={{ backgroundColor: habit.color }} />
                    <span className="text-zinc-300 group-hover:text-white transition-colors">{habit.name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-16 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${habit.percentage}%` }} />
                  </div>
                  <span className="text-emerald-500 font-mono text-sm">{habit.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Needs Attention */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <AlertTriangle className="text-orange-500" size={20} />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Strategic Weaknesses</h3>
          </div>
          <div className="space-y-4">
            {worstHabits.map((habit, index) => (
              <div key={habit.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <span className="text-zinc-600 font-mono text-xs">0{index + 1}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full ring-2 ring-orange-500/20" style={{ backgroundColor: habit.color }} />
                    <span className="text-zinc-300 group-hover:text-white transition-colors">{habit.name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-16 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500" style={{ width: `${habit.percentage}%` }} />
                  </div>
                  <span className="text-orange-500 font-mono text-sm">{habit.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Monthly Trend */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">Long Term Trajectory</h3>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <span className="text-xs text-zinc-500 uppercase">Consistency</span>
          </div>
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyTrend}>
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 10, fill: '#71717a' }} 
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 10, fill: '#71717a' }} 
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3f3f46', strokeWidth: 1 }} />
              <Line 
                type="monotone" 
                dataKey="completions" 
                stroke="#6366f1" 
                strokeWidth={3}
                dot={{ fill: '#18181b', stroke: '#6366f1', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#6366f1' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
