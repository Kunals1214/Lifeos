'use client';

import { useState } from 'react';
import { Sparkles, RefreshCw, CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DailyTask {
  id: string;
  category: string;
  task: string;
  completed: boolean;
}

interface DailyProtocolProps {
  userStats: {
    height: string;
    weight: string;
    chest: string;
    stomach: string;
  };
}

export default function DailyProtocol({ userStats }: DailyProtocolProps) {
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const generateProtocol = async () => {
    setLoading(true);
    
    const prompt = `
      Current Date: ${new Date().toLocaleDateString()}
      User Stats:
      - Height: ${userStats.height}
      - Weight: ${userStats.weight}
      - Body Measurements: Chest ${userStats.chest}, Stomach ${userStats.stomach}
      
      I want to get to the next level.
      Generate 6 specific, actionable, SINGLE-SENTENCE daily tasks for today, strictly one for each of these categories:
      1. Health & Fitness (Focus on physique goals: ${userStats.weight}, ${userStats.stomach} stomach)
      2. Wealth & Finance
      3. Wisdom & Learning
      4. Mindset & Spirit
      5. Social & Network
      6. Career & Skills

      Format the response strictly as a JSON array of objects with keys: "category" and "task". 
      Example: [{"category": "Health", "task": "Do 100 pushups focusing on chest contraction."}]
      Do not include markdown code blocks, just raw JSON.
    `;

    try {
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: prompt,
          history: [],
          profile: { name: 'Titan', targetRole: 'High Performance' }
        })
      });
      
      const data = await res.json();
      let cleanJson = data.response;
      // Cleanup if AI wrapped in code block
      if (cleanJson.includes('```json')) {
        cleanJson = cleanJson.replace(/```json/g, '').replace(/```/g, '');
      } else if (cleanJson.includes('```')) {
         cleanJson = cleanJson.replace(/```/g, '');
      }

      try {
        const parsedTasks = JSON.parse(cleanJson);
        setTasks(parsedTasks.map((t: any, i: number) => ({
          id: `task-${i}`,
          category: t.category,
          task: t.task,
          completed: false
        })));
        setGenerated(true);
      } catch (e) {
        console.error("Failed to parse AI response", e);
        // Fallback or error handling
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Sparkles className="text-fuchsia-500" size={20} />
            Daily Protocol
          </h2>
          <p className="text-xs text-zinc-500 font-mono">AI-Generated Orders for Next Level Growth</p>
        </div>
        {!generated && (
           <button 
            onClick={generateProtocol}
            disabled={loading}
            className="p-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <RefreshCw size={20} />}
          </button>
        )}
      </div>

      {!generated ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
           <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-fuchsia-500/10 rounded-full flex items-center justify-center mx-auto">
                 <Sparkles className="text-fuchsia-500" size={32} />
              </div>
              <div>
                 <h3 className="font-bold text-zinc-900 dark:text-white">Awaiting Orders</h3>
                 <p className="text-sm text-zinc-500 max-w-xs mx-auto mt-2">Generate your personalized daily checklist based on your biometrics and goals.</p>
              </div>
              <button 
                 onClick={generateProtocol}
                 disabled={loading}
                 className="px-6 py-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold rounded-full transition-all text-sm"
              >
                 {loading ? 'Analyzing Profile...' : 'Generate Protocol'}
              </button>
           </div>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {tasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl border transition-all cursor-pointer group ${
                  task.completed 
                    ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-500/20' 
                    : 'bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 hover:border-fuchsia-500/30'
                }`}
                onClick={() => toggleTask(task.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 ${task.completed ? 'text-emerald-500' : 'text-zinc-300 dark:text-zinc-600 group-hover:text-fuchsia-500'}`}>
                    {task.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">{task.category}</div>
                    <div className={`text-sm font-medium transition-all ${task.completed ? 'text-emerald-700 dark:text-emerald-400 line-through' : 'text-zinc-700 dark:text-zinc-200'}`}>
                      {task.task}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div className="pt-4 flex justify-end">
             <button 
               onClick={generateProtocol} 
               className="text-xs text-zinc-400 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1"
             >
                <RefreshCw size={12} /> Regenerate
             </button>
          </div>
        </div>
      )}
    </div>
  );
}
