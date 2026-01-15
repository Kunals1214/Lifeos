'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  CheckSquare,
  Wallet,
  Calendar,
  MoreHorizontal,
  FolderKanban,
  Dumbbell,
  BookOpen,
  Sparkles,
  Settings,
  X
} from 'lucide-react';
import { useState } from 'react';

// Main tabs for bottom nav
const mainTabs = [
  { name: 'Home', href: '/', icon: LayoutDashboard, color: 'text-zinc-400' },
  { name: 'Habits', href: '/habits', icon: CheckSquare, color: 'text-emerald-400' },
  { name: 'Tasks', href: '/tasks', icon: Calendar, color: 'text-amber-400' },
  { name: 'Finance', href: '/finance', icon: Wallet, color: 'text-blue-400' },
];

const moreTabs = [
    { name: 'Workout', href: '/workout', icon: Dumbbell, color: 'text-rose-400' },
    { name: 'Study', href: '/study', icon: BookOpen, color: 'text-cyan-400' },
    { name: 'Projects', href: '/projects', icon: FolderKanban, color: 'text-violet-400' },
    { name: 'Coach', href: '/coach', icon: Sparkles, color: 'text-fuchsia-400' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);

  return (
    <>
      <div className="lg:hidden fixed bottom-6 left-4 right-4 h-20 bg-[#111118]/90 backdrop-blur-2xl border border-white/10 rounded-3xl z-50 px-6 shadow-2xl shadow-emerald-500/10">
        <div className="flex justify-between items-center h-full">
          {mainTabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className="relative flex flex-col items-center justify-center min-w-[56px]"
              >
                {isActive && (
                  <motion.div
                    layoutId="bottomNavTab"
                    className="absolute -top-3 w-8 h-1 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                  />
                )}
                <tab.icon
                  size={24}
                  className={`transition-all duration-300 ${
                    isActive ? tab.color : 'text-zinc-600'
                  }`}
                />
                <span className={`text-[10px] font-bold mt-1 tracking-tight uppercase ${isActive ? tab.color : 'text-zinc-600'}`}>
                    {tab.name}
                </span>
              </Link>
            );
          })}
          
          {/* More Button */}
           <button
            onClick={() => setShowMore(true)}
            className="flex flex-col items-center justify-center min-w-[56px]"
          >
             <MoreHorizontal
              size={24}
              className={`text-zinc-600 transition-colors ${showMore ? 'text-white' : ''}`}
            />
            <span className="text-[10px] font-bold mt-1 text-zinc-600 uppercase">More</span>
          </button>
        </div>
      </div>

      {/* More Menu Drawer */}
       <AnimatePresence>
        {showMore && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 z-[60] bg-black/60 backdrop-blur-md" 
                onClick={() => setShowMore(false)}
              />
              <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                className="lg:hidden fixed bottom-0 left-0 right-0 z-[70] bg-[#0a0a0f] rounded-t-[3rem] border-t border-white/10 p-8 pb-12"
              >
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-black text-white uppercase tracking-widest">Expansion</h3>
                    <button onClick={() => setShowMore(false)} className="p-3 rounded-full bg-white/5 text-white">
                        <X size={24} />
                    </button>
                </div>
                <div className="grid grid-cols-4 gap-6">
                    {moreTabs.map((tab) => (
                        <Link key={tab.name} href={tab.href} onClick={() => setShowMore(false)} className="flex flex-col items-center gap-3">
                            <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center transition-all hover:scale-110 active:scale-95`}>
                                <tab.icon size={24} className={tab.color} />
                            </div>
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">{tab.name}</span>
                        </Link>
                    ))}
                    <Link href="/settings" onClick={() => setShowMore(false)} className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center">
                            <Settings size={24} className="text-zinc-400" />
                        </div>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Settings</span>
                    </Link>
                </div>
              </motion.div>
            </>
        )}
       </AnimatePresence>
    </>
  );
}
