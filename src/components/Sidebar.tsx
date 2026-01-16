'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import {
  LayoutDashboard,
  Wallet,
  ListTodo,
  Dumbbell,
  BookOpen,
  FolderKanban,
  Settings,
  Sparkles,
  Users,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Trophy,
  Activity,
  Shield,
  Zap,
  Target
} from 'lucide-react';

interface SidebarProps {
  onLogout?: () => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Habits', href: '/habits', icon: Activity },
  { name: 'Tasks', href: '/tasks', icon: ListTodo },
  { name: 'Finance', href: '/finance', icon: Wallet },
  { name: 'Health', href: '/workout', icon: Dumbbell },
  { name: 'Study', href: '/study', icon: BookOpen },
  { name: 'Projects', href: '/projects', icon: FolderKanban },
  { name: 'Contacts', href: '/contacts', icon: Users },
  { name: 'Progress', href: '/progress', icon: Trophy },
  { name: 'AI Coach', href: '/coach', icon: Sparkles },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar({ onLogout, collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const { theme } = useTheme();
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    const savedProfile = localStorage.getItem('lifeos-profile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setUserName(profile.name || 'User');
    }
  }, []);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'OP';
  };

  const isLight = theme === 'light';

  return (
    <>
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 280 }}
        className={`
          hidden lg:flex
          fixed z-50 h-full
          transition-all duration-300 ease-in-out
          flex-col
          ${isLight 
            ? 'bg-slate-700 text-white shadow-xl' 
            : 'bg-[#16161f] border-r border-white/5 text-zinc-400'
          }
        `}
      >
        {/* Logo */}
        <div className={`flex items-center justify-between p-6 ${isLight ? 'border-b border-white/10' : 'border-b border-white/5'}`}>
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-3"
              >
                {isLight ? (
                  // Light Mode Logo (White/Clean)
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-sm">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-white font-display">LifeOS</span>
                  </div>
                ) : (
                  // Dark Mode Logo (Neon/Glow)
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-2xl tracking-tight text-white font-display leading-none">
                      Life<span className="text-violet-500">OS</span>
                    </span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setCollapsed(!collapsed)}
            className={`
              p-2 rounded-lg transition-colors
              ${isLight 
                ? 'bg-white/10 text-white hover:bg-white/20' 
                : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
              }
            `}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </motion.button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            
            // Light Mode Active Style
            const lightActiveClasses = "bg-white/10 text-white font-semibold shadow-sm";
            const lightInactiveClasses = "text-slate-300 hover:bg-white/5 hover:text-white";
            
            // Dark Mode Active Style
            const darkActiveClasses = "bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-white border border-violet-500/30 shadow-neon";
            const darkInactiveClasses = "text-zinc-500 hover:bg-white/5 hover:text-zinc-200";

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  relative flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group
                  ${isLight 
                    ? (isActive ? lightActiveClasses : lightInactiveClasses)
                    : (isActive ? darkActiveClasses : darkInactiveClasses)
                  }
                `}
              >
                <item.icon 
                  size={20} 
                  className={`
                    transition-colors duration-200
                    ${isLight
                      ? (isActive ? 'text-white' : 'text-slate-400 group-hover:text-white')
                      : (isActive ? 'text-violet-400' : 'text-zinc-600 group-hover:text-zinc-300')
                    }
                  `}
                />
                
                <AnimatePresence mode="wait">
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className={`
                        text-sm font-medium whitespace-nowrap
                        ${isLight ? 'font-display' : 'font-sans'}
                      `}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Dark Mode Active Indicator Glow */}
                {!isLight && isActive && (
                  <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className={`p-4 ${isLight ? 'border-t border-white/10' : 'border-t border-white/5'}`}>
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-sm text-sm
              ${isLight 
                ? 'bg-slate-600 text-white border-2 border-slate-500' 
                : 'bg-zinc-900 text-violet-400 border-2 border-violet-500/50 shadow-neon'
              }
            `}>
              {getInitials(userName)}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className={`font-bold truncate text-sm ${isLight ? 'text-white' : 'text-white'}`}>
                  {userName}
                </p>
                <p className={`text-xs ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>
                  Pro Plan
                </p>
              </div>
            )}
            
            {!collapsed && (
               <button className={`p-1.5 rounded-lg transition-colors ${isLight ? 'hover:bg-white/10 text-slate-300' : 'hover:bg-white/5 text-zinc-500'}`}>
                 <Settings size={18} />
               </button>
            )}
          </div>
          
          {onLogout && !collapsed && (
             <button onClick={onLogout} className="w-full mt-2 py-2 text-xs text-center text-slate-400 hover:text-white transition-colors">
               Sign Out
             </button>
          )}
        </div>
      </motion.aside>
    </>
  );
}
