'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO, isToday, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import {
  Plus,
  Play,
  Pause,
  BookOpen,
  Target,
  Flame,
  X,
  Trophy,
  Brain,
  GraduationCap,
  Activity,
  Zap,
  Clock,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface StudySession {
  id: string;
  subject: string;
  topic: string;
  duration: number; // in seconds
  date: string;
  notes?: string;
  completed: boolean;
}

interface StudyGoal {
  id: string;
  subject: string;
  targetHours: number;
  currentHours: number;
  deadline: string;
  color: string;
}

const SUBJECTS = [
  { name: 'Algorithmics', color: '#6366f1', icon: '⚡' },
  { name: 'System Architecture', color: '#ec4899', icon: '🏗️' },
  { name: 'Neural Networks', color: '#10b981', icon: '🤖' },
  { name: 'Cryptography', color: '#f59e0b', icon: '🔐' },
  { name: 'Tactical Analysis', color: '#3b82f6', icon: '🧠' },
  { name: 'Core Doctrine', color: '#ef4444', icon: '📚' },
  { name: 'Linguistics', color: '#14b8a6', icon: '🗣️' },
];

const POMODORO_MODES = [
  { name: 'Focus Interval', duration: 25 * 60, color: 'emerald' },
  { name: 'Wait State', duration: 5 * 60, color: 'blue' },
  { name: 'Recharge', duration: 15 * 60, color: 'violet' },
];

