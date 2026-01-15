'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { 
  Dumbbell, Heart, Activity, Trophy, Play, Pause, 
  Plus, ChevronRight, MoreVertical, Check, X, 
  Scale, GlassWater, Moon, Brain, Ruler
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';

// --- Types ---

interface ExerciseSet {
  reps: number;
  weight: number;
  completed: boolean;
}

interface Exercise {
  id?: string;
  name: string;
  sets: ExerciseSet[];
  restTime: number; // seconds
}

interface WorkoutTemplate {
  id: string;
  name: string;
  type: 'strength' | 'cardio' | 'flexibility' | 'sports';
  exercises: Exercise[];
}

interface Workout {
  id: string;
  name: string;
  date: string;
  duration: number; // seconds
  exercises: Exercise[];
  completed: boolean;
  type: 'strength' | 'cardio' | 'flexibility' | 'sports';
  caloriesBurned: number;
}

interface HealthMetric {
  date: string;
  weight: number; // kg
  sleep: number; // hours
  water: number; // glasses (250ml)
  calories: number;
  mood: number; // 1-10
}

// --- Constants ---

const WORKOUT_TYPES = [
  { value: 'strength', label: 'Heavy Infantry', icon: Dumbbell, color: 'emerald' },
  { value: 'cardio', label: 'Mobilization', icon: Heart, color: 'red' },
  { value: 'flexibility', label: 'Tactical Agility', icon: Activity, color: 'cyan' },
  { value: 'sports', label: 'Combat Sims', icon: Trophy, color: 'amber' },
];

const TEMPLATES: WorkoutTemplate[] = [
  {
    id: 't1',
    name: 'Push Doctrine',
    type: 'strength',
    exercises: [
      { name: 'Bench Press', sets: [{ reps: 10, weight: 60, completed: false }, { reps: 10, weight: 60, completed: false }, { reps: 8, weight: 65, completed: false }], restTime: 90 },
      { name: 'Shoulder Press', sets: [{ reps: 12, weight: 30, completed: false }, { reps: 12, weight: 30, completed: false }, { reps: 10, weight: 35, completed: false }], restTime: 60 },
      { name: 'Tricep Dips', sets: [{ reps: 15, weight: 0, completed: false }, { reps: 15, weight: 0, completed: false }, { reps: 12, weight: 0, completed: false }], restTime: 45 },
    ],
  },
  {
    id: 't2',
    name: 'Pull Doctrine',
    type: 'strength',
    exercises: [
      { name: 'Pull Ups', sets: [{ reps: 8, weight: 0, completed: false }, { reps: 8, weight: 0, completed: false }, { reps: 6, weight: 0, completed: false }], restTime: 90 },
      { name: 'Barbell Rows', sets: [{ reps: 10, weight: 50, completed: false }, { reps: 10, weight: 50, completed: false }, { reps: 8, weight: 55, completed: false }], restTime: 60 },
    ],
  },
  {
    id: 't3',
    name: 'Legion Stance',
    type: 'strength',
    exercises: [
      { name: 'Squats', sets: [{ reps: 10, weight: 80, completed: false }, { reps: 10, weight: 80, completed: false }, { reps: 8, weight: 90, completed: false }], restTime: 120 },
      { name: 'Leg Press', sets: [{ reps: 12, weight: 100, completed: false }, { reps: 12, weight: 100, completed: false }, { reps: 10, weight: 110, completed: false }], restTime: 90 },
    ],
  },
];

const INITIAL_METRICS: HealthMetric[] = Array.from({ length: 7 }, (_, i) => ({
  date: new Date(Date.now() - (6 - i) * 86400000).toISOString().split('T')[0],
  weight: 75 + Math.random() * 2 - 1,
  sleep: 7 + Math.random() * 2,
  water: Math.floor(6 + Math.random() * 4),
  calories: Math.floor(2200 + Math.random() * 500),
  mood: Math.floor(7 + Math.random() * 3)
}));

