'use client';

import { motion } from 'framer-motion';
import BottomNav from '../BottomNav';
import Sidebar from '../Sidebar';
import { useState } from 'react';

export default function ModernDarkLayout({ children, onLogout }: { children: React.ReactNode, onLogout: () => void }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white selection:bg-violet-500/30">
        
        {/* Background Elements for "Fresh" Dark Look */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]" />
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block fixed left-0 top-0 bottom-0 z-50">
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} onLogout={onLogout} />
        </div>

        <main 
            className={`relative z-10 pt-6 pb-24 lg:pb-8 transition-all duration-300 ${
                collapsed ? 'lg:pl-24' : 'lg:pl-[280px]'
            }`}
        >
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                 <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {children}
                </motion.div>
            </div>
        </main>

        <BottomNav />
    </div>
  );
}