export default function StudyManager() {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [activeSession, setActiveSession] = useState<{
    subject: string;
    topic: string;
    startTime: Date;
  } | null>(null);
  const [timer, setTimer] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState<'focus' | 'short' | 'long'>('focus');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0].name);
  const [studyTopic, setStudyTopic] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('lifeos-study-sessions');
    if (saved) setSessions(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('lifeos-study-sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      if (timerMode === 'focus' && activeSession) {
        const session: StudySession = {
          id: Date.now().toString(),
          subject: activeSession.subject,
          topic: activeSession.topic,
          duration: 25 * 60,
          date: new Date().toISOString(),
          completed: true,
        };
        setSessions([session, ...sessions]);
        setActiveSession(null);
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer, timerMode, activeSession, sessions]);

  const startStudySession = () => {
    setActiveSession({
      subject: selectedSubject,
      topic: studyTopic || 'General Research',
      startTime: new Date(),
    });
    setTimer(25 * 60);
    setTimerMode('focus');
    setIsTimerRunning(true);
    setShowAddModal(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const todaySessions = sessions.filter(s => isToday(parseISO(s.date)));
  const todayMinutes = todaySessions.reduce((acc, s) => acc + s.duration / 60, 0);

  const weekStart = startOfWeek(new Date());
  const weekEnd = endOfWeek(new Date());
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  const weeklyData = weekDays.map((day) => {
    const daySessions = sessions.filter(
      (s) => format(parseISO(s.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    );
    return {
      day: format(day, 'EEE'),
      minutes: Math.round(daySessions.reduce((acc, s) => acc + s.duration / 60, 0)),
    };
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white flex items-center gap-3">
             INTELLIGENCE <span className="text-violet-500">ARCHIVE</span>
          </h1>
          <p className="text-zinc-500 text-lg mt-1 font-mono uppercase tracking-tight">Knowledge acquisition and retention</p>
        </div>
        
        {activeSession ? (
          <div className="flex items-center gap-4 bg-zinc-900/50 p-2 rounded-2xl border border-violet-500/20 px-6">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
               <span className="text-sm font-bold text-violet-500 uppercase tracking-widest hidden md:inline">Focus State</span>
            </div>
            <div className="text-2xl font-black font-mono text-white w-24 text-center">
              {formatTime(timer)}
            </div>
            <button 
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="p-3 rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            >
              {isTimerRunning ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button 
               onClick={() => {
                  setActiveSession(null);
                  setIsTimerRunning(false);
               }}
               className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
            >
               <Activity size={20} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-violet-500/20 uppercase tracking-wider text-sm"
          >
            <Plus size={18} />
            INITIATE UPLINK
          </button>
        )}
      </div>

      {!activeSession && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'DATA PROCESSED', value: `${Math.round(todayMinutes)}m`, icon: Brain, color: 'text-violet-500' },
            { label: 'SESSIONS LOGGED', value: sessions.length, icon: Trophy, color: 'text-yellow-500' },
            { label: 'ARCHIVE SIZE', value: SUBJECTS.length, icon: BookOpen, color: 'text-blue-500' },
            { label: 'UPTIME STREAK', value: '14', icon: Flame, color: 'text-orange-500' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-3xl bg-zinc-950 border border-zinc-900 group hover:border-violet-500/30 transition-all"
            >
              <div className={`p-3 rounded-2xl bg-zinc-900 w-fit mb-4 group-hover:scale-110 transition-transform ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-black text-white mt-1">{stat.value}</h3>
            </motion.div>
          ))}
        </div>
      )}

      {!activeSession && (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-8 rounded-3xl bg-zinc-950 border border-zinc-900">
               <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-6">Learning Velocity</h3>
               <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={weeklyData}>
                        <XAxis dataKey="day" hide />
                        <Tooltip 
                           contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a' }}
                           itemStyle={{ color: '#8b5cf6', fontFamily: 'monospace' }}
                           cursor={{fill: '#27272a'}}
                        />
                        <Bar dataKey="minutes" fill="#8b5cf6" radius={[4, 4, 4, 4]} />
                     </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>

            <div className="space-y-4">
               {sessions.slice(0, 4).map(session => (
                  <div key={session.id} className="p-4 rounded-2xl bg-zinc-950 border border-zinc-900 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-violet-500/10 text-violet-500">
                           <Zap size={20} />
                        </div>
                        <div>
                           <h4 className="font-bold text-white uppercase tracking-tight text-sm">{session.subject}</h4>
                           <p className="text-xs text-zinc-500 font-mono mt-1">{session.topic}</p>
                        </div>
                     </div>
                     <span className="text-zinc-500 font-mono text-sm">{Math.floor(session.duration/60)}m</span>
                  </div>
               ))}
            </div>
         </div>
      )}

      {activeSession && (
         <div className="flex flex-col items-center justify-center py-20 bg-zinc-950/50 rounded-[3rem] border border-violet-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-violet-500/5 blur-3xl animate-pulse" />
            <div className="relative z-10 text-center">
               <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold uppercase tracking-widest mb-8">
                  <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                  Neural Uplink Active
               </div>
               <h2 className="text-6xl font-black text-white tracking-tighter mb-4 font-mono">{formatTime(timer)}</h2>
               <p className="text-zinc-400 uppercase tracking-widest text-sm font-bold">{activeSession.subject} - {activeSession.topic}</p>
               
               <div className="flex gap-4 mt-12">
                  <button 
                     onClick={() => setIsTimerRunning(!isTimerRunning)}
                     className="px-8 py-4 bg-white text-black font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all"
                  >
                     {isTimerRunning ? 'PAUSE STREAM' : 'RESUME STREAM'}
                  </button>
                  <button 
                     onClick={() => {
                        const session: StudySession = {
                           id: Date.now().toString(),
                           subject: activeSession.subject,
                           topic: activeSession.topic,
                           duration: (25 * 60) - timer,
                           date: new Date().toISOString(),
                           completed: true,
                         };
                         setSessions([session, ...sessions]);
                         setActiveSession(null);
                         setIsTimerRunning(false);
                     }}
                     className="px-8 py-4 bg-zinc-900 text-zinc-400 border border-zinc-800 font-bold rounded-2xl hover:text-white hover:border-zinc-700 transition-all"
                  >
                     ABORT
                  </button>
               </div>
            </div>
         </div>
      )}

      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-zinc-950 border border-zinc-900 rounded-3xl w-full max-w-lg p-8"
            >
               <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-6">Initiate Uplink</h2>
               
               <div className="space-y-4">
                  <div>
                     <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">Target Sector</label>
                     <div className="grid grid-cols-2 gap-2">
                        {SUBJECTS.map(sub => (
                           <button
                              key={sub.name}
                              onClick={() => setSelectedSubject(sub.name)}
                              className={`p-3 rounded-xl text-xs font-bold uppercase tracking-wide text-left transition-all border ${selectedSubject === sub.name ? 'bg-violet-500/20 border-violet-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
                           >
                              {sub.name}
                           </button>
                        ))}
                     </div>
                  </div>

                  <div>
                     <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">Packet ID</label>
                     <input 
                        type="text" 
                        value={studyTopic}
                        onChange={(e) => setStudyTopic(e.target.value)}
                        placeholder="e.g. Tree Traversal Algorithms"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition-colors"
                     />
                  </div>

                  <button 
                     onClick={startStudySession}
                     disabled={!studyTopic}
                     className="w-full py-4 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest rounded-xl transition-all mt-4"
                  >
                     Establish Connection
                  </button>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
