'use client';

import React from 'react';
import {
  FiPlus,
  FiMinus,
  FiArrowUpRight,
  FiArrowDownRight,
  FiTrash2,
  FiCalendar,
  FiInbox,
} from 'react-icons/fi';
import { Transaction, FinanceMetrics, TransactionType } from '@/lib/financeTypes';
import { formatINR, formatLocalDate } from '@/lib/financeUtils';

interface DashboardViewProps {
  metrics: FinanceMetrics;
  transactions: Transaction[];
  onOpenAddModal: (type: TransactionType) => void;
  onRequestDelete: (transaction: Transaction) => void;
  isLoading: boolean;
}

export default function DashboardView({
  metrics,
  transactions,
  onOpenAddModal,
  onRequestDelete,
  isLoading,
}: DashboardViewProps) {
  return (
    <div className="space-y-8">
      {/* 4 Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Available Balance */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-2">
            <span>Available Balance</span>
            <div className="h-2 w-2 rounded-full bg-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono">
            {formatINR(metrics.availableBalance)}
          </div>
          <p className="mt-1 text-[11px] text-zinc-500">
            Cumulative all-time income minus expenses
          </p>
        </div>

        {/* Metric 2: Income this month */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-2">
            <span>Income This Month</span>
            <div className="inline-flex items-center text-emerald-400">
              <FiArrowUpRight className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-400 font-mono">
            {formatINR(metrics.incomeThisMonth)}
          </div>
          <p className="mt-1 text-[11px] text-zinc-500">
            Recorded in current calendar month
          </p>
        </div>

        {/* Metric 3: Expenses this month */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-2">
            <span>Expenses This Month</span>
            <div className="inline-flex items-center text-rose-400">
              <FiArrowDownRight className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-rose-400 font-mono">
            {formatINR(metrics.expensesThisMonth)}
          </div>
          <p className="mt-1 text-[11px] text-zinc-500">
            Recorded in current calendar month
          </p>
        </div>

        {/* Metric 4: Total Earned */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-2">
            <span>Total Earned</span>
            <div className="h-2 w-2 rounded-full bg-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono">
            {formatINR(metrics.totalEarned)}
          </div>
          <p className="mt-1 text-[11px] text-zinc-500">
            All-time cumulative income
          </p>
        </div>
      </div>

      {/* Prominent Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => onOpenAddModal('income')}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 px-5 py-2.5 text-sm font-semibold text-emerald-300 hover:bg-emerald-500/25 hover:border-emerald-500/50 transition shadow-sm"
        >
          <FiPlus className="h-4 w-4" /> Add Income
        </button>

        <button
          type="button"
          onClick={() => onOpenAddModal('expense')}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-500/15 border border-rose-500/30 px-5 py-2.5 text-sm font-semibold text-rose-300 hover:bg-rose-500/25 hover:border-rose-500/50 transition shadow-sm"
        >
          <FiMinus className="h-4 w-4" /> Add Expense
        </button>
      </div>

      {/* Transaction History */}
      <div className="rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur-md overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-300">
            Recent Transactions
          </h2>
          <span className="text-xs text-zinc-500 font-mono">
            {transactions.length} {transactions.length === 1 ? 'record' : 'records'}
          </span>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-sm text-zinc-500 animate-pulse">
            Loading transactions...
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 mb-3">
              <FiInbox className="h-5 w-5" />
            </div>
            <p className="text-sm text-zinc-300 font-medium">No transactions recorded yet</p>
            <p className="mt-1 text-xs text-zinc-500 max-w-sm">
              Use the buttons above to log your first income or expense transaction.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {transactions.map((tx) => {
              const isIncome = tx.type === 'income';
              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.02] transition"
                >
                  {/* Left: Indicator & Details */}
                  <div className="flex items-center gap-3.5 min-w-0 pr-3">
                    <div
                      className={`h-8 w-8 shrink-0 rounded-xl flex items-center justify-center text-xs font-bold border ${
                        isIncome
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                          : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                      }`}
                    >
                      {isIncome ? (
                        <FiArrowUpRight className="h-4 w-4" />
                      ) : (
                        <FiArrowDownRight className="h-4 w-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {tx.title}
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 mt-0.5">
                        <FiCalendar className="h-3 w-3" />
                        <span>{formatLocalDate(tx.transaction_date)}</span>
                        <span className="text-zinc-700">•</span>
                        <span className="capitalize">{tx.type}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Amount & Delete */}
                  <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                    <span
                      className={`text-sm sm:text-base font-semibold font-mono tabular-nums ${
                        isIncome ? 'text-emerald-400' : 'text-zinc-200'
                      }`}
                    >
                      {isIncome ? '+' : '-'} {formatINR(Number(tx.amount))}
                    </span>
                    <button
                      type="button"
                      onClick={() => onRequestDelete(tx)}
                      aria-label={`Delete ${tx.title}`}
                      className="p-1.5 text-zinc-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
