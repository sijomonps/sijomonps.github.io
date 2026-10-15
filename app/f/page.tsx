'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { type Session } from '@supabase/supabase-js';
import {
  FiArrowLeft,
  FiLogOut,
  FiLayout,
  FiPieChart,
  FiRefreshCw,
  FiAlertCircle,
} from 'react-icons/fi';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { Transaction, TransactionType } from '@/lib/financeTypes';
import { calculateMetrics, calculateMonthlySummaries } from '@/lib/financeUtils';
import PasswordScreen from './components/PasswordScreen';
import DashboardView from './components/DashboardView';
import SummaryView from './components/SummaryView';
import TransactionModal from './components/TransactionModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';

export default function FinancePage() {
  const [session, setSession] = useState<Session | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Tab state: 'dashboard' | 'summary'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'summary'>('dashboard');

  // Transactions state
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalType, setAddModalType] = useState<TransactionType>('income');
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);

  // Check Supabase session on mount
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setIsCheckingSession(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsCheckingSession(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsCheckingSession(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch transactions from Supabase
  const fetchTransactions = useCallback(async () => {
    if (!supabase) return;

    try {
      setIsLoadingTransactions(true);
      setFetchError(null);

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('transaction_date', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        setFetchError(error.message || 'Failed to load transactions.');
      } else {
        setTransactions((data as Transaction[]) || []);
      }
    } catch {
      setFetchError('Could not reach the database. Please verify your connection.');
    } finally {
      setIsLoadingTransactions(false);
    }
  }, []);

  // Fetch transactions once session is confirmed
  useEffect(() => {
    if (session) {
      fetchTransactions();
    } else {
      setTransactions([]);
    }
  }, [session, fetchTransactions]);

  // Handle Logout
  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setSession(null);
    setTransactions([]);
  };

  // Open Add Transaction modal
  const handleOpenAddModal = (type: TransactionType) => {
    setAddModalType(type);
    setIsAddModalOpen(true);
  };

  // Core metrics and summaries calculations
  const metrics = useMemo(() => calculateMetrics(transactions), [transactions]);
  const monthlySummaries = useMemo(
    () => calculateMonthlySummaries(transactions),
    [transactions]
  );

  // Initial loading state
  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center relative z-10">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-foreground" />
          <span className="text-xs text-zinc-400 font-mono">Initializing Finance...</span>
        </div>
      </div>
    );
  }

  // If not authenticated, render Password Screen
  if (!session) {
    return <PasswordScreen onSuccess={fetchTransactions} />;
  }

  return (
    <div className="min-h-screen pb-16 relative z-10">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Left: Home link and Branding */}
          <div className="flex items-center gap-3 sm:gap-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-foreground transition"
              title="Return to portfolio"
            >
              <FiArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Portfolio</span>
            </Link>
            <div className="h-4 w-px bg-white/10" />
            <h1 className="font-display text-2xl tracking-wider uppercase font-bold text-foreground">
              FINANCE
            </h1>
          </div>

          {/* Center: Tabs */}
          <nav className="flex items-center rounded-xl border border-white/10 bg-white/[0.03] p-1">
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                activeTab === 'dashboard'
                  ? 'bg-white/10 text-foreground shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <FiLayout className="h-3.5 w-3.5" />
              <span>Dashboard</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('summary')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                activeTab === 'summary'
                  ? 'bg-white/10 text-foreground shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <FiPieChart className="h-3.5 w-3.5" />
              <span>Summary</span>
            </button>
          </nav>

          {/* Right: Refresh & Logout */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchTransactions}
              disabled={isLoadingTransactions}
              aria-label="Refresh data"
              title="Refresh transactions"
              className="p-2 text-zinc-400 hover:text-foreground rounded-xl hover:bg-white/5 transition disabled:opacity-50"
            >
              <FiRefreshCw
                className={`h-4 w-4 ${isLoadingTransactions ? 'animate-spin' : ''}`}
              />
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30 transition"
              title="Sign out of finance dashboard"
            >
              <FiLogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        {/* Connection / Query Error Banner */}
        {fetchError && (
          <div className="mb-6 flex items-start justify-between gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300">
            <div className="flex items-start gap-2.5">
              <FiAlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{fetchError}</span>
            </div>
            <button
              type="button"
              onClick={fetchTransactions}
              className="underline hover:text-rose-200 shrink-0 font-medium"
            >
              Retry
            </button>
          </div>
        )}

        {/* View Switcher: Dashboard or Summary */}
        {activeTab === 'dashboard' ? (
          <DashboardView
            metrics={metrics}
            transactions={transactions}
            onOpenAddModal={handleOpenAddModal}
            onRequestDelete={(tx) => setDeleteTarget(tx)}
            isLoading={isLoadingTransactions}
          />
        ) : (
          <SummaryView
            metrics={metrics}
            monthlySummaries={monthlySummaries}
          />
        )}
      </main>

      {/* Add Transaction Modal */}
      <TransactionModal
        isOpen={isAddModalOpen}
        type={addModalType}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          fetchTransactions();
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        transaction={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onDeleted={() => {
          fetchTransactions();
        }}
      />
    </div>
  );
}
