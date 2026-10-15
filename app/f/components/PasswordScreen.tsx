'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FiLock, FiArrowRight, FiArrowLeft, FiAlertTriangle } from 'react-icons/fi';
import { supabase, financeLoginEmail, isSupabaseConfigured } from '@/lib/supabaseClient';

interface PasswordScreenProps {
  onSuccess: () => void;
}

export default function PasswordScreen({ onSuccess }: PasswordScreenProps) {
  const [email, setEmail] = useState(financeLoginEmail || '');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const needsEmailInput = !financeLoginEmail;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const targetEmail = (financeLoginEmail || email).trim();

    if (!isSupabaseConfigured || !supabase) {
      setErrorMessage('Supabase is not configured.');
      return;
    }

    if (!targetEmail) {
      setErrorMessage('Please enter an email address.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: targetEmail,
        password: password,
      });

      if (error || !data?.session) {
        setErrorMessage(error?.message || 'Invalid credentials.');
      } else {
        onSuccess();
      }
    } catch {
      setErrorMessage('Authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Missing configuration fallback
  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-900/60 p-6 text-center">
          <FiAlertTriangle className="h-5 w-5 text-amber-400 mx-auto mb-3" />
          <h2 className="text-sm font-medium text-foreground mb-1">Configuration Required</h2>
          <p className="text-xs text-zinc-400 mb-5">
            Supabase environment variables are missing.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-foreground transition"
          >
            <FiArrowLeft className="h-3.5 w-3.5" /> Return to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative z-10">
      <div className="w-full max-w-sm space-y-6">
        {/* Clean, Simple Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-zinc-900/50 text-zinc-400 mb-1">
            <FiLock className="h-4 w-4" />
          </div>
          <h1 className="text-lg sm:text-xl font-medium tracking-tight text-foreground">
            Personal Area
          </h1>
        </div>

        {/* Minimal Login Card */}
        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-5 sm:p-6 shadow-xl backdrop-blur-md">
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Email Field only if not configured via environment */}
            {needsEmailInput && (
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  autoComplete="email"
                  required
                  disabled={isLoading}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-foreground placeholder-zinc-500 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400/30 transition"
                />
              </div>
            )}

            {/* Masked Password input with submit arrow */}
            <div className="relative flex items-center">
              <input
                id="personal-area-password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete="current-password"
                autoFocus
                disabled={isLoading}
                className="w-full rounded-xl border border-white/10 bg-black/40 pl-3.5 pr-11 py-2.5 text-sm text-foreground placeholder-zinc-500 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400/30 transition"
              />
              <button
                type="submit"
                disabled={isLoading || !password}
                aria-label="Unlock"
                title="Unlock"
                className="absolute right-1.5 h-7 w-7 rounded-lg bg-foreground text-background hover:bg-zinc-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground transition disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center shrink-0"
              >
                {isLoading ? (
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-background border-t-transparent" />
                ) : (
                  <FiArrowRight className="h-3.5 w-3.5" />
                )}
              </button>
            </div>

            {/* Discreet Error Handling */}
            {errorMessage && (
              <p className="text-xs text-rose-400 text-center pt-1 animate-in fade-in">
                {errorMessage}
              </p>
            )}
          </form>

          {/* Discreet Footer link */}
          <div className="mt-5 pt-4 border-t border-white/5 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition"
            >
              <FiArrowLeft className="h-3 w-3" />
              <span>Return to Portfolio</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
