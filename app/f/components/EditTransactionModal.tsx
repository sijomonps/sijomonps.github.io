'use client';

import React, { useState, useEffect } from 'react';
import { FiX, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { supabase } from '@/lib/supabaseClient';
import { TransactionType, Transaction } from '@/lib/financeTypes';
import { formatIndianNumberString, parseFormattedAmount } from '@/lib/financeUtils';
import AmountInput from './AmountInput';

interface EditTransactionModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedTransaction: Transaction) => void;
}

export default function EditTransactionModal({
  transaction,
  isOpen,
  onClose,
  onSuccess,
}: EditTransactionModalProps) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<TransactionType>('income');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Pre-fill fields whenever the modal opens or the target transaction changes
  useEffect(() => {
    if (isOpen && transaction) {
      setTitle(transaction.title || '');
      setType(transaction.type);
      setAmount(formatIndianNumberString(String(transaction.amount)));
      setDate(transaction.transaction_date || '');
      setErrorMessage(null);
      setIsSubmitting(false);
    }
  }, [isOpen, transaction]);

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

  if (!isOpen || !transaction) return null;

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
        .update({
          type,
          title: trimmedTitle,
          amount: numericAmount,
          transaction_date: date,
        })
        .eq('id', transaction.id)
        .select()
        .single();

      if (error) {
        setErrorMessage(error.message || 'Failed to update transaction.');
      } else if (data) {
        onSuccess(data as Transaction);
        onClose();
      }
    } catch {
      setErrorMessage('An unexpected error occurred while saving changes.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-modal-title"
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
            <h2 id="edit-modal-title" className="text-base sm:text-lg font-semibold tracking-wide text-foreground">
              Edit Transaction
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
          {/* Type Selector Toggle: Income or Expense */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Type
            </label>
            <div className="grid grid-cols-2 rounded-xl border border-white/10 bg-black/40 p-1 gap-1">
              <button
                type="button"
                onClick={() => setType('income')}
                className={`py-2 text-xs font-semibold rounded-lg transition ${
                  isIncome
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Income
              </button>
              <button
                type="button"
                onClick={() => setType('expense')}
                className={`py-2 text-xs font-semibold rounded-lg transition ${
                  !isIncome
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Expense
              </button>
            </div>
          </div>

          {/* Title Field */}
          <div>
            <label
              htmlFor="edit-transaction-title"
              className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5"
            >
              Title
            </label>
            <input
              id="edit-transaction-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Freelance Client Payment"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-base sm:text-sm text-foreground placeholder-zinc-600 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition"
              autoFocus
            />
          </div>

          {/* Amount Field with Indian Comma Formatting */}
          <div>
            <label
              htmlFor="edit-transaction-amount"
              className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5"
            >
              Amount (₹)
            </label>
            <AmountInput
              id="edit-transaction-amount"
              value={amount}
              onChange={setAmount}
              placeholder="0.00"
              required
            />
          </div>

          {/* Date Field */}
          <div>
            <label
              htmlFor="edit-transaction-date"
              className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5"
            >
              Date
            </label>
            <input
              id="edit-transaction-date"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-base sm:text-sm text-foreground focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition [color-scheme:dark]"
            />
          </div>

          {/* Actions */}
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
                  <FiCheck className="h-4 w-4" /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
