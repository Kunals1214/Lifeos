'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, Star, Zap, Target, Award, Medal, Crown, Shield, Activity, Lock } from 'lucide-react';

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalXP: number;
  level: number;
  tasksCompleted: number;
  habitsCompleted: number;
  studyMinutes: number;
  workoutsCompleted: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  unlocked: boolean;
  progress: number;
  target: number;
}

const LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000, 2000, 3500, 5500, 8000, 11000, 15000];
const LEVEL_TITLES = [
  'NOVICE', 'INITIATE', 'OPERATOR', 'VANGUARD', 'COMMANDER',
  'WARLORD', 'IMPERATORY', 'LEGEND', 'TITAN', 'GODSLAYER', 'ETERNAL'
];

export default function StreakDisplay() {
  const [data, setData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    totalXP: 0,
    level: 1,
    tasksCompleted: 0,
    habitsCompleted: 0,
    studyMinutes: 0,
    workoutsCompleted: 0,
  });

  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    calculateStats();
  }, []);

  const calculateStats = () => {
    // Load all data from localStorage
    const tasks = JSON.parse(localStorage.getItem('lifeos-tasks') || '[]');
    const habits = JSON.parse(localStorage.getItem('habits') || '[]');
    const study = JSON.parse(localStorage.getItem('lifeos-study-sessions') || '[]');
    const workouts = JSON.parse(localStorage.getItem('lifeos-workouts') || '[]');

    const completedTasks = tasks.filter((t: any) => t.status === 'completed').length;
    const habitCompletions = habits.reduce((acc: number, h: any) => acc + (h.completedDates?.length || 0), 0);
    const totalStudyMinutes = study.reduce((acc: number, s: any) => acc + Math.round(s.duration / 60), 0);
    const totalWorkouts = workouts.length;

    // Calculate XP
    const xp = (completedTasks * 10) + (habitCompletions * 5) + (totalStudyMinutes * 2) + (totalWorkouts * 20);
    
    // Calculate level
    let level = 1;
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (xp >= LEVEL_THRESHOLDS[i]) {
        level = i + 1;
        break;
      }
    }

    // Calculate streak
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - i);
        const dateStr = checkDate.toISOString().split('T')[0];
        
        const hadActivity = habits.some((h: any) => h.completedDates?.includes(dateStr)) ||
            tasks.some((t: any) => t.completedAt?.startsWith(dateStr)) ||
            study.some((s: any) => s.date?.startsWith(dateStr));
            
        if (hadActivity) {
            streak++;
        } else if (i > 0) {
            break;
        }
    }

    setData({
      currentStreak: streak,
      longestStreak: Math.max(streak, parseInt(localStorage.getItem('lifeos-longest-streak') || '0')),
      totalXP: xp,
      level,
      tasksCompleted: completedTasks,
      habitsCompleted: habitCompletions,
      studyMinutes: totalStudyMinutes,
      workoutsCompleted: totalWorkouts,
    });

    // Save longest streak
    if (streak > parseInt(localStorage.getItem('lifeos-longest-streak') || '0')) {
      localStorage.setItem('lifeos-longest-streak', streak.toString());
    }

    // Generate achievements
    setAchievements([
      {
        id: 'first-task',
        name: 'First Step',
        description: 'Complete your first task',
        icon: CheckIcon,
        color: 'emerald',
        unlocked: completedTasks >= 1,
        progress: Math.min(completedTasks, 1),
        target: 1,
      },
      {
        id: 'task-master',
        name: 'Task Master',
        description: 'Complete 50 tasks',
        icon: Trophy,
        color: 'amber',
        unlocked: completedTasks >= 50,
        progress: Math.min(completedTasks, 50),
        target: 50,
      },
      {
        id: 'habit-builder',
        name: 'Habit Builder',
        description: 'Complete 100 habit check-ins',
        icon: Target,
        color: 'blue',
        unlocked: habitCompletions >= 100,
        progress: Math.min(habitCompletions, 100),
        target: 100,
      },
      {
        id: 'week-warrior',
        name: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        icon: Flame,
        color: 'orange',
        unlocked: streak >= 7 || parseInt(localStorage.getItem('lifeos-longest-streak') || '0') >= 7,
        progress: Math.min(streak, 7),
        target: 7,
      },
      {
        id: 'month-master',
        name: 'Month Master',
        description: 'Maintain a 30-day streak',
        icon: Crown,
        color: 'violet',
        unlocked: streak >= 30 || parseInt(localStorage.getItem('lifeos-longest-streak') || '0') >= 30,
        progress: Math.min(streak, 30),
        target: 30,
      },
      {
        id: 'scholar',
        name: 'Scholar',
        description: 'Study for 10 hours total',
        icon: Star,
        color: 'cyan',
        unlocked: totalStudyMinutes >= 600,
        progress: Math.min(totalStudyMinutes, 600),
        target: 600,
      },
    ]);
  };

  const nextLevelXP = LEVEL_THRESHOLDS[Math.min(data.level, LEVEL_THRESHOLDS.length - 1)];
  const currentLevelXP = LEVEL_THRESHOLDS[Math.max(0, data.level - 1)];
  const progressToNextLevel = ((data.totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

  return (
    <div className="space-y-6">
      {/* Main Stats Header */}
      <div className="flex items-center gap-3 mb-6">
        <Shield className="text-emerald-500" size={24} />
        <h2 className="text-xl font-bold text-white uppercase tracking-widest">Operator Status</h2>
        <div className="h-[1px] flex-grow bg-zinc-800" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative group bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-orange-500/50 transition-colors"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-bl-full -mr-4 -mt-4 transition-all group-hover:bg-orange-500/20" />
          <div className="flex items-center gap-2 mb-3 relative z-10">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Streak Protocol</span>
          </div>
          <p className="text-3xl font-bold text-white font-mono">{data.currentStreak}</p>
          <p className="text-[10px] text-zinc-600 mt-1 uppercase tracking-widest">Days Active</p>
        </motion.div>

        {/* Level */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative group bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-violet-500/50 transition-colors"
        >
          <div className="flex items-center gap-2 mb-3 relative z-10">
            <Award className="w-4 h-4 text-violet-500" />
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Clearance Level</span>
          </div>
          <p className="text-lg font-bold text-white uppercase tracking-wider">{LEVEL_TITLES[Math.min(data.level - 1, LEVEL_TITLES.length - 1)]}</p>
          <div className="mt-3 relative h-1.5 bg-zinc-800 rounded-full overflow-hidden">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${Math.min(progressToNextLevel, 100)}%` }}
               className="absolute top-0 left-0 h-full bg-violet-500"
             />
          </div>
          <p className="text-[9px] text-zinc-600 mt-2 font-mono text-right">{Math.round(progressToNextLevel)}% TO NEXT TIER</p>
        </motion.div>

        {/* Total XP */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative group bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-emerald-500/50 transition-colors"
        >
          <div className="flex items-center gap-2 mb-3 relative z-10">
            <Zap className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Experience</span>
          </div>
          <p className="text-3xl font-bold text-white font-mono">{data.totalXP.toLocaleString()}</p>
          <p className="text-[10px] text-zinc-600 mt-1 uppercase tracking-widest">Total Points</p>
        </motion.div>

        {/* Best Streak */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative group bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-amber-500/50 transition-colors"
        >
          <div className="flex items-center gap-2 mb-3 relative z-10">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Record</span>
          </div>
          <p className="text-3xl font-bold text-white font-mono">{data.longestStreak}</p>
          <p className="text-[10px] text-zinc-600 mt-1 uppercase tracking-widest">Max Sustained</p>
        </motion.div>
      </div>

      {/* Achievements */}
      <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
          <Medal className="w-4 h-4 text-amber-500" />
          Medals & Commendations
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {achievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              whileHover={{ scale: 1.02 }}
              className={`relative p-4 rounded-xl border flex flex-col items-center text-center transition-all ${
                achievement.unlocked
                  ? `bg-zinc-900/50 border-${achievement.color}-500/30 shadow-[0_0_15px_rgba(0,0,0,0.3)]`
                  : 'bg-zinc-950/30 border-zinc-800/50 opacity-50 grayscale'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                achievement.unlocked
                  ? `bg-${achievement.color}-500/20`
                  : 'bg-zinc-800'
              }`}>
                <achievement.icon className={`w-5 h-5 ${
                  achievement.unlocked ? `text-${achievement.color}-400` : 'text-zinc-600'
                }`} />
              </div>
              <p className="font-bold text-xs text-zinc-200 uppercase tracking-wide mb-1">{achievement.name}</p>
              <p className="text-[9px] text-zinc-500 leading-tight mb-3">{achievement.description}</p>
              
              {!achievement.unlocked ? (
                <div className="w-full mt-auto">
                  <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-zinc-600 rounded-full"
                      style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                    />
                  </div>
                  <p className="text-[9px] text-zinc-600 mt-1 font-mono">
                    {achievement.progress}/{achievement.target}
                  </p>
                </div>
              ) : (
                <div className="mt-auto px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-[9px] text-emerald-400 font-bold uppercase tracking-widest">
                    Unlocked
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Activity Summary Grid */}
      <div className="grid grid-cols-4 gap-px bg-zinc-800 rounded-xl overflow-hidden border border-zinc-800">
        <div className="bg-zinc-900 p-4 flex flex-col items-center justify-center hover:bg-zinc-800/80 transition-colors">
          <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Tasks</p>
          <p className="text-xl font-bold text-white font-mono">{data.tasksCompleted}</p>
        </div>
        <div className="bg-zinc-900 p-4 flex flex-col items-center justify-center hover:bg-zinc-800/80 transition-colors">
          <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Check-ins</p>
          <p className="text-xl font-bold text-white font-mono">{data.habitsCompleted}</p>
        </div>
        <div className="bg-zinc-900 p-4 flex flex-col items-center justify-center hover:bg-zinc-800/80 transition-colors">
          <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Study</p>
          <p className="text-xl font-bold text-white font-mono">{Math.floor(data.studyMinutes / 60)}h</p>
        </div>
        <div className="bg-zinc-900 p-4 flex flex-col items-center justify-center hover:bg-zinc-800/80 transition-colors">
          <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Workouts</p>
          <p className="text-xl font-bold text-white font-mono">{data.workoutsCompleted}</p>
        </div>
      </div>
    </div>
  );
}

function CheckIcon(props: any) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}
