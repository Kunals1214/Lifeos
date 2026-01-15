'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Send,
  User,
  Shield,
  Target,
  BookOpen,
  Zap,
  Crown,
  History,
  Trash2,
  Brain,
  MessageSquare,
  Volume2,
  DollarSign,
  Dumbbell
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const COACHING_TOPICS = [
  { id: 'dharma', label: 'Dharma', icon: Target, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-500/10' },
  { id: 'wealth', label: 'Empire', icon: DollarSign, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-500/10' },
  { id: 'wisdom', label: 'Vedas', icon: Brain, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-100 dark:bg-violet-500/10' },
  { id: 'english', label: 'Lexicon', icon: BookOpen, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-500/10' },
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: `Greetings, Seeker. I am **Mahavir**.

I am your guide to **Life Mastery**, **Billionaire Mindset**, and **Divine Action**. Together, we will build your empire and sharpen your soul.

I am here to coach you in:
 **Dharma & Purpose** - Finding your true path using Hindu Philosophy
 **Abundance Mindset** - Think and execute like the world's 1%
 **Lexicon Expansion** - Mastering English for global impact
 **Holistic Growth** - Dominating health, wealth, and spirit

What is your focus today?`,
    timestamp: new Date()
  }
];

export default function AICoach() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const savedProfile = localStorage.getItem('lifeos-profile');
      const profile = savedProfile ? JSON.parse(savedProfile) : { name: 'Seeker' };

      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: content, 
          history: messages.slice(-10),
          profile
        }),
      });
      const data = await response.json();
      
      const assistantMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: data.response || "My connection to the divine is temporarily interrupted. Continue your practice.", 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error('Coach Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    if (confirm('Clear all teachings?')) {
      setMessages(INITIAL_MESSAGES);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[85vh] flex flex-col bg-white border border-zinc-200 dark:bg-[#0a0a0f] dark:border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-xl dark:shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-zinc-200 dark:border-zinc-800/50 bg-zinc-50 dark:bg-[#111118]/50 backdrop-blur-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-orange-600/20">
            <Crown className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase">Mahavir AI</h1>
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Imperial Guide Active
            </div>
          </div>
        </div>
        
        <button 
          onClick={clearHistory}
          className="p-3 text-zinc-500 hover:text-red-500 hover:bg-zinc-100 bg-white border border-zinc-200 dark:bg-zinc-900/50 dark:border-zinc-800 dark:hover:text-red-400 transition-colors rounded-xl"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Topics / Quick Start */}
      <div className="px-6 py-4 bg-white dark:bg-[#0a0a0f] flex gap-2 overflow-x-auto no-scrollbar border-b border-zinc-100 dark:border-none">
        {COACHING_TOPICS.map(topic => (
          <button
            key={topic.id}
            onClick={() => sendMessage(`Tell me about ${topic.label}`)}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-all text-sm font-bold ${topic.color}`}
          >
            <topic.icon size={14} />
            <span>{topic.label}</span>
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              msg.role === 'user' 
                ? 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400' 
                : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20'
            }`}>
              {msg.role === 'user' ? <User size={20} /> : <Sparkles size={20} />}
            </div>
            
            <div className={`flex-1 max-w-[80%] rounded-2xl p-4 ${
              msg.role === 'user'
                ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-200'
                : 'bg-white border border-zinc-200 text-zinc-900 dark:bg-[#111118] dark:border-zinc-800/50 dark:text-zinc-300'
            }`}>
              <div className="prose prose-zinc dark:prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap">
                {msg.content}
              </div>
              <div className="mt-2 flex items-center gap-2 text-[10px] text-zinc-400 dark:text-zinc-600 font-medium uppercase tracking-wider">
                {msg.role === 'assistant' && <span>Mahavir AI •</span>}
                <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="flex gap-4"
          >
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                <Sparkles size={20} className="animate-spin" />
             </div>
             <div className="bg-white border border-zinc-200 dark:bg-[#111118] dark:border-zinc-800 p-4 rounded-2xl flex gap-2 items-center">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-100" />
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-200" />
             </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-zinc-200 dark:bg-[#0a0a0f] dark:border-zinc-800">
        <form 
          onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
          className="relative flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Mahavir for guidance..."
            className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 dark:bg-zinc-900 dark:border-zinc-800 dark:text-white dark:placeholder-zinc-600 rounded-xl py-4 pl-4 pr-12 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-600/20"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
