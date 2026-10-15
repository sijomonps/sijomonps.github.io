-- Complete Schema & Policies for public.todo_items

CREATE TABLE IF NOT EXISTS public.todo_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL DEFAULT auth.uid()
        REFERENCES auth.users(id) ON DELETE CASCADE,
    text TEXT NOT NULL CHECK (length(trim(text)) > 0),
    is_completed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.todo_items ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.todo_items FROM anon, public;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.todo_items TO authenticated;

-- Policies for Authenticated Users (Owner-enforced)
DROP POLICY IF EXISTS "Users can view own todo items" ON public.todo_items;
CREATE POLICY "Users can view own todo items"
ON public.todo_items
FOR SELECT
TO authenticated
USING ((SELECT auth.uid() AS uid) = user_id);

DROP POLICY IF EXISTS "Users can insert own todo items" ON public.todo_items;
CREATE POLICY "Users can insert own todo items"
ON public.todo_items
FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid() AS uid) = user_id);

DROP POLICY IF EXISTS "Users can update own todo items" ON public.todo_items;
CREATE POLICY "Users can update own todo items"
ON public.todo_items
FOR UPDATE
TO authenticated
USING ((SELECT auth.uid() AS uid) = user_id)
WITH CHECK ((SELECT auth.uid() AS uid) = user_id);

DROP POLICY IF EXISTS "Users can delete own todo items" ON public.todo_items;
CREATE POLICY "Users can delete own todo items"
ON public.todo_items
FOR DELETE
TO authenticated
USING ((SELECT auth.uid() AS uid) = user_id);

CREATE INDEX IF NOT EXISTS idx_todo_items_user_created
ON public.todo_items (user_id, created_at DESC);

NOTIFY pgrst, 'reload schema';