export default function WorkoutManager() { 
  const [activeTab, setActiveTab] = useState<'training' | 'health'>('training');
  
  // Workout State
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Health State
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [todayMetric, setTodayMetric] = useState<HealthMetric>({
    date: new Date().toISOString().split('T')[0],
    weight: 75,
    sleep: 7,
    water: 0,
    calories: 0,
    mood: 8
  });

  // Load Data
  useEffect(() => {
    const savedWorkouts = localStorage.getItem('lifeos-workouts');
    if (savedWorkouts) setWorkouts(JSON.parse(savedWorkouts));

    const savedMetrics = localStorage.getItem('lifeos-metrics');
    if (savedMetrics) {
      setMetrics(JSON.parse(savedMetrics));
    } else {
      setMetrics(INITIAL_METRICS);
    }
  }, []);

  // Save Data
  useEffect(() => {
    localStorage.setItem('lifeos-workouts', JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    localStorage.setItem('lifeos-metrics', JSON.stringify(metrics));
  }, [metrics]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => setWorkoutTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // --- Workout Functions ---
  
  const startWorkout = (template: WorkoutTemplate) => {
    setActiveWorkout({
      id: Date.now().toString(),
      name: template.name,
      exercises: JSON.parse(JSON.stringify(template.exercises)), // Deep copy
      date: new Date().toISOString(),
      duration: 0,
      completed: false,
      type: template.type,
      caloriesBurned: 0
    });
    setWorkoutTimer(0);
    setIsTimerRunning(true);
    setShowAddModal(false);
  };

  const toggleSet = (exerciseName: string, setIndex: number) => {
    if (!activeWorkout) return;
    
    // In a real app we'd use consistent IDs, here we might rely on index or name if IDs missing
    // For simplicity assuming indexes map correctly or template IDs are stable
    // Let's iterate:
    const newExercises = activeWorkout.exercises.map(ex => {
       // Ideally exercises in activeWorkout have unique IDs. 
       // The template exercises might not have IDs. Let's fix this in startWorkout if needed, 
       // but for now we'll match by name if ID missing (simple mockup logic)
       if (ex.name === exerciseName || ex.id === exerciseName) { 
          const newSets = [...ex.sets];
          newSets[setIndex].completed = !newSets[setIndex].completed;
          return { ...ex, sets: newSets };
       }
       return ex;
    });

    setActiveWorkout({ ...activeWorkout, exercises: newExercises });
  };
  
  // Fix for toggleSet using name as ID in the template map below
  // We will pass exercise name as ID for this simple version
  
  const finishWorkout = () => {
    if (!activeWorkout) return;
    setWorkouts([
      { ...activeWorkout, duration: workoutTimer, completed: true, caloriesBurned: Math.floor(workoutTimer * 5) }, // 5 kcal/min approx
      ...workouts
    ]);
    setActiveWorkout(null);
    setIsTimerRunning(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // --- Health Functions ---
  
  const updateMetric = (key: keyof HealthMetric, value: number) => {
    const today = new Date().toISOString().split('T')[0];
    const newMetro = { ...todayMetric, [key]: value };
    setTodayMetric(newMetro);

    // Update history
    const existingIndex = metrics.findIndex(m => m.date === today);
    let newMetrics;
    if (existingIndex >= 0) {
      newMetrics = [...metrics];
      newMetrics[existingIndex] = newMetro;
    } else {
      newMetrics = [...metrics, newMetro];
    }
    setMetrics(newMetrics.sort((a, b) => a.date.localeCompare(b.date)).slice(-30)); // Keep last 30 days
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-white flex items-center gap-3">
             <Heart className="text-red-500 fill-red-500" />
             HEALTH <span className="text-emerald-600 dark:text-emerald-500">SPACE</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg mt-1 font-mono uppercase tracking-tight">Biological Maintenance & Performance</p>
        </div>
        
        {/* Tab Switcher */}
        {!activeWorkout && (
           <div className="flex bg-zinc-100 dark:bg-zinc-900/50 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <button 
                 onClick={() => setActiveTab('training')}
                 className={`px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'training' ? 'bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-500 shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}`}
              >
                 <Dumbbell size={16} /> Training
              </button>
              <button 
                 onClick={() => setActiveTab('health')}
                 className={`px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'health' ? 'bg-white dark:bg-zinc-800 text-red-500 shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}`}
              >
                 <Activity size={16} /> Vitals
              </button>
           </div>
        )}

        {/* Active Session Control */}
        {activeWorkout && (
          <div className="flex items-center gap-4 bg-white dark:bg-zinc-900/50 p-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm px-6">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
               <span className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-widest hidden md:inline">Session Active</span>
            </div>
            <div className="text-2xl font-black font-mono text-zinc-900 dark:text-white w-24 text-center">
              {formatTime(workoutTimer)}
            </div>
            <button 
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
            >
              {isTimerRunning ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button 
               onClick={() => { setActiveWorkout(null); setIsTimerRunning(false); }}
               className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
            >
               <X size={20} />
            </button>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
         {/* TRAINING TAB */}
         {activeTab === 'training' && (
            <motion.div 
               key="training"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="space-y-6"
            >
               {!activeWorkout && (
                  <>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Summary Card */}
                        <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-8 text-white relative overflow-hidden group">
                           <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-emerald-500/20" />
                           <div className="relative z-10">
                              <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Ready to Engage?</h2>
                              <p className="text-zinc-400 mb-8 max-w-md">Maintain physical supremacy. Execute daily protocols to keep the biological engine at peak efficiency.</p>
                              <button
                                 onClick={() => setShowAddModal(true)}
                                 className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-600/20 uppercase tracking-widest text-sm"
                               >
                                 <Plus size={18} />
                                 INITIATE PROTOCOL
                               </button>
                           </div>
                        </div>

                        {/* Stats Card */}
                        <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 flex flex-col justify-between">
                           <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Total Volume</h3>
                           <div>
                              <div className="text-4xl font-black text-zinc-900 dark:text-white mb-2">{workouts.length}</div>
                              <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400">SESSIONS COMPLETED</div>
                           </div>
                           <div className="h-24 w-full mt-4">
                              <ResponsiveContainer width="100%" height="100%">
                                 <BarChart data={workouts.slice(-7)}>
                                    <Bar dataKey="duration" fill="#10b981" radius={[4, 4, 4, 4]} />
                                 </BarChart>
                              </ResponsiveContainer>
                           </div>
                        </div>
                     </div>

                     {/* Recent History */}
                     <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-6">Operations Log</h3>
                        <div className="space-y-4">
                           {workouts.length > 0 ? workouts.slice(0, 5).map(workout => (
                              <div key={workout.id} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/50 rounded-2xl hover:border-emerald-500/30 transition-all">
                                 <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl ${workout.type === 'strength' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500' : 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-500'}`}>
                                       {workout.type === 'strength' ? <Dumbbell size={20} /> : <Activity size={20} />}
                                    </div>
                                    <div>
                                       <h4 className="font-bold text-zinc-900 dark:text-white uppercase tracking-wider text-sm">{workout.name}</h4>
                                       <p className="text-xs text-zinc-500 font-mono mt-1">{format(parseISO(workout.date), 'dd MMM yyyy')} • {Math.floor(workout.duration / 60)}m</p>
                                    </div>
                                 </div>
                                 <div className="text-right">
                                    <div className="text-lg font-black font-mono text-zinc-900 dark:text-white">{workout.caloriesBurned} <span className="text-xs text-zinc-500">KCAL</span></div>
                                 </div>
                              </div>
                           )) : (
                              <div className="text-center py-8 text-zinc-500">No records found. Begin your journey.</div>
                           )}
                        </div>
                     </div>
                  </>
               )}

               {/* Active Session View */}
               {activeWorkout && (
                  <div className="grid grid-cols-1 gap-4">
                     {activeWorkout.exercises.map((exercise, idx) => (
                        <motion.div 
                           initial={{ opacity: 0, y: 20 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ delay: idx * 0.1 }}
                           key={idx} // Using idx as fallback key
                           className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 relative shadow-sm"
                        >
                           <div className="flex items-center justify-between mb-6">
                              <h3 className="text-xl font-black uppercase tracking-tight text-zinc-900 dark:text-white">{exercise.name}</h3>
                           </div>

                           <div className="space-y-3">
                              <div className="grid grid-cols-4 gap-4 mb-2 text-xs font-bold uppercase tracking-widest text-zinc-500 px-4">
                                 <div>Set</div>
                                 <div>Kg</div>
                                 <div>Reps</div>
                                 <div className="text-center">Status</div>
                              </div>
                              {exercise.sets.map((set, setIdx) => (
                                 <div key={setIdx} className={`grid grid-cols-4 gap-4 items-center p-4 rounded-xl transition-all ${set.completed ? 'bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20' : 'bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/50'}`}>
                                    <div className="font-mono font-bold text-zinc-400">
                                       {String(setIdx + 1).padStart(2, '0')}
                                    </div>
                                    <div className="font-mono font-bold text-zinc-900 dark:text-white">{set.weight}</div>
                                    <div className="font-mono font-bold text-zinc-900 dark:text-white">{set.reps}</div>
                                    <div className="flex justify-center">
                                       <button
                                          onClick={() => toggleSet(exercise.name, setIdx)} // Using name as ID
                                          className={`w-8 h-8 rounded flex items-center justify-center transition-all ${set.completed ? 'bg-emerald-500 text-white' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 hover:bg-zinc-300 dark:hover:bg-zinc-700'}`}
                                       >
                                          {set.completed && <Check size={16} strokeWidth={4} />}
                                       </button>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </motion.div>
                     ))}
                     
                     <button 
                        onClick={finishWorkout}
                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest rounded-xl transition-all mt-4 shadow-lg shadow-emerald-600/20"
                     >
                        Complete Protocol
                     </button>
                  </div>
               )}
            </motion.div>
         )}

         {/* HEALTH TAB */}
         {activeTab === 'health' && (
            <motion.div
               key="health"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="space-y-6"
            >
               {/* Quick Inputs */}
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Weight Input */}
                  <div className="p-6 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl">
                     <div className="flex items-center gap-3 mb-4 text-pink-500">
                        <Scale size={20} />
                        <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Mass (kg)</span>
                     </div>
                     <div className="flex items-center justify-between">
                        <button onClick={() => updateMetric('weight', todayMetric.weight - 0.1)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full">-</button>
                        <span className="text-3xl font-black text-zinc-900 dark:text-white">{todayMetric.weight.toFixed(1)}</span>
                        <button onClick={() => updateMetric('weight', todayMetric.weight + 0.1)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full">+</button>
                     </div>
                  </div>

                  {/* Water Input */}
                  <div className="p-6 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl">
                     <div className="flex items-center gap-3 mb-4 text-cyan-500">
                        <GlassWater size={20} />
                        <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Hydration</span>
                     </div>
                     <div className="flex items-center justify-between">
                        <button onClick={() => updateMetric('water', Math.max(0, todayMetric.water - 1))} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full">-</button>
                        <span className="text-3xl font-black text-zinc-900 dark:text-white">{todayMetric.water}</span>
                        <button onClick={() => updateMetric('water', todayMetric.water + 1)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full">+</button>
                     </div>
                  </div>

                  {/* Sleep Input */}
                  <div className="p-6 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl">
                     <div className="flex items-center gap-3 mb-4 text-indigo-500">
                        <Moon size={20} />
                        <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Sleep (hrs)</span>
                     </div>
                     <div className="flex items-center justify-between">
                        <button onClick={() => updateMetric('sleep', todayMetric.sleep - 0.5)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full">-</button>
                        <span className="text-3xl font-black text-zinc-900 dark:text-white">{todayMetric.sleep}</span>
                        <button onClick={() => updateMetric('sleep', todayMetric.sleep + 0.5)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full">+</button>
                     </div>
                  </div>

                  {/* BMI / Mood */}
                  <div className="p-6 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl relative overflow-hidden">
                     <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4 text-orange-500">
                           <Brain size={20} />
                           <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">BMI (181cm)</span>
                        </div>
                        <div className="text-3xl font-black text-zinc-900 dark:text-white">
                           {(todayMetric.weight / ((1.81) * (1.81))).toFixed(1)}
                        </div>
                     </div>
                  </div>
               </div>

               {/* Body Measurements */}
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl">
                     <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 block mb-2">Chest</span>
                     <span className="text-2xl font-black text-zinc-900 dark:text-white">3&apos;3&quot;</span>
                  </div>
                  <div className="p-6 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl">
                     <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 block mb-2">Stomach</span>
                     <span className="text-2xl font-black text-zinc-900 dark:text-white">3&apos;2&quot;</span>
                  </div>
               </div>

               {/* Charts */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8">
                     <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-6">Weight Trend</h3>
                     <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                           <AreaChart data={metrics}>
                              <defs>
                                 <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                                 </linearGradient>
                              </defs>
                              <Tooltip 
                                 contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a' }}
                                 itemStyle={{ color: '#ec4899' }}
                                 labelStyle={{ display: 'none' }}
                              />
                              <Area type="monotone" dataKey="weight" stroke="#ec4899" fillOpacity={1} fill="url(#colorWeight)" strokeWidth={3} />
                           </AreaChart>
                        </ResponsiveContainer>
                     </div>
                  </div>

                  <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8">
                     <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-6">Sleep & Recovery</h3>
                     <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={metrics}>
                              <Tooltip 
                                 contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a' }}
                                 itemStyle={{ color: '#6366f1' }}
                                 cursor={{fill: '#27272a', opacity: 0.2}}
                              />
                              <Bar dataKey="sleep" fill="#6366f1" radius={[4, 4, 4, 4]} />
                           </BarChart>
                        </ResponsiveContainer>
                     </div>
                  </div>
               </div>
            </motion.div>
         )}
      </AnimatePresence>

      {/* Templates Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-3xl w-full max-w-4xl max-h-[80vh] overflow-y-auto p-8 shadow-2xl"
            >
               <div className="flex items-center justify-between mb-8">
                  <div>
                     <h2 className="text-3xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white">Select Protocol</h2>
                     <p className="text-zinc-500 dark:text-zinc-400 font-mono text-sm mt-1">Choose a training doctrine to execute</p>
                  </div>
                  <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg text-zinc-500">
                     <X size={24} />
                  </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {TEMPLATES.map(template => (
                     <button
                        key={template.id}
                        onClick={() => startWorkout(template)}
                        className="flex flex-col text-left p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/50 hover:bg-white dark:hover:bg-zinc-900/80 transition-all group"
                     >
                        <div className="flex items-center justify-between w-full mb-4">
                           <div className="p-3 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 group-hover:border-emerald-500/30 transition-colors">
                              <Dumbbell className="text-zinc-400 group-hover:text-emerald-500 transition-colors" size={24} />
                           </div>
                           <ChevronRight className="text-zinc-400 dark:text-zinc-600 group-hover:text-emerald-500 transition-colors" />
                        </div>
                        <h3 className="text-lg font-bold uppercase tracking-wide text-zinc-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{template.name}</h3>
                        <p className="text-zinc-500 text-xs mt-2 font-mono">{template.exercises.length} Exercises • {template.type}</p>
                     </button>
                  ))}
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
