'use client';

import React, { useState, useEffect } from 'react';
import { FiX, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { supabase } from '@/lib/supabaseClient';
import { TransactionType, Transaction } from '@/lib/financeTypes';
import { getTodayLocalDateString, parseFormattedAmount } from '@/lib/financeUtils';
import AmountInput from './AmountInput';

interface TransactionModalProps {
  isOpen: boolean;
  type: TransactionType;
  onClose: () => void;
  onSuccess: (newTransaction: Transaction) => void;
}

export default function TransactionModal({
  isOpen,
  type,
  onClose,
  onSuccess,
}: TransactionModalProps) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(getTodayLocalDateString());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setAmount('');
      setDate(getTodayLocalDateString());
      setErrorMessage(null);
      setIsSubmitting(false);
    }
  }, [isOpen, type]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isIncome = type === 'income';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setErrorMessage('Title is required.');
      return;
    }

    const numericAmount = parseFormattedAmount(amount);
    if (numericAmount <= 0) {
      setErrorMessage('Amount must be a positive number greater than 0.');
      return;
    }

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      setErrorMessage('Please select a valid date.');
      return;
    }

    if (!supabase) {
      setErrorMessage('Database client is not available.');
      return;
    }

    try {
      setIsSubmitting(true);

      const { data, error } = await supabase
        .from('transactions')
        .insert({
          type,
          title: trimmedTitle,
          amount: numericAmount,
          transaction_date: date,
        })
        .select()
        .single();

      if (error) {
        setErrorMessage(error.message || 'Failed to save transaction.');
      } else if (data) {
        onSuccess(data as Transaction);
        onClose();
      }
    } catch {
      setErrorMessage('An unexpected error occurred while saving.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
    >
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Dialog Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900/95 p-4 sm:p-7 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span
              className={`inline-block h-2.5 w-2.5 rounded-full ${
                isIncome ? 'bg-emerald-400' : 'bg-rose-400'
              }`}
            />
            <h2 id="modal-title" className="text-base sm:text-lg font-semibold tracking-wide text-foreground">
              Add {isIncome ? 'Income' : 'Expense'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-foreground rounded-lg hover:bg-white/5 transition"
            aria-label="Close dialog"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 mb-3.5">
            <FiAlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
            <span className="leading-snug">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
          {/* Field 1: Title */}
          <div>
            <label
              htmlFor="transaction-title"
              className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5"
            >
              Title
            </label>
            <input
              id="transaction-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isIncome ? 'e.g. Freelance Client Payment' : 'e.g. Server Hosting'}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 sm:py-2.5 text-base sm:text-sm text-foreground placeholder-zinc-600 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition"
              autoFocus
            />
          </div>

          {/* Field 2: Amount */}
          <div>
            <label
              htmlFor="transaction-amount"
              className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5"
            >
              Amount (₹)
            </label>
            <AmountInput
              id="transaction-amount"
              value={amount}
              onChange={setAmount}
              placeholder="0.00"
              required
            />
          </div>

          {/* Field 3: Date */}
          <div>
            <label
              htmlFor="transaction-date"
              className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5"
            >
              Date
            </label>
            <input
              id="transaction-date"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-base sm:text-sm text-foreground focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition [color-scheme:dark]"
            />
          </div>

          {/* Submit Actions: Touch-friendly */}
          <div className="pt-2 flex items-center justify-end gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="min-h-[44px] rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-medium text-zinc-300 hover:bg-white/10 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`min-h-[44px] inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-semibold shadow-md transition disabled:opacity-50 ${
                isIncome
                  ? 'bg-emerald-500 text-zinc-950 hover:bg-emerald-400'
                  : 'bg-rose-500 text-white hover:bg-rose-400'
              }`}
            >
              {isSubmitting ? (
                'Saving...'
              ) : (
                <>
                  <FiCheck className="h-4 w-4" /> Save {isIncome ? 'Income' : 'Expense'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
