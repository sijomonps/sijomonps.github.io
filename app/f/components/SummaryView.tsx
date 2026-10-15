'use client';

import React, { useState } from 'react';
import { MonthlySummary, FinanceMetrics } from '@/lib/financeTypes';
import { formatINR } from '@/lib/financeUtils';
import { FiTrendingUp, FiTrendingDown, FiBarChart2 } from 'react-icons/fi';

interface SummaryViewProps {
  metrics: FinanceMetrics;
  monthlySummaries: MonthlySummary[];
}

export default function SummaryView({
  metrics,
  monthlySummaries,
}: SummaryViewProps) {
  const [hoveredMonth, setHoveredMonth] = useState<MonthlySummary | null>(null);

  // Chronological order for chart (oldest to newest)
  const chartData = [...monthlySummaries].reverse();

  // Find max value for scaling chart bars
  const maxValue = Math.max(
    ...chartData.map((d) => Math.max(d.income, d.expenses)),
    100
  );

  return (
    <div className="space-y-8">
      {/* 1. Overall Totals */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-4">
          Overall Totals
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* All-time Income */}
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-2">
              <span>All-Time Income</span>
              <FiTrendingUp className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold tracking-tight text-emerald-400 font-mono">
              {formatINR(metrics.totalEarned)}
            </div>
            <p className="mt-1 text-[11px] text-zinc-500">
              Cumulative lifetime earnings
            </p>
          </div>

          {/* All-time Expenses */}
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-2">
              <span>All-Time Expenses</span>
              <FiTrendingDown className="h-4 w-4 text-rose-400" />
            </div>
            <div className="text-2xl font-bold tracking-tight text-rose-400 font-mono">
              {formatINR(metrics.allTimeExpenses)}
            </div>
            <p className="mt-1 text-[11px] text-zinc-500">
              Cumulative lifetime expenses
            </p>
          </div>

          {/* Available Balance */}
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-2">
              <span>Available Balance</span>
              <span
                className={`text-xs font-mono font-bold ${
                  metrics.availableBalance >= 0 ? 'text-cyan-400' : 'text-rose-400'
                }`}
              >
                {metrics.availableBalance >= 0 ? 'NET +' : 'NET -'}
              </span>
            </div>
            <div className="text-2xl font-bold tracking-tight text-foreground font-mono">
              {formatINR(metrics.availableBalance)}
            </div>
            <p className="mt-1 text-[11px] text-zinc-500">
              All-time income minus expenses
            </p>
          </div>
        </div>
      </div>

      {/* 2. Monthly Income vs Expenses Graph */}
      <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5 sm:p-6 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <FiBarChart2 className="h-4 w-4 text-zinc-400" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                Income vs Expenses Chart
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Comparative monthly breakdown
            </p>
          </div>

          {/* Chart Legend */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-emerald-500" />
              <span className="text-zinc-300">Income</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-rose-500" />
              <span className="text-zinc-300">Expenses</span>
            </div>
          </div>
        </div>

        {chartData.length === 0 ? (
          <div className="py-16 text-center text-sm text-zinc-500">
            No transaction records available to render monthly chart.
          </div>
        ) : (
          <div className="space-y-4">
            {/* Chart Canvas Area */}
            <div className="overflow-x-auto pb-2">
              <div className="min-w-[320px] sm:min-w-[480px]">
                {/* Responsive Chart Container */}
                <div className="relative h-56 w-full border-b border-white/10 flex items-end justify-around gap-2 px-2 pt-6">
                  {/* Subtle Grid reference lines */}
                  <div className="absolute inset-x-0 top-0 border-b border-white/[0.04]" />
                  <div className="absolute inset-x-0 top-1/2 border-b border-white/[0.04]" />

                  {chartData.map((d) => {
                    const incomeHeightPct = Math.min(100, Math.max(4, (d.income / maxValue) * 100));
                    const expenseHeightPct = Math.min(100, Math.max(4, (d.expenses / maxValue) * 100));

                    return (
                      <div
                        key={d.monthKey}
                        className="group relative flex-1 flex flex-col items-center justify-end h-full max-w-[80px]"
                        onMouseEnter={() => setHoveredMonth(d)}
                        onMouseLeave={() => setHoveredMonth(null)}
                      >
                        {/* Bars Container */}
                        <div className="w-full flex items-end justify-center gap-1.5 h-full pb-1">
                          {/* Income Bar */}
                          <div
                            style={{ height: `${d.income > 0 ? incomeHeightPct : 0}%` }}
                            className="w-1/2 rounded-t bg-emerald-500/80 group-hover:bg-emerald-400 transition-all duration-200"
                            title={`Income: ${formatINR(d.income)}`}
                          />
                          {/* Expense Bar */}
                          <div
                            style={{ height: `${d.expenses > 0 ? expenseHeightPct : 0}%` }}
                            className="w-1/2 rounded-t bg-rose-500/80 group-hover:bg-rose-400 transition-all duration-200"
                            title={`Expenses: ${formatINR(d.expenses)}`}
                          />
                        </div>

                        {/* Month Axis Label */}
                        <span className="mt-2 text-[11px] font-medium text-zinc-400 whitespace-nowrap group-hover:text-foreground transition">
                          {d.monthLabel}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Hover Tooltip / Detail Card */}
            <div className="min-h-[38px] flex items-center justify-center text-xs">
              {hoveredMonth ? (
                <div className="inline-flex items-center gap-4 rounded-xl border border-white/10 bg-black/60 px-4 py-1.5 text-zinc-300">
                  <span className="font-semibold text-foreground">{hoveredMonth.monthLabel}</span>
                  <span className="text-emerald-400 font-mono">
                    Income: {formatINR(hoveredMonth.income)}
                  </span>
                  <span className="text-rose-400 font-mono">
                    Expenses: {formatINR(hoveredMonth.expenses)}
                  </span>
                  <span
                    className={`font-mono font-medium ${
                      hoveredMonth.net >= 0 ? 'text-cyan-400' : 'text-amber-400'
                    }`}
                  >
                    Net: {formatINR(hoveredMonth.net)}
                  </span>
                </div>
              ) : (
                <span className="text-[11px] text-zinc-500">
                  Hover over bars to inspect monthly details
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. Monthly Summary Breakdown Table */}
      <div className="rounded-2xl border border-white/10 bg-zinc-900/60 overflow-hidden backdrop-blur-md">
        <div className="border-b border-white/10 px-5 py-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-300">
            Monthly Summary
          </h2>
          <span className="text-xs text-zinc-500 font-mono">
            {monthlySummaries.length} {monthlySummaries.length === 1 ? 'month' : 'months'}
          </span>
        </div>

        {monthlySummaries.length === 0 ? (
          <div className="p-8 text-center text-sm text-zinc-500">
            No monthly data to display yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/5 bg-white/[0.02] text-zinc-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th scope="col" className="px-5 py-3">Month</th>
                  <th scope="col" className="px-5 py-3 text-right">Income</th>
                  <th scope="col" className="px-5 py-3 text-right">Expenses</th>
                  <th scope="col" className="px-5 py-3 text-right">Net Savings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {monthlySummaries.map((s) => (
                  <tr key={s.monthKey} className="hover:bg-white/[0.02] transition">
                    <td className="px-5 py-3.5 font-sans font-medium text-foreground whitespace-nowrap">
                      {s.monthLabel}
                    </td>
                    <td className="px-5 py-3.5 text-right text-emerald-400 whitespace-nowrap">
                      {formatINR(s.income)}
                    </td>
                    <td className="px-5 py-3.5 text-right text-rose-400 whitespace-nowrap">
                      {formatINR(s.expenses)}
                    </td>
                    <td
                      className={`px-5 py-3.5 text-right font-semibold whitespace-nowrap ${
                        s.net >= 0 ? 'text-cyan-400' : 'text-amber-400'
                      }`}
                    >
                      {formatINR(s.net)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
