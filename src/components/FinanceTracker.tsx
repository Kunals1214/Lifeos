'use client';

import { useState, useEffect } from 'react';
import { Transaction } from '@/lib/types';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Plus, 
  Trash2, 
  ArrowUpRight, 
  ArrowDownRight,
  Target,
  Crown,
  Zap,
  DollarSign
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4'];

export default function FinanceTracker() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [amount, setAmount] = useState('');
  const [item, setItem] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');

  useEffect(() => {
    const saved = localStorage.getItem('lifeos-finance');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTransactions(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        console.error('Failed to parse finance data:', e);
        setTransactions([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('lifeos-finance', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = () => {
    if (!amount || !item) return;
    const newTx: Transaction = {
      id: Date.now().toString(),
      type: type,
      amount: parseFloat(amount),
      description: item,
      category: 'Strategic',
      date: new Date().toISOString(),
      isRecurring: false
    };
    setTransactions([newTx, ...transactions]);
    setAmount('');
    setItem('');
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const chartData = [
    { name: 'Growth', value: totalIncome },
    { name: 'Expansion', value: totalExpense },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-32">
      {/* Imperial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white flex items-center gap-3">
             TREASURY OF <span className="text-emerald-500">SOVEREIGNTY</span>
          </h1>
          <p className="text-zinc-500 text-lg mt-1">Capital management for global dominance</p>
        </div>
      </div>

      {/* Main Stats Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-emerald-900/20">
           <div className="relative z-10">
              <div className="text-emerald-200/70 text-sm font-black uppercase tracking-[0.2em] mb-2">Total Empire Reserves</div>
              <div className="text-6xl font-black tracking-tighter mb-8">?{balance.toLocaleString()}</div>
              
              <div className="grid grid-cols-2 gap-6">
                 <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase mb-1">
                       <ArrowUpRight size={14} />
                       Growth
                    </div>
                    <div className="text-2xl font-black">?{totalIncome.toLocaleString()}</div>
                 </div>
                 <div className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/5">
                    <div className="flex items-center gap-2 text-red-300 font-bold text-xs uppercase mb-1">
                       <ArrowDownRight size={14} />
                       Expansion
                    </div>
                    <div className="text-2xl font-black text-red-100">?{totalExpense.toLocaleString()}</div>
                 </div>
              </div>
           </div>
           
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] -mr-32 -mt-32 rounded-full"></div>
        </div>

        <div className="bg-[#111118] border border-zinc-800/50 rounded-[2.5rem] p-8 flex flex-col justify-center items-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={chartData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  <Cell fill="#10b981" />
                  <Cell fill="#ef4444" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex gap-6 mt-4">
               <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" /> Growth
               </div>
               <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-400">
                  <div className="w-2 h-2 bg-red-500 rounded-full" /> Expansion
               </div>
            </div>
        </div>
      </div>

      {/* Transaction Entry */}
      <div className="bg-zinc-900/30 border border-zinc-800 rounded-[2rem] p-3">
         <div className="flex flex-col md:flex-row gap-2">
            <button 
              onClick={() => setType('income')}
              className={`flex-1 py-4 rounded-xl font-black uppercase tracking-widest transition-all ${type === 'income' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-zinc-600 hover:text-white'}`}
            >
               Acquire
            </button>
            <button 
              onClick={() => setType('expense')}
              className={`flex-1 py-4 rounded-xl font-black uppercase tracking-widest transition-all ${type === 'expense' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-zinc-600 hover:text-white'}`}
            >
               Deploy
            </button>
         </div>

         <div className="flex flex-col md:flex-row gap-4 p-4 mt-2">
            <div className="flex-1 relative">
               <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
               <input 
                 type="number"
                 placeholder="0.00"
                 value={amount}
                 onChange={(e) => setAmount(e.target.value)}
                 className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-4 pl-12 pr-6 text-xl font-black text-white focus:outline-none focus:border-emerald-500/50"
               />
            </div>
            <input 
              type="text"
              placeholder="Strategic Objective..."
              value={item}
              onChange={(e) => setItem(e.target.value)}
              className="flex-[2] bg-zinc-900/50 border border-zinc-800 rounded-2xl py-4 px-6 text-xl font-bold text-white focus:outline-none focus:border-emerald-500/50"
            />
            <button 
              onClick={addTransaction}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
            >
               EXECUTE
            </button>
         </div>
      </div>

      {/* History */}
      <div className="space-y-4">
         <h2 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-600 ml-6">Recent Deployments</h2>
         <div className="space-y-3">
            {transactions.map(t => (
               <motion.div 
                 key={t.id}
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="bg-[#111118]/80 backdrop-blur-md border border-zinc-800/50 p-6 rounded-[2rem] flex items-center justify-between group hover:border-emerald-500/20 transition-all"
               >
                  <div className="flex items-center gap-4">
                     <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${t.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                        {t.type === 'income' ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                     </div>
                     <div>
                        <div className="font-black text-white tracking-tight">{t.description}</div>
                        <div className="text-[10px] uppercase font-black tracking-widest text-zinc-600">{format(parseISO(t.date), 'MMM d, h:mm a')}</div>
                     </div>
                  </div>
                  <div className="flex items-center gap-6">
                     <div className={`text-xl font-black ${t.type === 'income' ? 'text-emerald-400' : 'text-zinc-400'}`}>
                        {t.type === 'income' ? '+' : '-'} ?{t.amount.toLocaleString()}
                     </div>
                     <button onClick={() => deleteTransaction(t.id)} className="p-2 text-zinc-800 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 size={18} />
                     </button>
                  </div>
               </motion.div>
            ))}
         </div>
      </div>
    </div>
  );
}
