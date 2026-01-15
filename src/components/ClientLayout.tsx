'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import Login from './Login';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    // Auth Check
    const auth = localStorage.getItem('lifeos-auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }

    // Theme Check
    const checkTheme = () => {
      const savedSettings = localStorage.getItem('lifeos-settings');
      let theme = 'dark';
      
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (parsed.appearance?.theme) {
          theme = parsed.appearance.theme;
        }
      }

      const root = document.documentElement;
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      if (theme === 'dark' || (theme === 'system' && isSystemDark)) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    checkTheme();
    // Listen for storage changes in case settings change in another tab/component
    window.addEventListener('storage', checkTheme);
    
    // Custom event listener for immediate updates from SettingsPage
    window.addEventListener('lifeos-theme-change', checkTheme);

    setIsLoading(false);
    return () => {
      window.removeEventListener('storage', checkTheme);
      window.removeEventListener('lifeos-theme-change', checkTheme);
    };
  }, []);

  const handleLogin = (password: string) => {
    localStorage.setItem('lifeos-auth', 'true');
    localStorage.setItem('lifeos-password', password);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('lifeos-auth');
    localStorage.removeItem('lifeos-password');
    setIsAuthenticated(false);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen pb-16 lg:pb-0 bg-[#0a0a0f]">
      <Sidebar 
        onLogout={handleLogout} 
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed} 
      />
      <BottomNav />
      <main 
        className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-[280px]'
        }`}
      >
        <div className="max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
