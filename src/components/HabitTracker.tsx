'use client';

import { useState, useEffect, useCallback } from 'react';
import { Habit } from '@/lib/types';
import { 
  Check, 
  Plus, 
  Trash2, 
  Flame, 
  Edit3, 
  Sun, 
  Moon, 
  Briefcase, 
  Sparkles,
  Award,
  ChevronRight,
  Target,
  Crown
} from 'lucide-react';
import { format, isSameDay, subDays } from 'date-fns';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import AddHabitModal from './AddHabitModal';
import EditHabitModal from './EditHabitModal';

export default function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all');

  useEffect(() => {
    fetchHabits();
  }, []);

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

  const handleUpdateHabit = async (updatedHabit: Habit) => {
    try {
      await api.habits.update(updatedHabit);
      fetchHabits();
    } catch (error) {
      console.error('Failed to update habit:', error);
    }
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
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;

    const completedDates = habit.completedDates || [];
    const isCompleted = completedDates.includes(todayStr);
    
    const updatedHabits = habits.map((h) => {
      if (h.id === habitId) {
        return {
          ...h,
          completedDates: isCompleted
            ? completedDates.filter((d) => d !== todayStr)
            : [...completedDates, todayStr],
        };
      }
      return h;
    });
    setHabits(updatedHabits);

    if (!isCompleted) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: [habit.color || '#10b981', '#ffffff']
      });
    }

    try {
      await fetch('/api/habits/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ habitId, date: todayStr, completed: !isCompleted }),
      });
    } catch (error) {
      console.error('Failed to toggle habit', error);
      fetchHabits();
    }
  };

  const deleteHabit = async (habitId: string) => {
    if (!confirm('Abandon this ritual?')) return;
    setHabits(habits.filter(h => h.id !== habitId));
    try {
      await fetch(`/api/habits?id=${habitId}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Failed to delete habit', error);
      fetchHabits();
    }
  };

  const filteredHabits = habits.filter(h => 
    selectedCategory === 'all' || h.category === selectedCategory
  );

  const stats = {
    total: habits.length,
    completedToday: habits.filter(h => (h.completedDates || []).includes(format(new Date(), 'yyyy-MM-dd'))).length,
    highestStreak: habits.length > 0 ? Math.max(...habits.map(calculateStreak)) : 0
  };

  const categories = [
    { id: 'all', label: 'All Rituals', icon: Sparkles, color: 'text-white' },
    { id: 'morning', label: 'Sadhana', icon: Sun, color: 'text-orange-400' },
    { id: 'afternoon', label: 'Empire', icon: Briefcase, color: 'text-blue-400' },
    { id: 'evening', label: 'Reflection', icon: Moon, color: 'text-indigo-400' },
  ];

  if (loading) return <div className="animate-pulse space-y-4">
    <div className="h-32 bg-zinc-900 rounded-3xl" />
    <div className="h-64 bg-zinc-900 rounded-3xl" />
  </div>;

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-32">
      {/* Header & Progress */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-800 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-emerald-900/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h1 className="text-4xl font-black tracking-tighter flex items-center gap-3">
              THE PATH OF <span className="text-emerald-300">MASTERY</span>
            </h1>
            <p className="text-emerald-100/70 text-lg mt-2 font-medium">Daily rituals to forge a legendary life</p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center min-w-[100px]">
              <Flame className="w-6 h-6 text-orange-400 mx-auto mb-1" />
              <div className="text-2xl font-black">{stats.highestStreak}</div>
              <div className="text-[10px] uppercase font-bold tracking-widest opacity-60">Highest Streak</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center min-w-[100px]">
              <Target className="w-6 h-6 text-emerald-300 mx-auto mb-1" />
              <div className="text-2xl font-black">{stats.completedToday}/{stats.total}</div>
              <div className="text-[10px] uppercase font-bold tracking-widest opacity-60">Completions</div>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="relative mt-8 h-3 bg-black/20 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(stats.completedToday / (stats.total || 1)) * 100}%` }}
            className="h-full bg-gradient-to-r from-emerald-300 to-white shadow-[0_0_20px_rgba(255,255,255,0.4)]"
          />
        </div>
        
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] -mr-32 -mt-32 rounded-full"></div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap items-center gap-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all border ${
              selectedCategory === cat.id 
              ? 'bg-emerald-600/10 border-emerald-500/50 text-emerald-400' 
              : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:border-zinc-700'
            }`}
          >
            <cat.icon size={18} className={cat.color} />
            <span>{cat.label}</span>
          </button>
        ))}
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="ml-auto bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20"
        >
          <Plus size={18} />
          <span>NEW RITUAL</span>
        </button>
      </div>

      {/* Habit Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
        <AnimatePresence mode='popLayout'>
          {filteredHabits.map((habit) => {
            const isDone = (habit.completedDates || []).includes(format(new Date(), 'yyyy-MM-dd'));
            const streak = calculateStreak(habit);
            
            return (
              <motion.div
                key={habit.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`group relative overflow-hidden flex items-center gap-6 bg-[#111118] border border-zinc-800/50 p-6 rounded-[2rem] hover:border-emerald-500/30 transition-all ${isDone ? 'opacity-70' : ''}`}
              >
                {/* Status Toggle */}
                <button
                  onClick={() => toggleHabit(habit.id)}
                  className={`relative flex-shrink-0 w-16 h-16 rounded-[1.25rem] border-2 flex items-center justify-center transition-all ${
                    isDone 
                    ? 'bg-emerald-600 border-emerald-500 shadow-lg shadow-emerald-500/20' 
                    : 'bg-zinc-900 border-zinc-800 group-hover:border-emerald-500/50'
                  }`}
                >
                  {isDone ? <Check className="w-8 h-8 text-white" /> : <div className="text-2xl opacity-50">{habit.icon || ''}</div>}
                </button>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className={`text-xl font-black tracking-tight ${isDone ? 'line-through text-zinc-500' : 'text-white'}`}>
                        {habit.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 mt-2">
                         <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded">
                           <Flame size={12} />
                           {streak} Day Streak
                         </span>
                         <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 bg-zinc-800/50 px-2 py-0.5 rounded">
                           {habit.category}
                         </span>
                         {habit.time && (
                           <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                             {habit.time}
                           </span>
                         )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                         onClick={() => setEditingHabit(habit)}
                         className="p-2 text-zinc-500 hover:text-white transition-colors"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                         onClick={() => deleteHabit(habit.id)}
                         className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/5 blur-[50px] -mr-16 -mt-16 pointer-events-none"></div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {isModalOpen && (
        <AddHabitModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onAdd={fetchHabits} 
        />
      )}
      
      {editingHabit && (
        <EditHabitModal 
          isOpen={!!editingHabit} 
          onClose={() => setEditingHabit(null)} 
          habit={editingHabit}
          onSave={handleUpdateHabit}
        />
      )}
    </div>
  );
}
