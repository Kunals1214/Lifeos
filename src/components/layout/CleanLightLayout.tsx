'use client';

import { motion } from 'framer-motion';
import BottomNav from '../BottomNav';
import { Menu, Search, Bell, User } from 'lucide-react';
import Sidebar from '../Sidebar';
import { useState } from 'react';

export default function CleanLightLayout({ children, onLogout }: { children: React.ReactNode, onLogout: () => void }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100">
      
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 z-40 flex items-center justify-between px-4">
        <div className="font-bold text-xl tracking-tight text-emerald-600">LifeOS</div>
        <button className="p-2 rounded-full hover:bg-slate-100">
          <User size={20} className="text-slate-600" />
        </button>
      </div>

      {/* Desktop Sidebar - Minimal Float */}
      <div className="hidden lg:block fixed left-0 top-0 bottom-0 z-50">
          <Sidebar collapsed={false} setCollapsed={() => {}} onLogout={onLogout} />
      </div>

      {/* Main Content */}
      <main className="pt-20 pb-24 lg:pt-8 lg:pb-8 lg:pl-[280px] min-h-screen transition-all duration-300">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Desktop Header */}
            <header className="hidden lg:flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                    <p className="text-slate-500 text-sm">Welcome back, get ready for success.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            className="pl-10 pr-4 py-2 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm w-64"
                        />
                    </div>
                    <button className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors relative">
                        <Bell size={20} className="text-slate-600" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                    </button>
                </div>
            </header>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                {children}
            </motion.div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
