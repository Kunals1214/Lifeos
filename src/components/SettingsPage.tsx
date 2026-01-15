'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Palette,
  Shield,
  Database,
  Cloud,
  Download,
  Upload,
  Trash2,
  Moon,
  Sun,
  Globe,
  Volume2,
  VolumeX,
  Smartphone,
  Monitor,
  Check,
  ChevronRight,
  Key,
  Link2,
  RefreshCw,
} from 'lucide-react';

interface UserSettings {
  profile: {
    name: string;
    email: string;
    avatar: string;
  };
  appearance: {
    theme: 'dark' | 'light' | 'system';
    accentColor: string;
    compactMode: boolean;
  };
  notifications: {
    enabled: boolean;
    sound: boolean;
    habitReminders: boolean;
    taskDeadlines: boolean;
    dailyDigest: boolean;
  };
  data: {
    googleSheetsUrl: string;
    geminiApiKey: string;
    autoSync: boolean;
    syncInterval: number;
  };
  privacy: {
    shareProgress: boolean;
    analytics: boolean;
  };
}

const ACCENT_COLORS = [
  { name: 'Emerald', value: '#10b981' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Violet', value: '#8b5cf6' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Orange', value: '#f59e0b' },
  { name: 'Cyan', value: '#06b6d4' },
];

const defaultSettings: UserSettings = {
  profile: {
    name: '',
    email: '',
    avatar: '',
  },
  appearance: {
    theme: 'dark',
    accentColor: '#10b981',
    compactMode: false,
  },
  notifications: {
    enabled: true,
    sound: true,
    habitReminders: true,
    taskDeadlines: true,    dailyDigest: false,
  },
  data: {
    googleSheetsUrl: '',
    geminiApiKey: '',
    autoSync: true,
    syncInterval: 5,
  },
  privacy: {
    shareProgress: false,
    analytics: true,
  },
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [activeSection, setActiveSection] = useState('profile');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem('lifeos-settings');
    if (savedSettings) {
      setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
    }
  }, []);

  const saveSettings = () => {
    localStorage.setItem('lifeos-settings', JSON.stringify(settings));
    // Also save profile separately for other components to access
    localStorage.setItem('lifeos-profile', JSON.stringify(settings.profile));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const exportData = () => {
    const data = {
      settings,
      habits: localStorage.getItem('habits'),
      tasks: localStorage.getItem('lifeos-tasks'),
      projects: localStorage.getItem('lifeos-projects'),
      contacts: localStorage.getItem('lifeos-contacts'),
      workouts: localStorage.getItem('lifeos-workouts'),
      studySessions: localStorage.getItem('lifeos-study-sessions'),
      transactions: localStorage.getItem('transactions'),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lifeos-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.settings) setSettings(data.settings);
        if (data.habits) localStorage.setItem('habits', data.habits);
        if (data.tasks) localStorage.setItem('lifeos-tasks', data.tasks);
        if (data.projects) localStorage.setItem('lifeos-projects', data.projects);
        if (data.contacts) localStorage.setItem('lifeos-contacts', data.contacts);
        if (data.workouts) localStorage.setItem('lifeos-workouts', data.workouts);
        if (data.studySessions) localStorage.setItem('lifeos-study-sessions', data.studySessions);
        if (data.transactions) localStorage.setItem('transactions', data.transactions);
        alert('Data imported successfully! Please refresh the page.');
      } catch (err) {
        alert('Failed to import data. Invalid file format.');
      }
    };
    reader.readAsText(file);
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      localStorage.clear();
      setSettings(defaultSettings);
      alert('All data cleared. Please refresh the page.');
    }
  };

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'data', label: 'Data & Sync', icon: Database },
    { id: 'privacy', label: 'Privacy', icon: Shield },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-32">
      {/* Imperial Header */}
      <div>
        <h1 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase flex items-center gap-3">
          SYSTEM <span className="text-zinc-500">CONTROL</span>
        </h1>
        <p className="text-zinc-500 text-lg mt-1 font-medium italic">"Configure the parameters of your empire."</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Nav */}
        <div className="lg:w-64 space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-left transition-all border ${
                activeSection === section.id
                  ? 'bg-white border-zinc-200 text-zinc-900 shadow-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-white'
                  : 'bg-transparent border-transparent text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:text-white dark:hover:bg-zinc-900'
              }`}
            >
              <section.icon size={20} className={activeSection === section.id ? 'text-emerald-600 dark:text-emerald-500' : 'text-zinc-400 dark:text-zinc-600'} />
              <span className="text-sm font-bold uppercase tracking-wider">{section.label}</span>
              {activeSection === section.id && <ChevronRight size={16} className="ml-auto text-zinc-400 dark:text-zinc-600" />}
            </button>
          ))}
        </div>

        {/* Content Panel */}
        <div className="flex-1 bg-white border-zinc-200 dark:bg-zinc-900/50 dark:border-zinc-800/50 backdrop-blur-xl rounded-[2.5rem] p-8 border min-h-[500px] relative overflow-hidden shadow-sm dark:shadow-none">
          <div className="relative z-10">
          
          {/* Profile Section */}
          {activeSection === 'profile' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between pb-6 border-b border-zinc-200 dark:border-zinc-800">
                 <div>
                    <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">Identity Protocol</h2>
                    <p className="text-zinc-500 text-sm mt-1">Manage your imperial designation</p>
                 </div>
                 <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-emerald-500/20">
                    {settings.profile.avatar || <User size={32} />}
                 </div>
              </div>

              <div className="grid gap-6">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Designation (Name)</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <input
                      type="text"
                      value={settings.profile.name}
                      onChange={(e) => setSettings({
                        ...settings,
                        profile: { ...settings.profile, name: e.target.value }
                      })}
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-zinc-50 border-zinc-200 text-zinc-900 dark:bg-zinc-950/50 dark:border-zinc-800 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-700 border focus:outline-none focus:border-emerald-500/50 transition-colors"
                      placeholder="Enter designation..."
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Comms Channel (Email)</label>
                  <div className="relative group">
                    <SettingsIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <input
                      type="email"
                      value={settings.profile.email}
                      onChange={(e) => setSettings({
                        ...settings,
                        profile: { ...settings.profile, email: e.target.value }
                      })}
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-zinc-50 border-zinc-200 text-zinc-900 dark:bg-zinc-950/50 dark:border-zinc-800 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-700 border focus:outline-none focus:border-emerald-500/50 transition-colors"
                      placeholder="Enter secure comms..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Section */}
          {activeSection === 'appearance' && (
            <div className="space-y-8">
               <div className="pb-6 border-b border-zinc-200 dark:border-zinc-800">
                  <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">Visual Interface</h2>
                  <p className="text-zinc-500 text-sm mt-1">Customize your command terminal</p>
               </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Core Theme</label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: 'dark', label: 'Dark Ops', icon: Moon },
                    { value: 'light', label: 'Light', icon: Sun },
                    { value: 'system', label: 'System', icon: Monitor },
                  ].map((theme) => (
                    <button
                      key={theme.value}
                      onClick={() => {
                        setSettings({
                        ...settings,
                        appearance: { ...settings.appearance, theme: theme.value as any }
                      });
                      // Trigger immediate theme update
                      setTimeout(() => {
                         const event = new Event('lifeos-theme-change');
                         window.dispatchEvent(event);
                      }, 0);
                    }}
                      className={`flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border transition-all ${
                        settings.appearance.theme === theme.value
                          ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-600 dark:text-emerald-400'
                          : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:text-zinc-900 dark:bg-zinc-950/50 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:text-white'
                      }`}
                    >
                      <theme.icon size={24} />
                      <span className="text-xs font-bold uppercase tracking-wider">{theme.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Signal Color</label>
                <div className="flex flex-wrap gap-3">
                  {ACCENT_COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setSettings({
                        ...settings,
                        appearance: { ...settings.appearance, accentColor: color.value }
                      })}
                      className={`group relative w-12 h-12 rounded-2xl flex items-center justify-center transition-transform hover:scale-110 ${
                         settings.appearance.accentColor === color.value ? 'ring-2 ring-white ring-offset-2 ring-offset-[#111]' : ''
                      }`}
                      style={{ backgroundColor: color.value }}
                    >
                       {settings.appearance.accentColor === color.value && <Check size={20} className="text-white drop-shadow-md" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Notifications Section */}
          {activeSection === 'notifications' && (
             <div className="space-y-8">
               <div className="pb-6 border-b border-zinc-200 dark:border-zinc-800">
                  <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">Alert Protocols</h2>
                  <p className="text-zinc-500 text-sm mt-1">Manage system notifications</p>
               </div>

               <div className="space-y-4">
                 {[
                   { id: 'enabled', label: 'Master Override', desc: 'Enable/Disable all alerts' },
                   { id: 'sound', label: 'Audio Feedback', desc: 'System sounds on interaction' },
                   { id: 'habitReminders', label: 'Ritual Reminders', desc: 'Daily habit enforcement' },
                   { id: 'taskDeadlines', label: 'Mission Deadlines', desc: 'Critical objective alerts' },
                 ].map((item) => (
                   <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 border border-zinc-200 dark:bg-zinc-950/30 dark:border-zinc-800">
                      <div>
                         <p className="font-bold text-zinc-900 dark:text-white uppercase tracking-tight text-sm">{item.label}</p>
                         <p className="text-zinc-500 text-xs font-medium">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => setSettings({
                           ...settings,
                           notifications: { ...settings.notifications, [item.id]: !settings.notifications[item.id as keyof typeof settings.notifications] }
                        })}
                        className={`w-12 h-7 rounded-full transition-colors relative ${
                           // @ts-ignore
                           settings.notifications[item.id] ? 'bg-emerald-500' : 'bg-zinc-200 dark:bg-zinc-800'
                        }`}
                      >
                         <div className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform ${
                            // @ts-ignore
                            settings.notifications[item.id] ? 'translate-x-5' : 'translate-x-0'
                         }`} />
                      </button>
                   </div>
                 ))}
               </div>
             </div>
          )}

          {/* Data Section */}
          {activeSection === 'data' && (
             <div className="space-y-8">
               <div className="pb-6 border-b border-zinc-200 dark:border-zinc-800">
                  <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">Data Preservation</h2>
                  <p className="text-zinc-500 text-sm mt-1">Backup, Sync, and Export protocols</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button 
                  onClick={exportData}
                  className="p-6 rounded-3xl bg-zinc-50 border border-zinc-200 hover:border-emerald-500/50 dark:bg-zinc-950/50 dark:border-zinc-800 text-left group transition-all"
                  >
                     <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Download className="text-emerald-600 dark:text-emerald-500" />
                     </div>
                     <h3 className="font-bold text-zinc-900 dark:text-white uppercase tracking-tight">Extract Data</h3>
                     <p className="text-zinc-500 text-xs mt-1">Download local JSON archive</p>
                  </button>

                  <label className="p-6 rounded-3xl bg-zinc-50 border border-zinc-200 hover:border-blue-500/50 dark:bg-zinc-950/50 dark:border-zinc-800 text-left group transition-all cursor-pointer">
                     <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Upload className="text-blue-600 dark:text-blue-500" />
                     </div>
                     <h3 className="font-bold text-zinc-900 dark:text-white uppercase tracking-tight">Inject Data</h3>
                     <p className="text-zinc-500 text-xs mt-1">Restore from JSON archive</p>
                     <input type="file" onChange={importData} className="hidden" accept=".json" />
                  </label>
                  
                  <button 
                  onClick={clearAllData}
                  className="p-6 rounded-3xl bg-zinc-50 border border-zinc-200 hover:border-red-500/50 dark:bg-zinc-950/50 dark:border-zinc-800 text-left group transition-all md:col-span-2"
                  >
                     <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Trash2 className="text-red-600 dark:text-red-500" />
                     </div>
                     <h3 className="font-bold text-red-600 dark:text-red-400 uppercase tracking-tight">System Purge</h3>
                     <p className="text-zinc-500 text-xs mt-1">Irreversible data wipe</p>
                  </button>
               </div>
             </div>
          )}

          {/* Privacy Section */}
          {activeSection === 'privacy' && (
             <div className="space-y-8">
               <div className="pb-6 border-b border-zinc-200 dark:border-zinc-800">
                  <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">Security Clearance</h2>
                  <p className="text-zinc-500 text-sm mt-1">Manage data visibility and sharing</p>
               </div>

                <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200 dark:bg-zinc-950/30 dark:border-zinc-800 text-center">
                  <Shield size={48} className="mx-auto text-zinc-400 dark:text-zinc-700 mb-4" />
                  <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">All System Data is Local-First</p>
                  <p className="text-zinc-600 text-sm mt-2 max-w-md mx-auto">Your empire's data resides only on this terminal unless you explicitly enable cloud synchronization protocols.</p>
                </div>
             </div>
          )}

          </div>
          
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-zinc-100 dark:bg-zinc-800/20 blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none" />
        </div>
      </div>
      
      {/* Save Button */}
      <motion.div 
         className="fixed bottom-8 right-8"
         initial={{ scale: 0 }}
         animate={{ scale: 1 }}
      >
         <button 
            onClick={saveSettings}
            className="flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-black uppercase tracking-widest shadow-2xl shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95"
         >
            {saved ? <Check size={20} /> : <RefreshCw size={20} />}
            {saved ? 'System Updated' : 'Save Protocol'}
         </button>
      </motion.div>
    </div>
  );
}
