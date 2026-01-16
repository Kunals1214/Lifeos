'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, Circle, Plus, Sparkles, Brain, Heart, TrendingUp,
  BookOpen, Dumbbell, DollarSign, Users, Target, Flame, Star,
  Sun, Moon, Zap, Award, ChevronRight, Play, Pause, RotateCcw, Crown, LayoutTemplate,
  Calendar, Briefcase, Coffee, Activity, ChevronLeft, Quote
} from 'lucide-react';
import { api } from '@/lib/api';
import { Task, Habit } from '@/lib/types';
import DailyProtocol from './DailyProtocol';

// Hindu Philosophy & Motivation Quotes
const WISDOM_QUOTES = [
  { text: "You have the right to work, but never to the fruit of work.", source: "Bhagavad Gita 2.47", category: "karma" },
  { text: "The mind is everything. What you think you become.", source: "Buddha", category: "mindset" },
  { text: "When you want something, all the universe conspires in helping you achieve it.", source: "Paulo Coelho", category: "success" },
  { text: "Your work is to discover your world and then with all your heart give yourself to it.", source: "Buddha", category: "purpose" },
  { text: "The only way to do great work is to love what you do.", source: "Steve Jobs", category: "success" },
  { text: "Set your heart upon your work but never its reward.", source: "Bhagavad Gita", category: "karma" },
  { text: "A person can rise through the efforts of his own mind.", source: "Bhagavad Gita 6.5", category: "growth" },
  { text: "Wealth is not his that has it, but his that enjoys it.", source: "Benjamin Franklin", category: "wealth" },
  { text: "The successful warrior is the average man, with laser-like focus.", source: "Bruce Lee", category: "success" },
  { text: "Meditation is the dissolution of thoughts in eternal awareness.", source: "Voltaire", category: "meditation" },
];

const BILLIONAIRE_AFFIRMATIONS = [
  "I am worthy of massive success and abundance",
  "Money flows to me easily and effortlessly",
  "I think like a billionaire, I act like a billionaire",
  "Every day I am becoming wealthier and wiser",
  "I create value and wealth follows naturally",
  "My mind is a powerful tool for creating success",
  "I am destined for greatness and prosperity",
  "Opportunities are everywhere, I see them clearly",
];

const LIFE_AREAS = [
  { id: 'health', name: 'Health & Fitness', icon: Heart, color: 'from-rose-500 to-pink-600', bgColor: 'bg-rose-500/20' },
  { id: 'wealth', name: 'Wealth & Finance', icon: DollarSign, color: 'from-emerald-500 to-teal-600', bgColor: 'bg-emerald-500/20' },
  { id: 'wisdom', name: 'Knowledge & Growth', icon: BookOpen, color: 'from-violet-500 to-purple-600', bgColor: 'bg-violet-500/20' },
  { id: 'mindset', name: 'Mindset & Spirit', icon: Brain, color: 'from-amber-500 to-orange-600', bgColor: 'bg-amber-500/20' },
  { id: 'social', name: 'Relationships', icon: Users, color: 'from-cyan-500 to-blue-600', bgColor: 'bg-cyan-500/20' },
  { id: 'career', name: 'Career & Skills', icon: Target, color: 'from-indigo-500 to-blue-600', bgColor: 'bg-indigo-500/20' },
];

const USER_STATS = {
  height: "181 cm",
  weight: "79 kg",
  chest: "3'3\"",
  stomach: "3'2\""
};

import { useTheme } from '@/context/ThemeContext';

