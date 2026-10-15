-- Schema for Personal Finance Dashboard
-- Table: transactions

CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    title TEXT NOT NULL CHECK (char_length(trim(title)) > 0),
    amount NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
    transaction_date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast querying transactions filtered by user and sorted by date
CREATE INDEX IF NOT EXISTS idx_transactions_user_date 
ON public.transactions (user_id, transaction_date DESC, created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running script
DROP POLICY IF EXISTS "Authenticated users can select their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Authenticated users can insert their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Authenticated users can update their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Authenticated users can delete their own transactions" ON public.transactions;

-- RLS Policies: enforce user ownership
-- 1. Select: Only authenticated users can read their own records
CREATE POLICY "Authenticated users can select their own transactions"
ON public.transactions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 2. Insert: Only authenticated users can insert records belonging to themselves
CREATE POLICY "Authenticated users can insert their own transactions"
ON public.transactions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 3. Update: Only authenticated users can update their own records
CREATE POLICY "Authenticated users can update their own transactions"
ON public.transactions
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 4. Delete: Only authenticated users can delete their own records
CREATE POLICY "Authenticated users can delete their own transactions"
ON public.transactions
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Revoke permissions from anonymous users and grant required permissions to authenticated users
REVOKE ALL ON public.transactions FROM anon;
REVOKE ALL ON public.transactions FROM public;
GRANT SELECT, INSERT, DELETE ON public.transactions TO authenticated;
GRANT UPDATE (type, title, amount, transaction_date) ON public.transactions TO authenticated;
