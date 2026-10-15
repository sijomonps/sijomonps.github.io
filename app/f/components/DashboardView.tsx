'use client';

import React, { useState } from 'react';
import {
  FiPlus,
  FiMinus,
  FiArrowUpRight,
  FiArrowDownRight,
  FiTrendingUp,
  FiEdit2,
  FiTrash2,
  FiCalendar,
  FiInbox,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';
import { Transaction, FinanceMetrics, TransactionType } from '@/lib/financeTypes';
import { formatINR, formatLocalDate } from '@/lib/financeUtils';

interface DashboardViewProps {
  metrics: FinanceMetrics;
  transactions: Transaction[];
  onOpenAddModal: (type: TransactionType) => void;
  onOpenEditModal: (transaction: Transaction) => void;
  onRequestDelete: (transaction: Transaction) => void;
  isLoading: boolean;
}

const PAGE_SIZE = 10;

export default function DashboardView({
  metrics,
  transactions,
  onOpenAddModal,
  onOpenEditModal,
  onRequestDelete,
  isLoading,
}: DashboardViewProps) {
  const [page, setPage] = useState(1);

  // Pagination bounds & clamping
  const totalPages = Math.ceil(transactions.length / PAGE_SIZE) || 1;
  const safePage = Math.min(Math.max(1, page), totalPages);

  const startIndex = (safePage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, transactions.length);
  const paginatedTransactions = transactions.slice(startIndex, endIndex);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 4 Financial Metrics Cards: 1 column at 320px, compact 2 columns >= 360px, 4 columns on lg */}
      <div className="grid grid-cols-1 min-[360px]:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Metric 1: Available Balance */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 p-3.5 sm:p-5 backdrop-blur-md">
          <div className="flex items-center justify-between text-[11px] sm:text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-1.5 sm:mb-2">
            <span className="truncate">Available Balance</span>
            <span
              className={`text-[11px] sm:text-xs font-mono font-semibold shrink-0 ${
                metrics.availableBalance >= 0 ? 'text-cyan-400' : 'text-rose-400'
              }`}
            >
              {metrics.availableBalance >= 0 ? 'NET +' : 'NET -'}
            </span>
          </div>
          <div className="text-lg min-[360px]:text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-foreground font-mono tabular-nums truncate">
            {formatINR(metrics.availableBalance)}
          </div>
          <p className="mt-1 text-[10px] sm:text-[11px] text-zinc-500 line-clamp-1">
            All-time income minus expenses
          </p>
        </div>

        {/* Metric 2: Income this month */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 p-3.5 sm:p-5 backdrop-blur-md">
          <div className="flex items-center justify-between text-[11px] sm:text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-1.5 sm:mb-2">
            <span className="truncate">Income This Month</span>
            <div className="inline-flex items-center text-emerald-400 shrink-0">
              <FiArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
          </div>
          <div className="text-lg min-[360px]:text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-emerald-400 font-mono tabular-nums truncate">
            {formatINR(metrics.incomeThisMonth)}
          </div>
          <p className="mt-1 text-[10px] sm:text-[11px] text-zinc-500 line-clamp-1">
            Current calendar month
          </p>
        </div>

        {/* Metric 3: Expenses this month */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 p-3.5 sm:p-5 backdrop-blur-md">
          <div className="flex items-center justify-between text-[11px] sm:text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-1.5 sm:mb-2">
            <span className="truncate">Expenses This Month</span>
            <div className="inline-flex items-center text-rose-400 shrink-0">
              <FiArrowDownRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
          </div>
          <div className="text-lg min-[360px]:text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-rose-400 font-mono tabular-nums truncate">
            {formatINR(metrics.expensesThisMonth)}
          </div>
          <p className="mt-1 text-[10px] sm:text-[11px] text-zinc-500 line-clamp-1">
            Current calendar month
          </p>
        </div>

        {/* Metric 4: Total Earned */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 p-3.5 sm:p-5 backdrop-blur-md">
          <div className="flex items-center justify-between text-[11px] sm:text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-1.5 sm:mb-2">
            <span className="truncate">Total Earned</span>
            <div className="inline-flex items-center text-emerald-400 shrink-0">
              <FiTrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
          </div>
          <div className="text-lg min-[360px]:text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-foreground font-mono tabular-nums truncate">
            {formatINR(metrics.totalEarned)}
          </div>
          <p className="mt-1 text-[10px] sm:text-[11px] text-zinc-500 line-clamp-1">
            All-time cumulative income
          </p>
        </div>
      </div>

      {/* Action Buttons: 2 balanced equal-width buttons on mobile, auto-width on desktop */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 w-full sm:w-auto sm:flex sm:items-center">
        <button
          type="button"
          onClick={() => onOpenAddModal('income')}
          className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 px-3 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold text-emerald-300 hover:bg-emerald-500/25 hover:border-emerald-500/50 transition shadow-sm"
        >
          <FiPlus className="h-4 w-4" />
          <span>Add Income</span>
        </button>

        <button
          type="button"
          onClick={() => onOpenAddModal('expense')}
          className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-rose-500/15 border border-rose-500/30 px-3 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold text-rose-300 hover:bg-rose-500/25 hover:border-rose-500/50 transition shadow-sm"
        >
          <FiMinus className="h-4 w-4" />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Transaction History */}
      <div className="rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur-md overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 px-4 sm:px-5 py-3.5 sm:py-4">
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-zinc-300">
            Recent Transactions
          </h2>
          <span className="text-[11px] sm:text-xs text-zinc-500 font-mono">
            {transactions.length} {transactions.length === 1 ? 'record' : 'records'}
          </span>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-xs sm:text-sm text-zinc-500 animate-pulse">
            Loading transactions...
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 sm:py-12 px-4 text-center">
            <div className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 mb-3">
              <FiInbox className="h-5 w-5" />
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 font-medium">
              No transactions recorded yet
            </p>
            <p className="mt-1 text-[11px] sm:text-xs text-zinc-500 max-w-xs">
              Use the buttons above to log your first income or expense transaction.
            </p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-white/5">
              {paginatedTransactions.map((tx) => {
                const isIncome = tx.type === 'income';
                return (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between gap-2 px-3.5 sm:px-5 py-3 hover:bg-white/[0.02] transition"
                  >
                    {/* Left: Indicator & Details */}
                    <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                      <div
                        className={`h-7 w-7 sm:h-8 sm:w-8 shrink-0 rounded-xl flex items-center justify-center text-xs font-bold border ${
                          isIncome
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                        }`}
                      >
                        {isIncome ? (
                          <FiArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        ) : (
                          <FiArrowDownRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-medium text-foreground truncate">
                          {tx.title}
                        </p>
                        <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-zinc-500 mt-0.5">
                          <FiCalendar className="h-3 w-3 shrink-0" />
                          <span className="truncate">{formatLocalDate(tx.transaction_date)}</span>
                          <span className="text-zinc-700 shrink-0">•</span>
                          <span className="capitalize shrink-0">{tx.type}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Amount, Edit, & Delete */}
                    <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                      <span
                        className={`text-xs sm:text-sm font-semibold font-mono tabular-nums whitespace-nowrap mr-1 sm:mr-1.5 ${
                          isIncome ? 'text-emerald-400' : 'text-zinc-200'
                        }`}
                      >
                        {isIncome ? '+' : '-'} {formatINR(Number(tx.amount))}
                      </span>
                      <button
                        type="button"
                        onClick={() => onOpenEditModal(tx)}
                        aria-label={`Edit ${tx.title}`}
                        title="Edit transaction"
                        className="p-1.5 sm:p-2 text-zinc-500 hover:text-cyan-400 rounded-lg hover:bg-cyan-500/10 transition min-w-[32px] min-h-[32px] sm:min-w-[36px] sm:min-h-[36px] flex items-center justify-center"
                      >
                        <FiEdit2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onRequestDelete(tx)}
                        aria-label={`Delete ${tx.title}`}
                        title="Delete transaction"
                        className="p-1.5 sm:p-2 text-zinc-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition min-w-[32px] min-h-[32px] sm:min-w-[36px] sm:min-h-[36px] flex items-center justify-center"
                      >
                        <FiTrash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls Bar */}
            <div className="flex flex-col min-[420px]:flex-row items-center justify-between gap-2.5 border-t border-white/10 px-3.5 sm:px-5 py-3 text-xs text-zinc-400 bg-white/[0.01]">
              <div className="font-mono text-[11px] sm:text-xs">
                Showing{' '}
                <span className="text-zinc-200 font-semibold">
                  {transactions.length === 0 ? 0 : startIndex + 1}–{endIndex}
                </span>{' '}
                of{' '}
                <span className="text-zinc-200 font-semibold">
                  {transactions.length}
                </span>
              </div>

              <div className="flex items-center justify-between min-[420px]:justify-end gap-3 w-full min-[420px]:w-auto">
                <span className="text-[11px] sm:text-xs font-mono text-zinc-500">
                  Page {safePage} of {totalPages}
                </span>
                <div className="inline-flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={safePage <= 1}
                    className="p-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:text-foreground text-zinc-300 disabled:opacity-30 disabled:pointer-events-none transition min-w-[32px] min-h-[32px] flex items-center justify-center"
                    aria-label="Previous page"
                    title="Previous page"
                  >
                    <FiChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safePage >= totalPages}
                    className="p-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:text-foreground text-zinc-300 disabled:opacity-30 disabled:pointer-events-none transition min-w-[32px] min-h-[32px] flex items-center justify-center"
                    aria-label="Next page"
                    title="Next page"
                  >
                    <FiChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