export default function Dashboard() {
  const { theme } = useTheme();
  // State declarations
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [currentQuote, setCurrentQuote] = useState(WISDOM_QUOTES[0]);
  const [currentAffirmation, setCurrentAffirmation] = useState(BILLIONAIRE_AFFIRMATIONS[0]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [meditationActive, setMeditationActive] = useState(false);
  const [meditationTime, setMeditationTime] = useState(0);
  const [streak, setStreak] = useState(7);


  // Remove local theme checking effect since we use context now
  useEffect(() => {
    loadData();
    // Rotate quotes every 30 seconds
    const quoteInterval = setInterval(() => {
      setCurrentQuote(WISDOM_QUOTES[Math.floor(Math.random() * WISDOM_QUOTES.length)]);
      setCurrentAffirmation(BILLIONAIRE_AFFIRMATIONS[Math.floor(Math.random() * BILLIONAIRE_AFFIRMATIONS.length)]);
    }, 30000);

    return () => {
      clearInterval(quoteInterval);
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (meditationActive) {
      interval = setInterval(() => setMeditationTime(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [meditationActive]);

  async function loadData() {
    try {
      const [tasksRes, habitsRes] = await Promise.all([
        api.tasks.list(),
        api.habits.list()
      ]);
      setTasks(Array.isArray(tasksRes) ? tasksRes : []);
      setHabits(Array.isArray(habitsRes) ? habitsRes : []);
    } catch (err) {
      console.error("Failed to load data", err);
    } finally {
      setIsLoading(false);
    }
  }

  const toggleTask = async (task: Task) => {
    const newStatus: Task['status'] = task.status === 'completed' ? 'todo' : 'completed';
    const updatedTask = { ...task, status: newStatus };
    setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
    try {
      await api.tasks.update(updatedTask);
    } catch (err) {
      console.error(err);
    }
  };

  const addQuickTask = async () => {
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      status: 'todo',
      priority: 'medium',
      category: 'Personal',
      tags: [],
      subtasks: [],
      createdAt: new Date().toISOString(),
    };
    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    setShowQuickAdd(false);
    try {
      await api.tasks.add(newTask);
    } catch (err) {
      console.error(err);
    }
  };

  const todayTasks = tasks.filter(t => t.status !== 'completed').slice(0, 5);
  const completedToday = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedToday / totalTasks) * 100) : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good Morning', icon: Sun, color: 'text-amber-400' };
    if (hour < 17) return { text: 'Good Afternoon', icon: Sun, color: 'text-orange-400' };
    return { text: 'Good Evening', icon: Moon, color: 'text-indigo-400' };
  };

  const greeting = getGreeting();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-[#0a0a0f]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // --- LIGHT MODE LAYOUT (Professional & Clean) ---
  if (theme === 'light') {
    return (
      <div className="space-y-8 animate-in fade-in duration-500 max-w-[1600px] mx-auto p-4 md:p-8">
        {/* Header - Matches HTML Layout */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4 text-slate-400">
            <button className="hover:text-slate-600 bg-white p-2 rounded-full shadow-sm transition-all border border-slate-100">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-6 font-medium text-sm">
              <span className="text-slate-800 font-bold border-b-2 border-slate-800 pb-0.5">DASHBOARD</span>
              <span className="hover:text-slate-600 cursor-pointer transition-colors">INSIGHTS</span>
              <span className="hover:text-slate-600 cursor-pointer transition-colors">CHANNELS</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-slate-50 bg-indigo-500 flex items-center justify-center text-white text-xs">JD</div>
                <div className="w-8 h-8 rounded-full border-2 border-slate-50 bg-emerald-500 flex items-center justify-center text-white text-xs">AM</div>
             </div>
             <span className="text-xs font-medium text-slate-500">Family Plan</span>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-6">
          {/* Hero Stats Card - Blue Gradient */}
          <div className="col-span-12 lg:col-span-8 bg-gradient-to-br from-[#457b9d] to-[#1d3557] rounded-3xl p-8 relative overflow-hidden shadow-lg text-white group min-h-[300px] flex flex-col justify-center transform hover:scale-[1.01] transition-all duration-500">
             <div className="absolute top-0 right-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
             <div className="absolute -right-10 -top-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
             
             <div className="relative z-10 w-full lg:w-2/3">
                <p className="text-blue-100 mb-1 font-medium font-display">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                <h2 className="text-4xl lg:text-5xl font-bold mb-4 font-display">Keep it up, Operator!</h2>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-5xl font-light font-display">82<span className="text-2xl opacity-70">%</span></div>
                  <div className="h-12 w-[1px] bg-white/20"></div>
                  <div>
                    <div className="flex text-yellow-300 mb-1">
                      <Star size={16} fill="currentColor" />
                      <Star size={16} fill="currentColor" />
                      <Star size={16} fill="currentColor" />
                      <Star size={16} fill="currentColor" />
                      <Star size={16} className="text-white/30" fill="currentColor" />
                    </div>
                    <p className="text-sm text-blue-100 font-display">Daily Goal</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/5">
                    <TrendingUp size={16} />
                    <span className="text-sm font-medium">Streak: {streak} days</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/5">
                    <CheckCircle2 size={16} />
                    <span className="text-sm font-medium">{completedToday}/{totalTasks} Habits</span>
                  </div>
                </div>
             </div>

             <button className="absolute bottom-0 right-0 bg-[#344b5a] hover:bg-[#2c3e4b] text-white px-8 py-4 rounded-tl-3xl rounded-br-3xl flex items-center gap-2 transition-all font-semibold shadow-lg">
                VIEW FULL STATS
                <ChevronRight size={16} />
             </button>
          </div>

          {/* Consistency Card - Orange Theme */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            <div className="bg-orange-100 rounded-3xl p-8 shadow-sm relative h-full flex flex-col justify-between border border-orange-200/50">
               <div>
                 <div className="flex justify-between items-start mb-2">
                   <h3 className="font-bold text-slate-800 text-lg font-display">Consistency</h3>
                   <span className="bg-white text-xs font-bold px-2 py-1 rounded-md text-slate-500 border border-slate-100">+2%</span>
                 </div>
                 <div className="flex items-end gap-2 mb-4">
                   <span className="text-6xl font-light text-slate-800 font-display">87</span>
                   <span className="text-2xl text-slate-400 mb-2 font-display">/100</span>
                 </div>
                 <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    Your consistency score increased because of your morning routine activity. <strong className="text-slate-900">Keep moving</strong> forward!
                 </p>
               </div>
               
               <button 
                onClick={() => setShowQuickAdd(true)}
                className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition-all group border border-slate-100"
               >
                 <div className="flex items-center gap-3">
                   <div className="bg-orange-100 p-2 rounded-full text-orange-500">
                     <Plus size={20} />
                   </div>
                   <div className="text-left">
                     <p className="text-xs text-slate-500">Quick Action</p>
                     <p className="font-bold text-slate-800 text-sm">Add New Habit</p>
                   </div>
                 </div>
                 <div className="bg-orange-500 text-white rounded-full p-1 group-hover:scale-110 transition-transform">
                   <ChevronRight size={16} />
                 </div>
               </button>

               {/* Decorative Circular Graph */}
               <div className="absolute top-8 right-8 w-24 h-24 opacity-80">
                 <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 36 36">
                    <path className="text-orange-200" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                    <path className="text-orange-500" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="87, 100" strokeLinecap="round" strokeWidth="3"></path>
                 </svg>
               </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
           {/* Habits List */}
           <div className="col-span-12 lg:col-span-8">
             <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold text-slate-800 text-lg font-display">Today's Habits</h3>
               <button className="text-slate-400 hover:text-emerald-500 transition-colors text-sm font-medium">View All</button>
             </div>
             
             <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 min-h-[300px]">
               {showQuickAdd && (
                 <div className="mb-6 flex gap-3 animate-in fade-in slide-in-from-top-2">
                   <input 
                     type="text" 
                     value={newTaskTitle}
                     onChange={(e) => setNewTaskTitle(e.target.value)}
                     onKeyDown={(e) => e.key === 'Enter' && addQuickTask()}
                     placeholder="New habit..."
                     className="flex-1 px-4 py-3 bg-slate-50 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                     autoFocus
                   />
                   <button onClick={addQuickTask} className="px-6 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors">Add</button>
                 </div>
               )}

               <div className="space-y-4">
                 {todayTasks.length > 0 ? todayTasks.map((task) => (
                   <div key={task.id} className="flex items-center group">
                     <label className="relative flex items-center cursor-pointer p-4 rounded-2xl hover:bg-slate-50 w-full transition-all border border-transparent hover:border-slate-100 group-hover:shadow-sm">
                       <input 
                        type="checkbox" 
                        checked={task.status === 'completed'}
                        onChange={() => toggleTask(task)}
                        className="w-6 h-6 rounded-lg text-emerald-500 border-slate-300 focus:ring-emerald-500"
                       />
                       <div className="ml-4 flex-1">
                         <span className={`block text-sm font-bold transition-all ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                           {task.title}
                         </span>
                         <span className="block text-xs text-slate-400 mt-0.5 font-medium">
                           {task.category || 'General'} • {task.priority}
                         </span>
                       </div>
                       <div className={`p-2 rounded-full transition-colors ${task.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                         <Activity size={18} />
                       </div>
                     </label>
                   </div>
                 )) : (
                   <div className="text-center py-10 text-slate-400">
                     <p>Time to schedule your day.</p>
                   </div>
                 )}
               </div>
             </div>
           </div>

           {/* Best Streaks */}
           <div className="col-span-12 lg:col-span-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800 text-lg font-display">Best Streaks</h3>
                <span className="bg-white px-3 py-1 rounded-full text-xs text-slate-500 font-bold border border-slate-100 shadow-sm">This Week</span>
              </div>
              
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 h-full flex flex-col justify-center min-h-[300px]">
                <ul className="space-y-6">
                   {[
                     { name: 'Early Sleep', cat: 'Wellness', days: 24, color: 'bg-purple-100 text-purple-600', letters: 'ES' },
                     { name: 'Coding Session', cat: 'Career', days: 18, color: 'bg-blue-100 text-blue-600', letters: 'CS' },
                     { name: 'No Phone Bed', cat: 'Health', days: 12, color: 'bg-pink-100 text-pink-600', letters: 'NP' },
                   ].map((item, i) => (
                     <li key={i} className="flex items-center justify-between">
                       <div className="flex items-center gap-4">
                         <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center font-bold text-sm`}>
                           {item.letters}
                         </div>
                         <div>
                           <p className="font-bold text-slate-800 text-sm">{item.name}</p>
                           <p className="text-xs text-slate-400 font-medium">{item.cat}</p>
                         </div>
                       </div>
                       <div className="flex items-center gap-1.5 bg-orange-50 px-3 py-1.5 rounded-full">
                         <Flame size={14} className="text-orange-500" />
                         <span className="font-bold text-slate-700 text-xs">{item.days}</span>
                       </div>
                     </li>
                   ))}
                </ul>
                
                <div className="mt-8 pt-6 border-t border-slate-50">
                   <button className="w-full py-3 text-center text-indigo-600 text-sm font-bold hover:bg-indigo-50 rounded-xl transition-colors">
                     View All Achievements
                   </button>
                </div>
              </div>
           </div>
        </div>
      </div>
    );
  }

  // --- DARK MODE LAYOUT (Futuristic & Glass) ---
  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      
      {/* 1. Header Section - Minimal & High Tech */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
        <div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-2 font-sans bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/50">
            DASHBOARD
          </h1>
          <div className="flex items-center gap-3 text-emerald-400/80 font-mono text-sm tracking-[0.2em] uppercase">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
            System Online
            <span className="text-white/20">|</span>
            v2.4.0
          </div>
        </div>

        {/* Quick Actions Deck */}
        <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md rounded-2xl p-2 border border-white/10 shadow-2xl">
          <button 
            onClick={() => setShowQuickAdd(true)}
            className="flex items-center gap-3 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/5 group"
          >
            <Plus className="w-5 h-5 text-emerald-400 group-hover:rotate-90 transition-transform" />
            <span className="text-sm font-bold text-white tracking-wide">NEW PROTOCOL</span>
          </button>
          
          <div className="w-[1px] h-8 bg-white/10"></div>
          
          <div className="flex gap-1">
             <button className="p-3 hover:bg-white/10 rounded-xl transition-colors text-zinc-400 hover:text-white">
                <LayoutTemplate className="w-5 h-5" />
             </button>
             <button className="p-3 hover:bg-white/10 rounded-xl transition-colors text-zinc-400 hover:text-white">
                <Zap className="w-5 h-5" />
             </button>
          </div>
        </div>
      </header>

      {/* 2. Main Grid Layout */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* Left Column: Stats & Matrix (8 Cols) */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          
          {/* Hero Matrix Card */}
          <div className="relative overflow-hidden rounded-[2.5rem] bg-[#0a0a0f] border border-white/10 p-10 group">
             {/* Dynamic Background */}
             <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-[#0a0a0f] to-emerald-900/20 opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
             
             {/* Grid Patern Overlay */}
             <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none"></div>

             <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div>
                   <h2 className="text-3xl font-light text-white mb-2">
                      <span className="font-bold">Good {greeting.text.split(' ')[1]}</span>, Architect.
                   </h2>
                   <p className="text-zinc-400 text-lg max-w-md leading-relaxed">
                      Your empire is currently operating at <span className="text-emerald-400 font-bold">{completionRate}% efficiency</span>.
                      Focus levels are optimal.
                   </p>
                </div>

                <div className="flex items-center gap-6">
                   <div className="text-right">
                      <div className="text-5xl font-bold text-white tracking-tighter tabular-nums">
                         {formatTime(meditationTime)}
                      </div>
                      <div className="text-emerald-500/80 text-xs font-mono tracking-widest uppercase mt-1">
                         Flow State Timer
                      </div>
                   </div>
                   <button 
                      onClick={() => setMeditationActive(!meditationActive)}
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-all ${meditationActive ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400' : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 hover:scale-105'}`}
                   >
                      {meditationActive ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
                   </button>
                </div>
             </div>

             {/* Stats Row */}
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
                {[ 
                  { label: "Day Streak", val: streak, icon: Flame, col: "text-orange-400", bg: "from-orange-500/10 to-transparent" },
                  { label: "Missions", val: `${completedToday}/${totalTasks}`, icon: Target, col: "text-blue-400", bg: "from-blue-500/10 to-transparent" },
                  { label: "Knowledge", val: "Lvl 42", icon: Brain, col: "text-purple-400", bg: "from-purple-500/10 to-transparent" },
                  { label: "Net Worth", val: "+2.4%", icon: TrendingUp, col: "text-emerald-400", bg: "from-emerald-500/10 to-transparent" }
                ].map((s, i) => (
                  <div key={i} className={`bg-gradient-to-br ${s.bg} border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors`}>
                     <div className={`p-2 rounded-lg bg-white/5 w-fit ${s.col} mb-3`}>
                        <s.icon size={20} />
                     </div>
                     <div className="text-2xl font-bold text-white mb-1">{s.val}</div>
                     <div className="text-xs text-zinc-500 uppercase tracking-wider font-bold">{s.label}</div>
                  </div>
                ))}
             </div>
          </div>
          
          {/* Tasks Terminal */}
          <div className="bg-[#0f0f13] rounded-[2.5rem] border border-white/5 p-8 flex-1 min-h-[400px]">
             <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                   <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                   <h3 className="text-xl font-bold text-white tracking-wide">MISSION LOG</h3>
                </div>
                <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1 border border-white/5">
                   {['All', 'Priority', 'Done'].map(tab => (
                      <button key={tab} className="px-4 py-1.5 rounded-md text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-all">
                         {tab}
                      </button>
                   ))}
                </div>
             </div>

             <div className="space-y-3">
                <AnimatePresence>
                {showQuickAdd && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mb-4"
                  >
                     <div className="flex items-center gap-4 bg-white/5 border border-emerald-500/30 rounded-2xl p-2 pl-6">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <input 
                           autoFocus
                           type="text" 
                           placeholder="Enter mission directive..."
                           className="bg-transparent border-none focus:ring-0 text-white placeholder-zinc-600 flex-1 h-12 text-sm font-mono"
                           value={newTaskTitle}
                           onChange={(e) => setNewTaskTitle(e.target.value)}
                           onKeyDown={(e) => e.key === 'Enter' && addQuickTask()}
                        />
                        <button onClick={addQuickTask} className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 px-6 py-3 rounded-xl text-xs font-bold font-mono tracking-wider transition-colors border border-emerald-500/20">
                           EXECUTE
                        </button>
                     </div>
                  </motion.div>
                )}
                </AnimatePresence>

                {todayTasks.length === 0 ? (
                   <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl m-4">
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                         <CheckCircle2 className="text-zinc-600" size={24} />
                      </div>
                      <p className="text-zinc-500 font-mono text-sm">ALL SYSTEMS CLEAR</p>
                   </div>
                ) : (
                  todayTasks.map((task, i) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => toggleTask(task)}
                      className="group flex items-center gap-6 p-5 rounded-2xl hover:bg-white/5 cursor-pointer border border-transparent hover:border-white/5 transition-all active:scale-[0.99]"
                    >
                      <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                        task.status === 'completed' 
                           ? 'bg-emerald-500 border-emerald-500' 
                           : 'border-zinc-700 group-hover:border-emerald-500/50'
                      }`}>
                         {task.status === 'completed' && <CheckCircle2 size={14} className="text-[#0a0a0f]" strokeWidth={3} />}
                      </div>
                      
                      <div className="flex-1">
                         <h4 className={`text-base font-medium transition-colors ${
                              task.status === 'completed' ? 'text-zinc-600 line-through' : 'text-zinc-200 group-hover:text-white'
                           }`}>
                            {task.title}
                         </h4>
                         <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-600 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                               {task.category || 'GENERAL'}
                            </span>
                            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-600">
                               PRIORITY: {task.priority}
                            </span>
                         </div>
                      </div>

                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                         <ChevronRight className="text-zinc-500" size={18} />
                      </div>
                    </motion.div>
                  ))
                )}
             </div>
          </div>
        </div>

        {/* Right Column: Life OS (4 Cols) */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
           
           {/* Life Areas Hex Grid */}
           <div className="bg-[#0f0f13] rounded-[2.5rem] p-8 border border-white/5">
              <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-6">Life Modules</h3>
              <div className="grid grid-cols-2 gap-3">
                 {LIFE_AREAS.map(area => (
                    <div key={area.id} className="bg-white/[0.03] hover:bg-white/[0.06] p-4 rounded-2xl cursor-pointer group transition-colors border border-white/5">
                       <area.icon className="w-8 h-8 text-zinc-600 group-hover:text-white transition-colors mb-4" />
                       <div className="text-zinc-300 font-bold text-sm leading-tight group-hover:text-white">{area.name}</div>
                       <div className="w-full bg-white/10 h-1 mt-3 rounded-full overflow-hidden">
                          <div className={`h-full bg-gradient-to-r ${area.color} w-2/3`}></div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* Quote Card */}
           <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -z-10"></div>
              <Quote size={40} className="text-white/20 mb-4" />
              <p className="text-xl font-medium text-white leading-relaxed mb-4 font-serif italic">
                 "{currentQuote.text}"
              </p>
              <p className="text-sm text-purple-200 font-bold uppercase tracking-widest">
                 — {currentQuote.source}
              </p>
           </div>

        </div>
      </div>
    </div>
  );
}
