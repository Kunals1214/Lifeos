'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO, isToday, isPast } from 'date-fns';
import { Task } from '@/lib/types';
import {
  Plus,
  Search,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Trash2,
  Target,
  Shield,
  Zap,
  LayoutGrid,
  List as ListIcon
} from 'lucide-react';

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab ] = useState<'active' | 'completed' | 'overdue'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  useEffect(() => {
    const saved = localStorage.getItem('lifeos-tasks');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTasks(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        console.error('Failed to parse tasks:', e);
        setTasks([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('lifeos-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { 
      ...t, 
      status: t.status === 'completed' ? 'todo' : 'completed',
      completedAt: t.status !== 'completed' ? new Date().toISOString() : undefined 
    } : t));
  };

  const addTask = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      status: 'todo',
      priority: 'medium',
      category: 'Strategic',
      tags: [],
      subtasks: [],
      createdAt: new Date().toISOString()
    };
    
    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    const isCompleted = t.status === 'completed';
    const isOverdue = t.dueDate && isPast(parseISO(t.dueDate)) && !isCompleted;

    if (activeTab === 'completed') return isCompleted && matchesSearch;
    if (activeTab === 'overdue') return isOverdue && matchesSearch;
    return !isCompleted && matchesSearch;
  });

  const stats = {
    active: tasks.filter(t => t.status !== 'completed').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(t => t.dueDate && isPast(parseISO(t.dueDate)) && t.status !== 'completed').length,
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-32">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-white flex items-center gap-3">
            MISSION <span className="text-emerald-600 dark:text-emerald-500">CONTROL</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg mt-1 font-mono uppercase tracking-tight">Execute protocols for total dominion</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white dark:bg-zinc-900/50 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
           <button 
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}`}
           >
             <ListIcon size={18} />
           </button>
           <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}`}
           >
             <LayoutGrid size={18} />
           </button>
        </div>
      </div>

      {/* Quick Deploy */}
      <form onSubmit={addTask} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-2xl blur opacity-10 group-focus-within:opacity-20 transition duration-1000"></div>
        <div className="relative flex items-center bg-white dark:bg-[#0a0a0f] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-2 focus-within:border-emerald-500/50 transition-all shadow-sm dark:shadow-none">
          <div className="pl-4 text-emerald-600 dark:text-emerald-500">
            <Shield size={20} />
          </div>
          <input 
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Initialize new directive..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 py-3 px-4 font-mono text-sm"
          />
          <button 
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all mr-1 uppercase tracking-wider text-xs"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">DEPLOY</span>
          </button>
        </div>
      </form>

      {/* Stats & Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="grid grid-cols-3 gap-2 w-full md:w-auto">
          {[
            { id: 'active', label: 'ACTIVE', count: stats.active, icon: Target },
            { id: 'overdue', label: 'BREACHED', count: stats.overdue, icon: Clock, color: 'text-red-600 dark:text-red-500' },
            { id: 'completed', label: 'CONQUERED', count: stats.completed, icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-500' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center justify-center md:justify-start gap-2 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
                activeTab === tab.id 
                ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-600 dark:text-emerald-500' 
                : 'bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-500 hover:border-emerald-500/30'
              }`}
            >
              <tab.icon size={14} className={tab.color || (activeTab === tab.id ? 'text-emerald-600 dark:text-emerald-500' : 'text-zinc-500 dark:text-zinc-600')} />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] ${activeTab === tab.id ? 'bg-emerald-500/20' : 'bg-zinc-100 dark:bg-zinc-800'}`}>{tab.count}</span>
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-600" size={16} />
          <input 
            type="text"
            placeholder="SCAN ARCHIVES..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-xs font-mono text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-500/50 w-full uppercase placeholder-zinc-400 dark:placeholder-zinc-700 shadow-sm dark:shadow-none"
          />
        </div>
      </div>

      {/* Mission Content */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-3'}>
        <AnimatePresence mode='popLayout'>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`group relative overflow-hidden bg-white dark:bg-[#111118]/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800/50 p-5 rounded-2xl hover:border-emerald-500/30 transition-all shadow-sm dark:shadow-none ${task.status === 'completed' ? 'opacity-50' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <button 
                    onClick={() => toggleTask(task.id)}
                    className="mt-1 flex-shrink-0 relative group/check"
                  >
                    {task.status === 'completed' ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-500" />
                    ) : (
                      <div className="w-6 h-6 rounded-lg border-2 border-zinc-300 dark:border-zinc-700 group-hover/check:border-emerald-500 transition-colors flex items-center justify-center">
                        <div className="w-2 h-2 bg-emerald-500 rounded-sm opacity-0 group-hover/check:opacity-100 transition-opacity"></div>
                      </div>
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="w-full">
                        <h3 className={`font-bold transition-all text-lg tracking-tight ${task.status === 'completed' ? 'line-through decoration-2 decoration-emerald-500/50 text-zinc-400 dark:text-zinc-500' : 'text-zinc-900 dark:text-white'}`}>
                          {task.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span className="text-[10px] uppercase tracking-widest text-zinc-500 dark:text-zinc-500 font-bold bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded border border-zinc-200 dark:border-zinc-800">
                            {task.category || 'Strategic'}
                          </span>
                          <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border border-emerald-500/20`}>
                            {task.priority || 'Normal'}
                          </span>
                          {task.dueDate && (
                            <span className="flex items-center gap-1 text-[10px] text-zinc-500 dark:text-zinc-500 font-bold uppercase bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded border border-zinc-200 dark:border-zinc-800">
                              <Calendar size={10} />
                              {format(parseISO(task.dueDate), 'MMM d')}
                            </span>
                          )}
                        </div>
                      </div>

                      <button 
                        onClick={() => deleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-zinc-400 hover:text-red-500 dark:text-zinc-600 dark:hover:text-red-400 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-3xl -mr-12 -mt-12 pointer-events-none"></div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-zinc-50 dark:bg-zinc-900/20 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800 col-span-full"
            >
              <Zap className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
              <h3 className="text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-widest">Sector Clear</h3>
              <p className="text-zinc-500 dark:text-zinc-600 text-xs font-mono mt-1">No pending directives found</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
