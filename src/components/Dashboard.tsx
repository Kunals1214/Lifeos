'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, Circle, Plus, Sparkles, Brain, Heart, TrendingUp,
  BookOpen, Dumbbell, DollarSign, Users, Target, Flame, Star,
  Sun, Moon, Zap, Award, ChevronRight, Play, Pause, RotateCcw, Crown, LayoutTemplate,
  Calendar, Briefcase, Coffee
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

export default function Dashboard() {
  const [isLightMode, setIsLightMode] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuote, setCurrentQuote] = useState(WISDOM_QUOTES[0]);
  const [currentAffirmation, setCurrentAffirmation] = useState(BILLIONAIRE_AFFIRMATIONS[0]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [meditationActive, setMeditationActive] = useState(false);
  const [meditationTime, setMeditationTime] = useState(0);
  const [streak, setStreak] = useState(7);

  useEffect(() => {
    loadData();
    // Rotate quotes every 30 seconds
    const quoteInterval = setInterval(() => {
      setCurrentQuote(WISDOM_QUOTES[Math.floor(Math.random() * WISDOM_QUOTES.length)]);
      setCurrentAffirmation(BILLIONAIRE_AFFIRMATIONS[Math.floor(Math.random() * BILLIONAIRE_AFFIRMATIONS.length)]);
    }, 30000);

    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsLightMode(!isDark);
    };
    checkTheme();
    
    // Observer for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      clearInterval(quoteInterval);
      observer.disconnect();
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
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // --- LIGHT MODE LAYOUT ---
  if (isLightMode) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 pb-32 pt-6 px-4">
        {/* Modern Clean Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <greeting.icon className={`w-6 h-6 ${greeting.color}`} />
              <span className="text-zinc-500 font-medium">{greeting.text}, Warrior</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-800 tracking-tight">Daily Overview</h1>
          </div>
          <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
             <div className="px-4 py-2 bg-slate-50 rounded-lg">
                <span className="text-xs text-slate-500 font-semibold uppercase">Focus Time</span>
                <p className="font-bold text-slate-800">128m</p>
             </div>
             <div className="px-4 py-2 bg-slate-50 rounded-lg">
                <span className="text-xs text-slate-500 font-semibold uppercase">Streak</span>
                <p className="font-bold text-indigo-600">{streak} Days</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* AI Protocol Section - Prominent */}
            <section className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xl shadow-slate-200/50">
               <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                 <Sparkles className="w-5 h-5 text-indigo-500" />
                 <h2 className="text-xl font-bold text-slate-800">AI Daily Protocol</h2>
               </div>
               <DailyProtocol userStats={USER_STATS} />
            </section>

            {/* Tasks Section - Clean List */}
            <section className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xl shadow-slate-200/50">
              <div className="flex justify-between items-center mb-6">
                 <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <h2 className="text-xl font-bold text-slate-800">Your Missions</h2>
                 </div>
                 <button 
                  onClick={() => setShowQuickAdd(!showQuickAdd)}
                  className="p-2 hover:bg-slate-50 rounded-full transition-colors"
                 >
                   <Plus className="w-5 h-5 text-slate-500" />
                 </button>
              </div>

              {showQuickAdd && (
                <div className="mb-6 flex gap-2">
                   <input 
                     type="text" 
                     value={newTaskTitle}
                     onChange={(e) => setNewTaskTitle(e.target.value)}
                     onKeyDown={(e) => e.key === 'Enter' && addQuickTask()}
                     placeholder="Add a new mission..."
                     className="flex-1 px-4 py-3 bg-slate-50 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 placeholder-slate-400"
                   />
                   <button onClick={addQuickTask} className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors">Add</button>
                </div>
              )}

              <div className="space-y-3">
                {todayTasks.map((task) => (
                  <div key={task.id} onClick={() => toggleTask(task)} className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group border border-transparent hover:border-slate-100">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.status === 'completed' ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 group-hover:border-indigo-400'}`}>
                      {task.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </div>
                    <span className={`text-lg transition-colors ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{task.title}</span>
                  </div>
                ))}
                {todayTasks.length === 0 && <p className="text-slate-400 text-center italic py-4">All captured tasks complete.</p>}
              </div>
            </section>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
             {/* Quote Card */}
             <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white shadow-lg shadow-indigo-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                <BookOpen className="w-8 h-8 text-indigo-100 mb-6" />
                <p className="text-xl font-medium leading-relaxed mb-6 opacity-95">"{currentQuote.text}"</p>
                <div className="flex items-center gap-2 text-indigo-100 text-sm font-bold uppercase tracking-wider">
                  <span className="w-8 h-[1px] bg-indigo-200"></span>
                  {currentQuote.source}
                </div>
             </div>

             {/* Categories Grid */}
             <div className="grid grid-cols-2 gap-4">
                {LIFE_AREAS.map((area) => (
                  <div key={area.id} className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col items-center text-center gap-3">
                     <div className={`w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600`}>
                        <area.icon className="w-5 h-5" />
                     </div>
                     <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">{area.name.split(' ')[0]}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-32">
      {/* Imperial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-white flex items-center gap-3 uppercase">
            IMPERIAL <span className="text-emerald-600 dark:text-emerald-500">COMMAND</span>
          </h1>
          <p className="text-zinc-500 text-lg mt-1 font-medium italic">"Build your empire, master your mind."</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="px-6 py-4 rounded-2xl bg-white border border-zinc-200 dark:bg-zinc-900/50 dark:border-zinc-800/50 backdrop-blur-xl shadow-sm dark:shadow-none">
            <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest block mb-1">Current Status</span>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-black text-zinc-900 dark:text-white">WARRIOR</span>
              <Crown className="w-5 h-5 text-emerald-600 dark:text-emerald-500 mb-1" />
            </div>
          </div>
        </div>
      </div>

      {/* NEW AI PROTOCOL SECTION FOR IMPERIAL MODE */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <DailyProtocol userStats={USER_STATS} />
      </motion.div>

      {/* Wisdom Quote Card */}
      <motion.div
        key={currentQuote.text}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-[2rem] bg-white border border-zinc-200 dark:bg-zinc-900/50 dark:border-zinc-800/50 backdrop-blur-xl p-8 group hover:border-emerald-500/30 transition-all shadow-sm dark:shadow-none"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-[80px] -z-10" />
        <Sparkles className="w-8 h-8 text-emerald-600 dark:text-emerald-500 mb-4" />
        <blockquote className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white mb-4 leading-relaxed uppercase tracking-tight">
          &ldquo;{currentQuote.text}&rdquo;
        </blockquote>
        <cite className="text-emerald-600 dark:text-emerald-400 text-lg not-italic font-bold tracking-widest">— {currentQuote.source}</cite>
      </motion.div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'DISCIPLINE STREAK', value: `${streak} DAYS`, icon: Flame, color: 'text-orange-500' },
          { label: 'MISSIONS CLEARED', value: `${completedToday}/${totalTasks}`, icon: CheckCircle2, color: 'text-emerald-500' },
          { label: 'EMPIRE LEVEL', value: '42', icon: Award, color: 'text-purple-500' },
          { label: 'FOCUS DURATION', value: '128m', icon: Zap, color: 'text-cyan-500' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-3xl bg-white border border-zinc-200 dark:bg-zinc-900/50 dark:border-zinc-800/50 backdrop-blur-xl group hover:border-emerald-500/30 transition-all shadow-sm dark:shadow-none"
          >
            <div className={`p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800/50 w-fit mb-4 group-hover:scale-110 transition-transform ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
            <div className="flex items-end gap-1 mt-1">
              <h3 className="text-2xl font-black text-zinc-900 dark:text-white">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Task Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-white border border-zinc-200 dark:bg-zinc-900/50 dark:border-zinc-800/50 backdrop-blur-xl rounded-[2.5rem] p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-zinc-900 dark:text-white flex items-center gap-3 uppercase tracking-tighter">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
              </div>
              Daily Missions
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowQuickAdd(!showQuickAdd)}
              className="p-3 rounded-xl bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 border border-zinc-200 dark:border-white/10 transition-colors"
            >
              <Plus className="w-6 h-6 text-zinc-600 dark:text-white" />
            </motion.button>
          </div>

          <AnimatePresence>
            {showQuickAdd && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="overflow-hidden"
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addQuickTask()}
                    placeholder="Describe your next victory..."
                    className="flex-1 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl px-6 py-4 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                  <button
                    onClick={addQuickTask}
                    className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl text-white font-bold hover:brightness-110 transition-all"
                  >
                    Deploy
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            {todayTasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">All Clear!</h3>
                <p className="text-zinc-500">You&apos;ve conquered all missions for now.</p>
              </div>
            ) : (
              todayTasks.map((task, i) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => toggleTask(task)}
                  className="group flex items-center gap-5 p-5 rounded-[1.5rem] bg-zinc-50 dark:bg-white/5 hover:bg-zinc-100 dark:hover:bg-white/[0.08] cursor-pointer transition-all border border-zinc-200 dark:border-white/[0.03] hover:border-purple-500/30 shadow-sm dark:shadow-none"
                >
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    task.status === 'completed'
                      ? 'bg-emerald-500 border-emerald-500'
                      : 'border-zinc-300 dark:border-zinc-700 group-hover:border-purple-400'
                  }`}>
                    {task.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-white" />}
                  </div>
                  <span className={`flex-1 text-xl font-medium transition-all duration-300 ${
                    task.status === 'completed' ? 'text-zinc-500 dark:text-zinc-600 line-through' : 'text-zinc-900 dark:text-zinc-200'
                  }`}>
                    {task.title}
                  </span>
                  <ChevronRight className="w-6 h-6 text-zinc-300 dark:text-zinc-700 group-hover:text-purple-400 transition-colors" />
                </motion.div>
              ))
            )}
          </div>

          <div className="mt-10">
            <div className="flex justify-between items-center mb-3">
              <span className="text-zinc-400 font-medium uppercase tracking-wider text-xs">Campaign Progress</span>
              <span className="text-emerald-400 font-bold">{completionRate}%</span>
            </div>
            <div className="h-4 bg-white/5 rounded-full overflow-hidden p-1 border border-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionRate}%` }}
                className="h-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Mindset & Meditation - Right Column */}
        <div className="space-y-8">
          {/* Meditation Tracker */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-xl rounded-[2rem] p-8 border border-white/5"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Brain className="w-6 h-6 text-purple-400" />
              </div>
              Stillness
            </h3>
            
            <div className="text-center mb-8">
              <div className="text-6xl font-mono font-bold text-white mb-6 tracking-tighter">
                {formatTime(meditationTime)}
              </div>
              <div className="flex justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMeditationActive(!meditationActive)}
                  className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all ${
                    meditationActive 
                      ? 'bg-rose-500 text-white' 
                      : 'bg-emerald-500 text-white'
                  }`}
                >
                  {meditationActive ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => { setMeditationActive(false); setMeditationTime(0); }}
                  className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-zinc-400 hover:bg-white/20"
                >
                  <RotateCcw className="w-7 h-7" />
                </motion.button>
              </div>
            </div>

            <p className="text-zinc-500 text-center text-sm italic">
              &ldquo;The soul becomes dyed with the color of its thoughts.&rdquo;
            </p>
          </motion.div>

          {/* Billionaire Affirmation */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-xl rounded-[2rem] p-8 border border-amber-500/20"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Star className="w-6 h-6 text-amber-500" />
              </div>
              <span className="text-amber-500 font-bold uppercase tracking-widest text-xs">Emperor Mindset</span>
            </div>
            <p className="text-2xl font-bold text-white leading-tight">
              {currentAffirmation}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Life Areas Progress */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#111118]/50 backdrop-blur-xl rounded-[2rem] p-8 border border-white/5"
      >
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-cyan-400" />
          </div>
          Empire Expansion
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-6">
          {LIFE_AREAS.map((area, i) => (
            <motion.div
              key={area.id}
              whileHover={{ y: -8 }}
              className="relative p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:border-white/20 transition-all cursor-pointer group"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${area.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                <area.icon className="w-7 h-7 text-white" />
              </div>
              <p className="text-white font-bold text-sm mb-1">{area.name}</p>
              <div className="mt-4 h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.floor(Math.random() * 30 + 65)}%` }}
                  className={`h-full bg-gradient-to-r ${area.color} rounded-full`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* English Mastery Tip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 backdrop-blur-xl rounded-[2rem] p-8 border border-blue-500/20"
      >
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-2xl">
            <BookOpen className="w-12 h-12 text-white" />
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-blue-400 font-bold uppercase tracking-widest text-sm mb-2">Lexicon Growth</h3>
            <div className="flex flex-col md:flex-row items-baseline gap-4 mb-3 justify-center md:justify-start">
              <p className="text-4xl font-bold text-white tracking-tight">Perseverance</p>
              <span className="text-blue-300 font-mono">/ˌpɜːsɪˈvɪərəns/</span>
            </div>
            <p className="text-zinc-300 text-xl leading-relaxed max-w-2xl">
              Persistence in doing something despite difficulty or delay in achieving success.
            </p>
            <p className="text-zinc-500 mt-4 italic text-lg opacity-80">
              &ldquo;The masterpiece of world is built upon the foundation of relentless perseverance.&rdquo;
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
