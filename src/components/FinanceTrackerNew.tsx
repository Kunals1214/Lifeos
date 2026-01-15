'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, TrendingUp, TrendingDown, Plus, Trash2, 
  PieChart, ArrowUpRight, ArrowDownRight, Calendar,
  Coffee, Car, ShoppingBag, Film, Heart, Wifi, Home,
  Banknote, Gift, Briefcase, MoreHorizontal, X, DollarSign,
  Gem
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, isWithinInterval, subMonths, isSameDay } from 'date-fns';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  date: string;
}

const EXPENSE_CATEGORIES = [
  { id: 'food', name: 'Rations', icon: Coffee, color: '#f59e0b' },
  { id: 'transport', name: 'Mobility', icon: Car, color: '#3b82f6' },
  { id: 'shopping', name: 'Acquisitions', icon: ShoppingBag, color: '#ec4899' },
  { id: 'entertainment', name: 'Leisure', icon: Film, color: '#8b5cf6' },
  { id: 'health', name: 'Maintenance', icon: Heart, color: '#ef4444' },
  { id: 'utilities', name: 'Utilities', icon: Wifi, color: '#06b6d4' },
  { id: 'rent', name: 'Garrison', icon: Home, color: '#6366f1' },
  { id: 'other', name: 'Miscellaneous', icon: MoreHorizontal, color: '#71717a' },
];

const INCOME_CATEGORIES = [
  { id: 'salary', name: 'Contract', icon: Banknote, color: '#10b981' },
  { id: 'freelance', name: 'Bounties', icon: Briefcase, color: '#14b8a6' },
  { id: 'gift', name: 'Tribute', icon: Gift, color: '#f59e0b' },
  { id: 'other', name: 'Other', icon: MoreHorizontal, color: '#71717a' },
];

const PIE_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#ef4444', '#06b6d4', '#71717a'];

