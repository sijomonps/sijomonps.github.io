'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FiLock, FiEye, FiEyeOff, FiAlertTriangle, FiArrowLeft } from 'react-icons/fi';
import { supabase, financeLoginEmail, isSupabaseConfigured } from '@/lib/supabaseClient';

interface PasswordScreenProps {
  onSuccess: () => void;
}

export default function PasswordScreen({ onSuccess }: PasswordScreenProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isSupabaseConfigured || !supabase || !financeLoginEmail) {
      setErrorMessage('Supabase credentials or login email are not configured.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: financeLoginEmail,
        password: password,
      });

      if (error) {
        setErrorMessage('Invalid password or authentication failed. Please try again.');
      } else {
        onSuccess();
      }
    } catch {
      setErrorMessage('An unexpected error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  // If Supabase environment variables are missing, render a friendly setup message
  if (!isSupabaseConfigured || !financeLoginEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900/80 p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-3 text-amber-400 mb-4">
            <FiAlertTriangle className="h-6 w-6 shrink-0" />
            <h2 className="text-lg font-semibold tracking-wide text-foreground">
              Configuration Required
            </h2>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed mb-6">
            The Personal Finance module requires Supabase environment variables before authentication can be enabled.
          </p>
          <div className="rounded-lg bg-black/40 border border-white/5 p-4 text-xs font-mono space-y-2 text-zinc-300">
            <div>
              <span className="text-zinc-500">NEXT_PUBLIC_SUPABASE_URL</span>
              <div className="text-amber-300/80">
                {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ Configured' : '✗ Missing'}
              </div>
            </div>
            <div>
              <span className="text-zinc-500">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</span>
              <div className="text-amber-300/80">
                {process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ? '✓ Configured' : '✗ Missing'}
              </div>
            </div>
            <div>
              <span className="text-zinc-500">NEXT_PUBLIC_FINANCE_LOGIN_EMAIL</span>
              <div className="text-amber-300/80">
                {financeLoginEmail ? '✓ Configured' : '✗ Missing'}
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-white/10 transition"
            >
              <FiArrowLeft className="h-4 w-4" /> Return to Portfolio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative z-10">
      <div className="w-full max-w-md">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-zinc-900/90 text-foreground shadow-lg mb-4">
            <FiLock className="h-5 w-5 text-emerald-400" />
          </div>
          <h1 className="font-display text-4xl sm:text-5xl tracking-wider uppercase font-bold text-foreground">
            FINANCE
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Enter master password to access your dashboard
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-zinc-900/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMessage && (
              <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300">
                <FiAlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
                <span className="leading-snug">{errorMessage}</span>
              </div>
            )}

            <div>
              <label
                htmlFor="finance-password"
                className="block text-xs uppercase tracking-wider font-semibold text-zinc-400 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="finance-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  autoFocus
                  disabled={isLoading}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 pr-12 text-sm text-foreground placeholder-zinc-600 focus:border-emerald-500/60 focus:outline-none focus:ring-1 focus:ring-emerald-500/60 disabled:opacity-50 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-zinc-400 hover:text-foreground transition rounded-lg"
                >
                  {showPassword ? (
                    <FiEyeOff className="h-4 w-4" />
                  ) : (
                    <FiEye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-3 text-sm font-semibold text-background hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-foreground/20 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-md"
            >
              {isLoading ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin text-background"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Unlock Dashboard</span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between text-xs text-zinc-500">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 hover:text-zinc-300 transition"
            >
              <FiArrowLeft className="h-3.5 w-3.5" /> Back to Portfolio
            </Link>
            <span className="text-[11px] text-zinc-600">Encrypted via Supabase</span>
          </div>
        </div>
      </div>
    </div>
  );
}
