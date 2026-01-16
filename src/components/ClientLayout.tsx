'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Login from './Login';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import CleanLightLayout from './layout/CleanLightLayout';
import ModernDarkLayout from './layout/ModernDarkLayout';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    // Auth Check
    const auth = localStorage.getItem('lifeos-auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
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
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-[#0a0a0f]">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // "Completely different layouts" logic
  if (theme === 'light') {
      return (
          <CleanLightLayout onLogout={handleLogout}>
              {children}
          </CleanLightLayout>
      );
  }

  return (
    <ModernDarkLayout onLogout={handleLogout}>
        {children}
    </ModernDarkLayout>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <LayoutContent>{children}</LayoutContent>
        </ThemeProvider>
    );
}

