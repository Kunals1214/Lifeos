'use client';

import { useState, useEffect, useCallback } from 'react';
import { Habit } from '@/lib/types';
import { 
  Check, Plus, Trash2, Flame, Edit3, Volume2, VolumeX, 
  Calendar, Target, TrendingUp, BarChart3, ChevronLeft, 
  ChevronRight, Sparkles, Clock, MoreHorizontal, X,
  Award, Crown, Zap
} from 'lucide-react';
import { format, startOfWeek, addDays, isSameDay, subDays, addWeeks, subWeeks } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

type CategoryFilter = 'all' | 'morning' | 'afternoon' | 'evening';

const CATEGORY_COLORS = {
  morning: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
  afternoon: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  evening: { bg: 'bg-violet-500/20', text: 'text-violet-400', border: 'border-violet-500/30' },
};

export default function HabitTrackerNew() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  // New habit form state
  const [newHabit, setNewHabit] = useState({
    name: '',
    description: '',
    category: 'morning' as 'morning' | 'afternoon' | 'evening',
    time: '',
    color: '#10b981',
    icon: '✨',
  });

  useEffect(() => {
    fetchHabits();
    const savedSound = localStorage.getItem('sound_enabled');
    if (savedSound !== null) setSoundEnabled(savedSound === 'true');
  }, []);

  const playSound = useCallback(() => {
    if (soundEnabled) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    }
  }, [soundEnabled]);

  const fetchHabits = async () => {
    try {
      const res = await fetch('/api/habits');
      const data = await res.json();
      setHabits(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch habits:', error);
      setHabits([]);
    }
    setLoading(false);
  };

  const calculateStreak = (habit: Habit) => {
    let streak = 0;
    const today = new Date();
    const completedDates = habit.completedDates || [];
    for (let i = 0; i < 365; i++) {
      const date = subDays(today, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      if (completedDates.includes(dateStr)) {
        streak++;
      } else if (i === 0) {
        continue;
      } else {
        break;
      }
    }
    return streak;
  };

  const toggleHabit = async (habitId: string) => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;

    const completedDates = habit.completedDates || [];
    const isCompleted = completedDates.includes(dateStr);
    
    const updatedHabits = habits.map((h) => {
      if (h.id === habitId) {
        return {
          ...h,
          completedDates: isCompleted
            ? completedDates.filter((d) => d !== dateStr)
            : [...completedDates, dateStr],
        };
      }
      return h;
    });
    setHabits(updatedHabits);

    if (!isCompleted && isSameDay(selectedDate, new Date())) {
      playSound();
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: [habit.color || '#10b981']
      });
    }

    try {
      await fetch('/api/habits/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ habitId, date: dateStr, completed: !isCompleted }),
      });
    } catch (error) {
      console.error('Failed to toggle habit', error);
      fetchHabits();
    }
  };

  const deleteHabit = async (habitId: string) => {
    if (!confirm('Delete this habit?')) return;
    setHabits(habits.filter(h => h.id !== habitId));
    try {
      await fetch(`/api/habits?id=${habitId}`, { method: 'DELETE' });
    } catch (error) {
      fetchHabits();
    }
  };

  const addHabit = async () => {
    if (!newHabit.name.trim()) return;
    
    try {
      const res = await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newHabit,
          frequency: 'daily',
          target: 1,
        }),
      });
      const created = await res.json();
      setHabits([...habits, created]);
      setNewHabit({ name: '', description: '', category: 'morning', time: '', color: '#10b981', icon: '✨' });
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to add habit:', error);
    }
  };

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  const filteredHabits = habits.filter((habit) => {
    if (categoryFilter === 'all') return true;
    return habit.category === categoryFilter;
  });

  const todayStr = format(selectedDate, 'yyyy-MM-dd');
  const completedToday = filteredHabits.filter((h) => (h.completedDates || []).includes(todayStr)).length;
  const totalHabits = filteredHabits.length;
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  const overallStreak = habits.length > 0 ? Math.max(...habits.map(calculateStreak)) : 0;
  const totalXP = habits.reduce((acc, h) => acc + (h.completedDates?.length || 0) * 10, 0);
  const level = Math.floor(totalXP / 100) + 1;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-32">
      {/* Imperial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-white flex items-center gap-3 uppercase">
            THE PATH OF <span className="text-emerald-600 dark:text-emerald-500">MASTERY</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg mt-1 font-medium italic">"Rituals are the foundation of the empire."</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="px-6 py-4 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 backdrop-blur-xl shadow-sm dark:shadow-none">
            <span className="text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-widest block mb-1">Imperial Level</span>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-black text-zinc-900 dark:text-white">{level}</span>
              <Award className="w-5 h-5 text-emerald-500 mb-1" />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-4 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 backdrop-blur-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shadow-sm dark:shadow-none"
            >
              {soundEnabled ? <Volume2 size={20} className="text-emerald-500" /> : <VolumeX size={20} className="text-zinc-400 dark:text-zinc-500" />}
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="group flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              NEW RITUAL
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "TODAY'S DISCIPLINE", value: `${completionRate}%`, unit: 'COMPLETE', icon: Target, color: 'text-emerald-500' },
          { label: 'SACRED STREAK', value: overallStreak, unit: 'DAYS', icon: Flame, color: 'text-orange-500' },
          { label: 'ACCUMULATED POWER', value: totalXP, unit: 'XP', icon: Zap, color: 'text-yellow-500' },
          { label: 'CURRENT RANK', value: level > 10 ? 'EMPEROR' : 'WARRIOR', unit: 'TITLE', icon: Crown, color: 'text-blue-500' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-3xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 backdrop-blur-xl group hover:border-emerald-500/30 transition-all shadow-sm dark:shadow-none"
          >
            <div className={`p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 w-fit mb-4 group-hover:scale-110 transition-transform ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
            <div className="flex items-end gap-1 mt-1">
              <h3 className="text-2xl font-black text-zinc-900 dark:text-white">{stat.value}</h3>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-600 font-bold mb-1">{stat.unit}</span>
            </div>
          </motion.div>
        ))}
      </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-[#16161d] rounded-2xl p-5 border border-zinc-200 dark:border-zinc-800/50 shadow-sm dark:shadow-none"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-violet-500/20">
              <TrendingUp className="w-5 h-5 text-violet-400" />
            </div>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">Level</span>
          </div>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white">{level}</p>
          <div className="mt-1">
            <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
                style={{ width: `${totalXP % 100}%` }}
              />
            </div>
          </div>
        </motion.div>

      
      {/* Week Calendar */}
      <div className="bg-white dark:bg-[#16161d] rounded-2xl p-5 border border-zinc-200 dark:border-zinc-800/50 shadow-sm dark:shadow-none">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setSelectedDate(subWeeks(selectedDate, 1))}
            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
          >
            <ChevronLeft size={18} className="dark:text-white" />
          </button>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
            <span className="font-medium text-zinc-900 dark:text-white">{format(selectedDate, 'MMMM yyyy')}</span>
          </div>
          <button
            onClick={() => setSelectedDate(addWeeks(selectedDate, 1))}
            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
          >
            <ChevronRight size={18} className="dark:text-white" />
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => {
            const isSelected = isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());
            const dayStr = format(day, 'yyyy-MM-dd');
            const dayCompleted = habits.filter(h => (h.completedDates || []).includes(dayStr)).length;
            const dayTotal = habits.length;
            const dayRate = dayTotal > 0 ? dayCompleted / dayTotal : 0;
            
            return (
              <button
                key={day.toString()}
                onClick={() => setSelectedDate(day)}
                className={`relative flex flex-col items-center p-4 rounded-2xl transition-all border ${
                  isSelected 
                    ? 'bg-emerald-500/20 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                    : 'bg-zinc-50 dark:bg-zinc-900/30 border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-500 mb-1">{format(day, 'EEE')}</span>
                <span className={`text-xl font-black ${isToday ? 'text-emerald-500 dark:text-emerald-400' : 'text-zinc-900 dark:text-white'}`}>
                  {format(day, 'd')}
                </span>
                {dayTotal > 0 && (
                  <div className="mt-3 w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div 
                      layout
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${dayRate * 100}%` }}
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
        {(['all', 'morning', 'afternoon', 'evening'] as const).map((cat) => {
          const count = cat === 'all' 
            ? habits.length 
            : habits.filter(h => h.category === cat).length;
          const colors = cat !== 'all' ? CATEGORY_COLORS[cat] : { bg: 'bg-zinc-100 dark:bg-zinc-800', text: 'text-zinc-900 dark:text-white', border: 'border-zinc-200 dark:border-zinc-700' };
          
          return (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-3 border ${
                categoryFilter === cat 
                  ? `${colors.bg} ${colors.text} ${colors.border} shadow-lg` 
                  : 'bg-white dark:bg-zinc-900/50 text-zinc-500 dark:text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              {cat === 'all' ? 'All Rituals' : cat}
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${categoryFilter === cat ? 'bg-black/20' : 'bg-zinc-200 dark:bg-zinc-800'}`}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Habits List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredHabits
            .sort((a, b) => (a.time || '23:59').localeCompare(b.time || '23:59'))
            .map((habit) => {
              const completedDates = habit.completedDates || [];
              const isCompleted = completedDates.includes(todayStr);
              const streak = calculateStreak(habit);
              const catColors = habit.category ? CATEGORY_COLORS[habit.category as keyof typeof CATEGORY_COLORS] : CATEGORY_COLORS.morning;
              
              return (
                <motion.div
                  key={habit.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`group relative overflow-hidden rounded-3xl p-1 transition-all ${
                     isCompleted ? 'bg-gradient-to-r from-emerald-500/20 to-zinc-900/50' : 'bg-zinc-900/50'
                  }`}
                >
                  <div className={`relative bg-[#0a0a0f]/80 backdrop-blur-xl rounded-[1.3rem] p-5 border transition-all flex items-center gap-6 ${
                    isCompleted 
                      ? 'border-emerald-500/30' 
                      : 'border-zinc-800/50 hover:border-zinc-700'
                  }`}>
                    
                    {/* Completion Button */}
                    <motion.button
                      onClick={() => toggleHabit(habit.id)}
                      whileTap={{ scale: 0.9 }}
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                          : 'bg-zinc-900 border-2 border-zinc-800 text-zinc-600 hover:border-zinc-600'
                      }`}
                    >
                      {isCompleted ? <Check size={28} strokeWidth={3} /> : <div className="w-5 h-5 rounded-md border-2 border-current opacity-50" />}
                    </motion.button>

                    {/* Habit Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className={`font-bold text-lg tracking-tight ${isCompleted ? 'text-zinc-500 line-through decoration-2 decoration-emerald-500/50' : 'text-white'}`}>
                          {habit.name}
                        </h3>
                        {habit.category && (
                           <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${catColors.bg} ${catColors.text}`}>
                              {habit.category}
                           </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs font-medium text-zinc-500">
                        {habit.time && (
                          <span className="flex items-center gap-1.5 bg-zinc-900/50 px-2 py-1 rounded-lg">
                            <Clock size={12} className={isCompleted ? 'text-emerald-500/50' : 'text-emerald-500'} />
                            {habit.time}
                          </span>
                        )}
                        {streak > 0 && (
                           <span className="flex items-center gap-1.5 bg-zinc-900/50 px-2 py-1 rounded-lg">
                              <Flame size={12} className={streak > 3 ? 'text-orange-500' : 'text-zinc-600'} />
                              <span className={streak > 3 ? 'text-orange-400 font-bold' : ''}>{streak} Day Streak</span>
                           </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
                      <button
                        onClick={() => setEditingHabit(habit)}
                        className="p-3 rounded-xl hover:bg-zinc-800 text-zinc-500 hover:text-white transition-colors"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => deleteHabit(habit.id)}
                        className="p-3 rounded-xl hover:bg-red-500/10 text-zinc-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </AnimatePresence>

        {/* Empty State */}
        {filteredHabits.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24 bg-zinc-900/20 rounded-[2.5rem] border border-dashed border-zinc-800"
          >
            <div className="w-20 h-20 mx-auto rounded-3xl bg-zinc-900 flex items-center justify-center mb-6 shadow-xl">
              <Sparkles className="w-10 h-10 text-zinc-700" />
            </div>
            <h3 className="text-xl font-black text-zinc-500 uppercase tracking-tight mb-2">
               Sector Empty
            </h3>
            <p className="text-zinc-600 font-medium mb-8 max-w-xs mx-auto">
               No rituals established in this timeframe. Initiate new protocols to maintain discipline.
            </p>
            {habits.length === 0 && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-sm shadow-lg shadow-emerald-600/20 transition-all hover:scale-105"
              >
                Establish Protocol
              </button>
            )}
          </motion.div>
        )}
      </div>

      {/* Add Habit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#111118] rounded-[2.5rem] p-8 w-full max-w-lg border border-zinc-800 shadow-2xl relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />

              <div className="flex items-center justify-between mb-8 relative z-10">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">New Ritual</h2>
                  <p className="text-zinc-500 text-sm mt-1">Define a new protocol for success</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors border border-zinc-800"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6 relative z-10">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Ritual Name</label>
                  <input
                    type="text"
                    value={newHabit.name}
                    onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                    placeholder="e.g. Morning Iron Protocol"
                    className="w-full px-5 py-4 rounded-2xl bg-zinc-950 border border-zinc-800/50 text-white font-bold placeholder-zinc-700 focus:outline-none focus:border-emerald-500/50 focus:bg-zinc-900 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Strategic Intent (Description)</label>
                  <input
                    type="text"
                    value={newHabit.description}
                    onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                    placeholder="Why must this be done?"
                    className="w-full px-5 py-4 rounded-2xl bg-zinc-950 border border-zinc-800/50 text-white placeholder-zinc-700 focus:outline-none focus:border-emerald-500/50 focus:bg-zinc-900 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Execution Time</label>
                    <input
                      type="time"
                      value={newHabit.time}
                      onChange={(e) => setNewHabit({ ...newHabit, time: e.target.value })}
                      className="w-full px-5 py-4 rounded-2xl bg-zinc-950 border border-zinc-800/50 text-white font-mono focus:outline-none focus:border-emerald-500/50 focus:bg-zinc-900 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Symbol</label>
                    <input
                      type="text"
                      value={newHabit.icon}
                      onChange={(e) => setNewHabit({ ...newHabit, icon: e.target.value })}
                      placeholder="✨"
                      className="w-full px-5 py-4 rounded-2xl bg-zinc-950 border border-zinc-800/50 text-white text-center text-xl focus:outline-none focus:border-emerald-500/50 focus:bg-zinc-900 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Timeframe</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['morning', 'afternoon', 'evening'] as const).map((cat) => {
                      const colors = CATEGORY_COLORS[cat];
                      const isSelected = newHabit.category === cat;
                      return (
                        <button
                          key={cat}
                          onClick={() => setNewHabit({ ...newHabit, category: cat })}
                          className={`py-3 px-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                            isSelected
                              ? `${colors.bg} ${colors.text} ${colors.border}`
                              : 'bg-zinc-950 text-zinc-600 border-zinc-800 hover:border-zinc-700'
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={addHabit}
                  disabled={!newHabit.name.trim()}
                  className="w-full py-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed mt-4 active:scale-95 transition-all"
                >
                  Initiate Protocol
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
