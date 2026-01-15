'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, color: 'text-emerald-500' },
  { name: 'Habits', href: '/habits', icon: Activity, color: 'text-emerald-500' },
  { name: 'Tasks', href: '/tasks', icon: ListTodo, color: 'text-emerald-500' },
  { name: 'Finance', href: '/finance', icon: Wallet, color: 'text-emerald-500' },
  { name: 'Health', href: '/workout', icon: Dumbbell, color: 'text-cyan-500' },
  { name: 'Study', href: '/study', icon: BookOpen, color: 'text-indigo-500' },
  { name: 'Projects', href: '/projects', icon: FolderKanban, color: 'text-violet-500' },
  { name: 'Contacts', href: '/contacts', icon: Users, color: 'text-zinc-400' },
  { name: 'Progress', href: '/progress', icon: Trophy, color: 'text-amber-500' },
  { name: 'AI Coach', href: '/coach', icon: Sparkles, color: 'text-fuchsia-500' },
  { name: 'Settings', href: '/settings', icon: Settings, color: 'text-zinc-400' },
];

export default function Sidebar({ onLogout, collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname();
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

  return (
    <>
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 280 }}
        className={`
          hidden lg:flex
          fixed z-50 h-full
          transition-all duration-300 ease-in-out
          bg-white border-r border-zinc-200
          dark:bg-zinc-950 dark:border-zinc-800
          flex-col
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-900">
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <Shield className="w-5 h-5 text-white" fill="white" fillOpacity={0.2} />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-xl tracking-tight text-zinc-900 dark:text-white leading-none">LIFE<span className="text-emerald-600 dark:text-emerald-500">OS</span></span>
                  <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono">System Active</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg bg-zinc-100 text-zinc-500 hover:text-zinc-900 border border-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-white dark:border-zinc-800 transition-colors"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </motion.button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  relative flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group
                  ${isActive
                    ? 'bg-zinc-900 text-white border border-zinc-800 shadow-inner'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'
                  }
                `}
              >
                <item.icon 
                  size={18} 
                  className={`transition-colors duration-300 ${isActive ? item.color : 'group-hover:text-zinc-300'}`} 
                />
                <AnimatePresence mode="wait">
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="font-bold text-[10px] uppercase tracking-widest whitespace-nowrap font-mono"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="sidebarActive"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-emerald-500 rounded-r-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-zinc-900 bg-zinc-950">
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 font-bold shadow-sm text-xs font-mono">
              {getInitials(userName)}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white truncate text-xs uppercase tracking-wider">{userName}</p>
                <div className="flex items-center gap-1">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   <p className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest">Operator</p>
                </div>
              </div>
            )}
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              className={`
                flex items-center gap-3 px-3 py-2 w-full rounded-xl text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300
                ${collapsed ? 'justify-center' : ''}
              `}
            >
              <LogOut size={16} />
              {!collapsed && <span className="font-bold text-[10px] uppercase tracking-widest font-mono">Abort Session</span>}
            </button>
          )}
        </div>
      </motion.aside>
    </>
  );
}
