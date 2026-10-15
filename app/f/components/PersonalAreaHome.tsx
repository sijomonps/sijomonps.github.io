'use client';

import React from 'react';
import { FiCheckSquare, FiTrendingUp, FiArrowRight } from 'react-icons/fi';

interface PersonalAreaHomeProps {
  onSelectSection: (section: 'todo' | 'finance') => void;
}

export default function PersonalAreaHome({ onSelectSection }: PersonalAreaHomeProps) {
  return (
    <div className="max-w-md mx-auto py-12 sm:py-20 px-2 animate-in fade-in duration-200">
      <div className="space-y-3 sm:space-y-4">
        {/* Option 1: To-do */}
        <button
          type="button"
          onClick={() => onSelectSection('todo')}
          className="group w-full flex items-center justify-between p-4 sm:p-5 rounded-2xl border border-white/10 bg-zinc-900/50 hover:bg-zinc-900/80 hover:border-white/20 transition duration-200 text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
        >
          <div className="flex items-center gap-3.5">
            <div className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 group-hover:text-white transition">
              <FiCheckSquare className="h-4 w-4" />
            </div>
            <span className="text-sm sm:text-base font-medium text-foreground tracking-wide">
              To-do
            </span>
          </div>
          <FiArrowRight className="h-4 w-4 text-zinc-500 group-hover:text-foreground group-hover:translate-x-0.5 transition duration-200" />
        </button>

        {/* Option 2: Finance */}
        <button
          type="button"
          onClick={() => onSelectSection('finance')}
          className="group w-full flex items-center justify-between p-4 sm:p-5 rounded-2xl border border-white/10 bg-zinc-900/50 hover:bg-zinc-900/80 hover:border-white/20 transition duration-200 text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
        >
          <div className="flex items-center gap-3.5">
            <div className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 group-hover:text-white transition">
              <FiTrendingUp className="h-4 w-4" />
            </div>
            <span className="text-sm sm:text-base font-medium text-foreground tracking-wide">
              Finance
            </span>
          </div>
          <FiArrowRight className="h-4 w-4 text-zinc-500 group-hover:text-foreground group-hover:translate-x-0.5 transition duration-200" />
        </button>
      </div>
    </div>
  );
}
