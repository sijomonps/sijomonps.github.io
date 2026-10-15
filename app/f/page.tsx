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
import { calculateMetrics } from '@/lib/financeUtils';
import PasswordScreen from './components/PasswordScreen';
import PersonalAreaHome from './components/PersonalAreaHome';
import DashboardView from './components/DashboardView';
import SummaryView from './components/SummaryView';
import TodoView from './components/TodoView';
import TransactionModal from './components/TransactionModal';
import EditTransactionModal from './components/EditTransactionModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';

export default function PersonalAreaPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Section state: 'home' (Selection page) | 'todo' | 'finance'
  const [activeSection, setActiveSection] = useState<'home' | 'todo' | 'finance'>('home');

  // Finance tab state: 'dashboard' | 'summary'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'summary'>('dashboard');

  // Transactions state (Loaded only when Finance is chosen)
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [hasFetchedTransactions, setHasFetchedTransactions] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Finance modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalType, setAddModalType] = useState<TransactionType>('income');
  const [editTarget, setEditTarget] = useState<Transaction | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);

  // Synchronize section with URL search parameter (?section=todo | ?section=finance)
  useEffect(() => {
    const syncFromUrl = () => {
      if (typeof window === 'undefined') return;
      const params = new URLSearchParams(window.location.search);
      const sec = params.get('section');
      if (sec === 'todo' || sec === 'finance') {
        setActiveSection(sec);
      } else {
        setActiveSection('home');
      }
    };

    syncFromUrl();
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, []);

  const navigateToSection = (section: 'home' | 'todo' | 'finance') => {
    setActiveSection(section);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (section === 'home') {
        url.searchParams.delete('section');
      } else {
        url.searchParams.set('section', section);
      }
      window.history.pushState({}, '', url.toString());
    }
  };

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

  // Strict email validation to guard against unauthorized sessions
  const financeLoginEmail = process.env.NEXT_PUBLIC_FINANCE_LOGIN_EMAIL;
  useEffect(() => {
    if (session && financeLoginEmail) {
      const userEmail = session.user?.email;
      if (userEmail && userEmail.toLowerCase() !== financeLoginEmail.toLowerCase()) {
        supabase?.auth.signOut();
        setSession(null);
      }
    }
  }, [session, financeLoginEmail]);

  // Fetch transactions only when user enters Finance
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
        setHasFetchedTransactions(true);
      }
    } catch {
      setFetchError('Could not reach the database. Please verify your connection.');
    } finally {
      setIsLoadingTransactions(false);
    }
  }, []);

  // Trigger transaction fetching strictly when in Finance section
  useEffect(() => {
    if (session && activeSection === 'finance' && !hasFetchedTransactions) {
      fetchTransactions();
    }
  }, [session, activeSection, hasFetchedTransactions, fetchTransactions]);

  // Handle Logout: clear session, state, and URL
  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setSession(null);
    setTransactions([]);
    setHasFetchedTransactions(false);
    setActiveSection('home');
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('section');
      window.history.replaceState({}, '', url.toString());
    }
  };

  // Open Add Transaction modal
  const handleOpenAddModal = (type: TransactionType) => {
    setAddModalType(type);
    setIsAddModalOpen(true);
  };

  // Calculate finance metrics only for the Finance view
  const metrics = useMemo(() => calculateMetrics(transactions), [transactions]);

  // Checking session loading state
  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-foreground" />
      </div>
    );
  }

  // Step 1: Unauthenticated -> show only the clean login screen
  if (!session) {
    return (
      <PasswordScreen
        onSuccess={() => {
          setActiveSection('home');
        }}
      />
    );
  }

  // Authenticated: render navigation bar and the active section
  return (
    <div className="min-h-screen pb-16 relative z-10 overflow-x-hidden">
      {/* Subtle Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="h-14 flex items-center justify-between gap-3">
            {/* Left Control: Back button or Return to Portfolio */}
            <div className="flex items-center gap-2">
              {activeSection === 'home' ? (
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-foreground transition py-1"
                  title="Return to portfolio"
                >
                  <FiArrowLeft className="h-3.5 w-3.5" />
                  <span>Portfolio</span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => navigateToSection('home')}
                  className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-foreground transition py-1"
                  title="Return to Personal Area"
                >
                  <FiArrowLeft className="h-3.5 w-3.5" />
                  <span>Personal Area</span>
                </button>
              )}
            </div>

            {/* Center: Tabs for Finance section only */}
            {activeSection === 'finance' && (
              <nav className="hidden sm:flex items-center rounded-xl border border-white/10 bg-white/[0.03] p-0.5">
                <button
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium transition ${
                    activeTab === 'dashboard'
                      ? 'bg-white/10 text-foreground'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <FiLayout className="h-3 w-3" />
                  <span>Dashboard</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('summary')}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium transition ${
                    activeTab === 'summary'
                      ? 'bg-white/10 text-foreground'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <FiPieChart className="h-3 w-3" />
                  <span>Summary</span>
                </button>
              </nav>
            )}

            {/* Right: Refresh (in Finance) & Discreet Logout */}
            <div className="flex items-center gap-2">
              {activeSection === 'finance' && (
                <button
                  type="button"
                  onClick={fetchTransactions}
                  disabled={isLoadingTransactions}
                  aria-label="Refresh data"
                  title="Refresh"
                  className="p-1.5 text-zinc-400 hover:text-foreground rounded-lg transition disabled:opacity-40"
                >
                  <FiRefreshCw
                    className={`h-3.5 w-3.5 ${isLoadingTransactions ? 'animate-spin' : ''}`}
                  />
                </button>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 transition py-1"
                title="Log out"
              >
                <FiLogOut className="h-3.5 w-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile Tab row for Finance */}
          {activeSection === 'finance' && (
            <div className="block sm:hidden pb-2 pt-0.5">
              <nav className="grid grid-cols-2 rounded-xl border border-white/10 bg-white/[0.03] p-0.5 text-center">
                <button
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  className={`py-1.5 text-xs font-medium rounded-lg transition ${
                    activeTab === 'dashboard'
                      ? 'bg-white/10 text-foreground'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('summary')}
                  className={`py-1.5 text-xs font-medium rounded-lg transition ${
                    activeTab === 'summary'
                      ? 'bg-white/10 text-foreground'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Summary
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
        {/* Step 2: Selection screen (No financial figures, only To-do and Finance options) */}
        {activeSection === 'home' && (
          <PersonalAreaHome onSelectSection={navigateToSection} />
        )}

        {/* Step 3A: To-do Section */}
        {activeSection === 'todo' && <TodoView session={session} />}

        {/* Step 3B: Finance Section */}
        {activeSection === 'finance' && (
          <>
            {fetchError && (
              <div className="mb-5 flex items-start justify-between gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300">
                <div className="flex items-start gap-2 min-w-0">
                  <FiAlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
                  <span className="leading-snug">{fetchError}</span>
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

            {activeTab === 'dashboard' ? (
              <DashboardView
                metrics={metrics}
                transactions={transactions}
                onOpenAddModal={handleOpenAddModal}
                onOpenEditModal={(tx) => setEditTarget(tx)}
                onRequestDelete={(tx) => setDeleteTarget(tx)}
                isLoading={isLoadingTransactions}
              />
            ) : (
              <SummaryView metrics={metrics} transactions={transactions} />
            )}
          </>
        )}
      </main>

      {/* Modals for Finance management */}
      <TransactionModal
        isOpen={isAddModalOpen}
        type={addModalType}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          fetchTransactions();
        }}
      />

      <EditTransactionModal
        isOpen={Boolean(editTarget)}
        transaction={editTarget}
        onClose={() => setEditTarget(null)}
        onSuccess={() => {
          fetchTransactions();
        }}
      />

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
