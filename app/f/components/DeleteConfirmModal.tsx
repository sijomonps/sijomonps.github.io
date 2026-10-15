'use client';

import React, { useState } from 'react';
import { FiAlertTriangle, FiTrash2, FiX } from 'react-icons/fi';
import { Transaction } from '@/lib/financeTypes';
import { formatINR, formatLocalDate } from '@/lib/financeUtils';
import { supabase } from '@/lib/supabaseClient';

interface DeleteConfirmModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onDeleted: (deletedId: string) => void;
}

export default function DeleteConfirmModal({
  transaction,
  isOpen,
  onClose,
  onDeleted,
}: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !transaction) return null;

  const handleDelete = async () => {
    if (!supabase) return;

    try {
      setIsDeleting(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from('transactions')
        .delete()
        .eq('id', transaction.id);

      if (deleteError) {
        setError(deleteError.message || 'Failed to delete transaction.');
      } else {
        onDeleted(transaction.id);
        onClose();
      }
    } catch {
      setError('An unexpected error occurred while deleting.');
    } finally {
      setIsDeleting(false);
    }
  };

  const isIncome = transaction.type === 'income';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-900/95 p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
          <div className="flex items-center gap-2 text-rose-400">
            <FiAlertTriangle className="h-5 w-5" />
            <h3 className="text-base font-semibold text-foreground">Delete Transaction</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-foreground rounded-lg transition"
            aria-label="Close"
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>

        {error && (
          <div className="mb-3 text-xs text-rose-300 bg-rose-500/10 border border-rose-500/30 p-2.5 rounded-xl">
            {error}
          </div>
        )}

        <p className="text-xs text-zinc-400 leading-relaxed">
          Are you sure you want to permanently delete this transaction? This action cannot be undone.
        </p>

        {/* Transaction snapshot */}
        <div className="my-4 rounded-xl border border-white/5 bg-black/40 p-3 text-xs space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-zinc-500">Title:</span>
            <span className="font-medium text-foreground truncate max-w-[180px]">
              {transaction.title}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-500">Amount:</span>
            <span
              className={`font-semibold ${
                isIncome ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {isIncome ? '+' : '-'}
              {formatINR(Number(transaction.amount))}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-500">Date:</span>
            <span className="text-zinc-300">{formatLocalDate(transaction.transaction_date)}</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-medium text-zinc-300 hover:bg-white/10 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md transition disabled:opacity-50"
          >
            <FiTrash2 className="h-3.5 w-3.5" />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
