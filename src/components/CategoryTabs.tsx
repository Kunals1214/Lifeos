'use client';

import { motion } from 'framer-motion';
import clsx from 'clsx';

type CategoryFilter = 'all' | 'morning' | 'afternoon' | 'evening';

interface CategoryTabsProps {
  activeCategory: CategoryFilter;
  onCategoryChange: (category: CategoryFilter) => void;
  counts: { all: number; morning: number; afternoon: number; evening: number };
}

const categories: { value: CategoryFilter; label: string; emoji: string }[] = [
  { value: 'all', label: 'All', emoji: '⚔️' },
  { value: 'morning', label: 'Morning', emoji: '🌅' },
  { value: 'afternoon', label: 'Afternoon', emoji: '☀️' },
  { value: 'evening', label: 'Evening', emoji: '🌙' },
];

export default function CategoryTabs({ activeCategory, onCategoryChange, counts }: CategoryTabsProps) {
  return (
    <div className="flex gap-2 p-1.5 bg-zinc-900/50 border border-zinc-800 rounded-lg mb-6 overflow-x-auto">
      {categories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onCategoryChange(cat.value)}
          className={clsx(
            'relative flex-1 min-w-[90px] px-3 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all',
            activeCategory === cat.value
              ? 'text-emerald-500'
              : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
          )}
        >
          {activeCategory === cat.value && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-emerald-500/10 border border-emerald-500/20 rounded-md"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
            />
          )}
          <span className="relative z-10 flex items-center justify-center gap-2">
            <span>{cat.emoji}</span>
            <span className="hidden sm:inline">{cat.label}</span>
            <span className="px-1.5 py-0.5 rounded bg-zinc-900/50 text-[10px] border border-zinc-800">
              {counts[cat.value]}
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}
