'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import {
  Plus,
  FolderOpen,
  Calendar,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Target,
  Layout,
  List,
  Filter,
  Users,
  Paperclip,
  MessageSquare,
  X,
  ChevronRight,
  Flag,
  Globe,
  Briefcase
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'completed' | 'hold';
  priority: 'low' | 'medium' | 'high';
  deadline: string;
  progress: number;
  tasks: { id: string; title: string; completed: boolean }[];
  category: string;
}

const CATEGORIES = [
  { id: 'dev', name: 'Develop', color: 'bg-emerald-500' },
  { id: 'design', name: 'Design', color: 'bg-pink-500' },
  { id: 'marketing', name: 'Market', color: 'bg-amber-500' },
  { id: 'content', name: 'Content', color: 'bg-blue-500' },
];

export default function ProjectManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeWaitlist, setActiveWaitlist] = useState(false);

  // New Project Form State
  const [newProject, setNewProject] = useState<Partial<Project>>({
    name: '',
    description: '',
    status: 'planning',
    priority: 'medium',
    progress: 0,
    category: 'dev'
  });

  useEffect(() => {
    const saved = localStorage.getItem('lifeos-projects');
    if (saved) setProjects(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('lifeos-projects', JSON.stringify(projects));
  }, [projects]);

  const addProject = () => {
    if (!newProject.name) return;
    
    const project: Project = {
      id: Date.now().toString(),
      name: newProject.name,
      description: newProject.description || '',
      status: newProject.status || 'planning',
      priority: newProject.priority || 'medium',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      progress: 0,
      tasks: [],
      category: newProject.category || 'dev'
    };

    setProjects([project, ...projects]);
    setShowAddModal(false);
    setNewProject({ name: '', description: '', status: 'planning', priority: 'medium', category: 'dev' });
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'planning': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'completed': return 'text-zinc-500 bg-zinc-800 border-zinc-700'; // Imperial conquered style
      case 'hold': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      default: return 'text-zinc-500 bg-zinc-900';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white flex items-center gap-3">
             CAMPAIGN <span className="text-blue-500">STRATEGY</span>
          </h1>
          <p className="text-zinc-500 text-lg mt-1 font-mono uppercase tracking-tight">Empire expansion directives</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl p-1">
             <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-400'}`}
             >
                <Layout size={18} />
             </button>
             <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-400'}`}
             >
                <List size={18} />
             </button>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20 uppercase tracking-wider text-sm"
          >
            <Plus size={18} />
            LAUNCH CAMPAIGN
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         {[
            { label: 'ACTIVE CAMPAIGNS', value: projects.filter(p => p.status === 'active').length, icon: Globe, color: 'text-emerald-500' },
            { label: 'IN PLANNING', value: projects.filter(p => p.status === 'planning').length, icon: Target, color: 'text-blue-500' },
            { label: 'CONQUERED', value: projects.filter(p => p.status === 'completed').length, icon: Flag, color: 'text-zinc-500' },
            { label: 'TOTAL DOMINION', value: projects.length, icon: Briefcase, color: 'text-amber-500' },
         ].map((stat, i) => (
            <motion.div
               key={i}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className="p-6 rounded-3xl bg-zinc-950 border border-zinc-900 group hover:border-blue-500/30 transition-all"
            >
               <div className={`p-3 rounded-2xl bg-zinc-900 w-fit mb-4 group-hover:scale-110 transition-transform ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
               </div>
               <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
               <h3 className="text-2xl font-black text-white mt-1">{stat.value}</h3>
            </motion.div>
         ))}
      </div>

      {viewMode === 'grid' ? (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, idx) => (
               <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 group hover:border-blue-500/30 transition-all relative overflow-hidden"
               >
                  <div className="flex items-start justify-between mb-6 relative z-10">
                     <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(project.status)}`}>
                        {project.status === 'active' ? 'Operational' : project.status}
                     </span>
                     <button 
                        onClick={() => deleteProject(project.id)}
                        className="text-zinc-600 hover:text-red-500 transition-colors"
                     >
                        <X size={16} />
                     </button>
                  </div>

                  <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2 group-hover:text-blue-400 transition-colors truncate">
                     {project.name}
                  </h3>
                  <p className="text-zinc-500 text-sm h-10 line-clamp-2 mb-6 font-mono">
                     {project.description || "No tactical briefing provided for this campaign."}
                  </p>

                  <div className="space-y-4 relative z-10">
                     <div>
                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
                           <span>Progress</span>
                           <span>{project.progress}%</span>
                        </div>
                        <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                           <div 
                              className="h-full bg-blue-500 transition-all duration-500" 
                              style={{ width: `${project.progress}%` }}
                           />
                        </div>
                     </div>

                     <div className="flex items-center justify-between pt-4 border-t border-zinc-900">
                        <div className="flex -space-x-2">
                           {[1,2,3].map(i => (
                              <div key={i} className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-zinc-950 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                                 OP
                              </div>
                           ))}
                        </div>
                        <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono">
                           <Clock size={14} />
                           {new Date(project.deadline).toLocaleDateString()}
                        </div>
                     </div>
                  </div>
               </motion.div>
            ))}
            
            <button
               onClick={() => setShowAddModal(true)}
               className="min-h-[300px] rounded-3xl border-2 border-dashed border-zinc-800 hover:border-blue-500/50 hover:bg-zinc-900/50 transition-all flex flex-col items-center justify-center gap-4 group"
            >
               <div className="p-4 rounded-full bg-zinc-900 group-hover:bg-blue-500 group-hover:text-white text-zinc-500 transition-all">
                  <Plus size={32} />
               </div>
               <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm group-hover:text-white">New Campaign</p>
            </button>
         </div>
      ) : (
         <div className="space-y-4">
             {/* List view implementation if needed */}
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
               className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-2xl p-8"
            >
               <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-8">Launch New Campaign</h2>
               
               <div className="space-y-6">
                  <div>
                     <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">Campaign Codename</label>
                     <input 
                        value={newProject.name}
                        onChange={e => setNewProject({...newProject, name: e.target.value})}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500 transition-colors uppercase font-bold tracking-wide placeholder-zinc-700"
                        placeholder="OPERATION: "
                     />
                  </div>

                  <div>
                     <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">Tactical Briefing</label>
                     <textarea 
                        value={newProject.description}
                        onChange={e => setNewProject({...newProject, description: e.target.value})}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500 transition-colors font-mono text-sm h-32 placeholder-zinc-700"
                        placeholder="Objective parameters..."
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">Priority Level</label>
                        <select 
                           value={newProject.priority}
                           onChange={e => setNewProject({...newProject, priority: e.target.value as any})}
                           className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                        >
                           <option value="low">Standard</option>
                           <option value="medium">Elevated</option>
                           <option value="high">Critical</option>
                        </select>
                     </div>
                     <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">Sector</label>
                        <select 
                           value={newProject.category}
                           onChange={e => setNewProject({...newProject, category: e.target.value})}
                           className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                        >
                           {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                     </div>
                  </div>

                  <button 
                     onClick={addProject}
                     className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest rounded-xl transition-all mt-4"
                  >
                     Authorize Campaign
                  </button>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