export default function FinanceTrackerNew() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    category: 'food',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
  });
  const [monthlyBudget, setMonthlyBudget] = useState(50000);
  const [viewMode, setViewMode] = useState<'overview' | 'transactions'>('overview');
  const [dateRange, setDateRange] = useState<'thisMonth' | 'lastMonth' | 'all'>('thisMonth');

  useEffect(() => {
    const saved = localStorage.getItem('finance_transactions');
    if (saved) setTransactions(JSON.parse(saved));
    
    const savedBudget = localStorage.getItem('finance_budget');
    if (savedBudget) setMonthlyBudget(Number(savedBudget));
  }, []);

  useEffect(() => {
    localStorage.setItem('finance_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    return transactions.filter(t => {
      const date = new Date(t.date);
      if (dateRange === 'thisMonth') {
        return isWithinInterval(date, { start: startOfMonth(now), end: endOfMonth(now) });
      } else if (dateRange === 'lastMonth') {
        const lastMonth = subMonths(now, 1);
        return isWithinInterval(date, { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) });
      }
      return true;
    });
  }, [transactions, dateRange]);

  const stats = useMemo(() => {
    const income = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expenses;
    const budgetUsed = Math.min((expenses / monthlyBudget) * 100, 100);
    
    return { income, expenses, balance, budgetUsed };
  }, [filteredTransactions, monthlyBudget]);

  const categoryBreakdown = useMemo(() => {
    const expenses = filteredTransactions.filter(t => t.type === 'expense');
    const breakdown: Record<string, number> = {};
    
    expenses.forEach(t => {
      breakdown[t.category] = (breakdown[t.category] || 0) + t.amount;
    });
    
    return Object.entries(breakdown)
      .map(([category, amount]) => ({
        name: EXPENSE_CATEGORIES.find(c => c.id === category)?.name || category,
        value: amount,
        color: EXPENSE_CATEGORIES.find(c => c.id === category)?.color || '#71717a',
      }))
      .sort((a, b) => b.value - a.value);
  }, [filteredTransactions]);

  const weeklyData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const data = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayTransactions = transactions.filter(t => isSameDay(new Date(t.date), date));
      
      data.push({
        day: days[date.getDay()],
        income: dayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
        expenses: dayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
      });
    }
    
    return data;
  }, [transactions]);

  const addTransaction = () => {
    if (!newTransaction.amount || !newTransaction.category) return;
    
    const transaction: Transaction = {
      id: Date.now().toString(),
      amount: Number(newTransaction.amount),
      type: newTransaction.type,
      category: newTransaction.category,
      description: newTransaction.description,
      date: newTransaction.date,
    };
    
    setTransactions([transaction, ...transactions]);
    setNewTransaction({
      type: 'expense',
      amount: '',
      category: 'food',
      description: '',
      date: format(new Date(), 'yyyy-MM-dd'),
    });
    setIsModalOpen(false);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-32">
      {/* Imperial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-white flex items-center gap-3 uppercase">
            EMPIRE <span className="text-emerald-600 dark:text-emerald-500">TREASURY</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg mt-1 font-mono uppercase tracking-tight">Financial logistics and wealth accumulation</p>
        </div>
        
        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as typeof dateRange)}
            className="px-4 py-3 rounded-xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 text-xs font-bold uppercase tracking-widest backdrop-blur-xl focus:outline-none focus:border-emerald-500/50 transition-colors text-zinc-900 dark:text-zinc-400"
          >
            <option value="thisMonth">Current Cycle</option>
            <option value="lastMonth">Previous Cycle</option>
            <option value="all">All Records</option>
          </select>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20 text-xs uppercase tracking-widest"
          >
            <Plus size={16} />
            ACQUIRE ASSET
          </button>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "NET WORTH", value: stats.balance, icon: Gem, color: stats.balance >= 0 ? "text-emerald-400" : "text-red-400" },
          { label: "REVENUE", value: stats.income, icon: TrendingUp, color: "text-emerald-400" },
          { label: "EXPENDITURE", value: stats.expenses, icon: TrendingDown, color: "text-red-400" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 backdrop-blur-xl group hover:border-emerald-500/30 transition-all shadow-sm dark:shadow-none"
          >
            <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 w-fit mb-4 group-hover:scale-110 transition-transform">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest">{stat.label}</p>
            <div className="flex items-end gap-1 mt-1">
              <h3 className={`text-2xl font-black font-mono ${stat.color}`}>
                {formatCurrency(stat.value)}
              </h3>
            </div>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 backdrop-blur-xl group hover:border-emerald-500/30 transition-all shadow-sm dark:shadow-none"
        >
          <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 w-fit mb-4 group-hover:scale-110 transition-transform">
            <PieChart className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest">BUDGET ALLOCATION</p>
          <div className="flex items-center gap-3 mt-1">
            <h3 className="text-2xl font-black text-zinc-900 dark:text-white font-mono">{Math.round(stats.budgetUsed)}%</h3>
            <div className="flex-1 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all ${
                  stats.budgetUsed >= 90 ? 'bg-red-500' : stats.budgetUsed >= 70 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${stats.budgetUsed}%` }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2 p-1 bg-white dark:bg-zinc-900/50 backdrop-blur-xl rounded-xl border border-zinc-200 dark:border-zinc-800/50 w-fit shadow-sm dark:shadow-none">
        <button
          onClick={() => setViewMode('overview')}
          className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
            viewMode === 'overview' 
              ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setViewMode('transactions')}
          className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
            viewMode === 'transactions' 
              ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5'
          }`}
        >
          Ledger
        </button>
      </div>

      {viewMode === 'overview' ? (
        <>
          {/* Charts Row */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Expense Breakdown */}
            <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-xl rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800/50 hover:border-emerald-500/30 transition-all shadow-sm dark:shadow-none">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                <PieChart className="w-4 h-4" />
                Resource Distribution
              </h3>
              
              {categoryBreakdown.length > 0 ? (
                <div className="flex items-center gap-8">
                  <div className="w-40 h-40 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPie>
                        <Pie
                          data={categoryBreakdown}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={70}
                          paddingAngle={2}
                          stroke="none"
                        >
                          {categoryBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </RechartsPie>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="text-center">
                         <span className="text-xs text-zinc-500 font-bold">TOTAL</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    {categoryBreakdown.slice(0, 5).map((item, index) => (
                      <div key={index} className="flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-300 transition-colors">{item.name}</span>
                        </div>
                        <span className="text-xs font-mono font-medium text-zinc-900 dark:text-zinc-400">{formatCurrency(item.value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-40 flex items-center justify-center text-zinc-500 font-mono text-xs uppercase tracking-widest">
                  No data points available
                </div>
              )}
            </div>

            {/* Weekly Trend */}
            <div className="bg-white dark:bg-zinc-900/50 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800/50 hover:border-emerald-500/30 transition-all shadow-sm dark:shadow-none">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                <Calendar className="w-4 h-4" />
                7-Day Trajectory
              </h3>
              
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData} barGap={4}>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 10, fontWeight: 700 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }} tickFormatter={(v) => `₹${v/1000}k`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px' }}
                      labelStyle={{ color: '#a1a1aa', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}
                      itemStyle={{ fontFamily: 'monospace', fontSize: '12px' }}
                      formatter={(value) => [formatCurrency(Number(value || 0)), '']}
                      cursor={{fill: '#27272a', opacity: 0.4}}
                    />
                    <Bar dataKey="income" fill="#10b981" radius={[2, 2, 0, 0]} name="INFLOW" maxBarSize={40} />
                    <Bar dataKey="expenses" fill="#ef4444" radius={[2, 2, 0, 0]} name="OUTFLOW" maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Top Spending Categories */}
          <div className="bg-zinc-900/50 rounded-3xl p-8 border border-zinc-800/50">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-zinc-400">Highest Expenditures</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {categoryBreakdown.slice(0, 4).map((cat, index) => {
                const categoryInfo = EXPENSE_CATEGORIES.find(c => c.name === cat.name);
                const Icon = categoryInfo?.icon || MoreHorizontal;
                const percentage = stats.expenses > 0 ? Math.round((cat.value / stats.expenses) * 100) : 0;
                
                return (
                  <div 
                    key={index} 
                    className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${cat.color}15` }}
                      >
                        <Icon size={16} style={{ color: cat.color }} />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider truncate">{cat.name}</p>
                        <p className="font-mono text-sm font-bold text-zinc-300">{formatCurrency(cat.value)}</p>
                      </div>
                    </div>
                    <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all"
                        style={{ width: `${percentage}%`, backgroundColor: cat.color }}
                      />
                    </div>
                    <p className="text-[10px] text-zinc-600 mt-2 font-mono text-right">{percentage}% ALLOCATION</p>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        /* Transactions List */
        <div className="bg-zinc-900/50 rounded-3xl border border-zinc-800/50 overflow-hidden">
          <div className="p-6 border-b border-zinc-800/50 flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Recent Operations</h3>
            <span className="text-xs font-mono text-zinc-600 px-2 py-1 bg-zinc-900 rounded border border-zinc-800">{filteredTransactions.length} RECORDS</span>
          </div>
          
          <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
            {filteredTransactions.length > 0 ? (
              <div className="divide-y divide-zinc-800/50">
                {filteredTransactions
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((transaction) => {
                    const categories = transaction.type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
                    const categoryInfo = categories.find(c => c.id === transaction.category);
                    const Icon = categoryInfo?.icon || MoreHorizontal;
                    
                    return (
                      <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-6 p-5 hover:bg-zinc-800/30 transition-colors group"
                      >
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border border-zinc-800 bg-zinc-900"
                        >
                          <Icon size={16} style={{ color: categoryInfo?.color }} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-zinc-300 truncate tracking-tight">{transaction.description || categoryInfo?.name}</p>
                          <p className="text-[10px] uppercase tracking-widest text-zinc-500 mt-0.5">{format(new Date(transaction.date), 'MMM d, yyyy')}</p>
                        </div>
                        
                        <div className="text-right">
                          <p className={`font-bold font-mono ${transaction.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                            {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </p>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-600 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">{transaction.category}</span>
                        </div>
                        
                        <button
                          onClick={() => deleteTransaction(transaction.id)}
                          className="p-2 rounded-lg hover:bg-red-500/10 text-zinc-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </motion.div>
                    );
                  })}
              </div>
            ) : (
              <div className="p-20 text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
                  <Wallet className="w-8 h-8 text-zinc-700" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-2">Ledger Empty</h3>
                <p className="text-zinc-600 text-xs font-mono mb-6">No financial records found in this cycle</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-6 py-3 rounded-xl bg-emerald-600/20 text-emerald-500 border border-emerald-500/50 hover:bg-emerald-600 hover:text-white transition-all text-xs font-bold uppercase tracking-widest"
                >
                  Create Record
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Transaction Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#111118] rounded-3xl p-8 w-full max-w-lg border border-zinc-800 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />

              <div className="flex items-center justify-between mb-8 relative z-10">
                <div>
                   <h2 className="text-xl font-black uppercase tracking-tight text-white">Log Operation</h2>
                   <p className="text-xs text-zinc-500 font-mono mt-1">Record financial movement</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-3 rounded-xl hover:bg-zinc-800 text-zinc-500 hover:text-white transition-colors border border-transparent hover:border-zinc-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6 relative z-10">
                {/* Type Toggle */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-900 rounded-xl border border-zinc-800">
                  <button
                    onClick={() => setNewTransaction({ ...newTransaction, type: 'expense', category: 'food' })}
                    className={`py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${
                      newTransaction.type === 'expense' 
                        ? 'bg-red-500/10 text-red-500 shadow-sm' 
                        : 'text-zinc-500 hover:text-white'
                    }`}
                  >
                    Outflow
                  </button>
                  <button
                    onClick={() => setNewTransaction({ ...newTransaction, type: 'income', category: 'salary' })}
                    className={`py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${
                      newTransaction.type === 'income' 
                        ? 'bg-emerald-500/10 text-emerald-500 shadow-sm' 
                        : 'text-zinc-500 hover:text-white'
                    }`}
                  >
                    Inflow
                  </button>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Value</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 font-mono text-lg">₹</span>
                    <input
                      type="number"
                      value={newTransaction.amount}
                      onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                      placeholder="0"
                      className="w-full pl-10 pr-5 py-4 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-emerald-500/50 text-2xl font-black font-mono"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Classification</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(newTransaction.type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setNewTransaction({ ...newTransaction, category: cat.id })}
                        className={`p-3 rounded-xl flex flex-col items-center gap-2 transition-all border ${
                          newTransaction.category === cat.id
                            ? 'bg-zinc-800 border-emerald-500/50'
                            : 'bg-zinc-950 border-zinc-900 hover:border-zinc-800'
                        }`}
                      >
                        <div style={{ color: cat.color }}>
                           <cat.icon size={18} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-tight text-zinc-500 w-full text-center truncate">{cat.name.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Details (Optional)</label>
                  <input
                    type="text"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                    placeholder="Operation specifics..."
                    className="w-full px-5 py-4 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-700 focus:outline-none focus:border-emerald-500/50 transition-all font-mono text-sm"
                  />
                </div>

                {/* Date */}
                <div>
                   <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Execution Date</label>
                  <input
                    type="date"
                    value={newTransaction.date}
                    onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                    className="w-full px-5 py-4 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-emerald-500/50 text-sm font-mono"
                  />
                </div>

                <button
                  onClick={addTransaction}
                  disabled={!newTransaction.amount}
                  className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-lg active:scale-95 ${
                    newTransaction.type === 'expense'
                      ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/20'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                  }`}
                >
                  Confirm {newTransaction.type === 'expense' ? 'Debit' : 'Credit'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Budget Settings Floating Button */}
      <button
        onClick={() => {
          const budget = prompt('Set monthly allotment (₹)', monthlyBudget.toString());
          if (budget) {
            const newBudget = Number(budget);
            if (!isNaN(newBudget) && newBudget > 0) {
              setMonthlyBudget(newBudget);
              localStorage.setItem('finance_budget', newBudget.toString());
            }
          }
        }}
        className="fixed bottom-8 right-8 p-4 rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 hover:scale-110 active:scale-95 transition-all z-40 group"
        title="Set Budget"
      >
        <Banknote size={24} />
        <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-zinc-900 border border-zinc-800 text-xs font-bold uppercase tracking-widest rounded-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-zinc-300">
           Set Allotment
        </span>
      </button>
    </div>
  );
}
