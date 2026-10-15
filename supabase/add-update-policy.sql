-- Migration: Allow authenticated users to edit their own transactions
-- Grant UPDATE access only to editable columns: type, title, amount, transaction_date

DROP POLICY IF EXISTS "Authenticated users can update their own transactions" ON public.transactions;

CREATE POLICY "Authenticated users can update their own transactions"
ON public.transactions
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

GRANT UPDATE (type, title, amount, transaction_date) ON public.transactions TO authenticated;
