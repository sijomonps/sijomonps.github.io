-- Fix for missing SELECT, UPDATE, and DELETE policies on public.todo_items
-- Run this in your Supabase Dashboard SQL Editor

-- 1. Ensure table grants for authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.todo_items TO authenticated;

-- 2. Add the missing SELECT policy (required for .select() on insert and listing tasks)
DROP POLICY IF EXISTS "Users can view own todo items" ON public.todo_items;
CREATE POLICY "Users can view own todo items"
ON public.todo_items
FOR SELECT
TO authenticated
USING ((SELECT auth.uid() AS uid) = user_id);

-- 3. Add the missing UPDATE policy (required for toggling complete and inline edits)
DROP POLICY IF EXISTS "Users can update own todo items" ON public.todo_items;
CREATE POLICY "Users can update own todo items"
ON public.todo_items
FOR UPDATE
TO authenticated
USING ((SELECT auth.uid() AS uid) = user_id)
WITH CHECK ((SELECT auth.uid() AS uid) = user_id);

-- 4. Add the missing DELETE policy (required for deleting tasks)
DROP POLICY IF EXISTS "Users can delete own todo items" ON public.todo_items;
CREATE POLICY "Users can delete own todo items"
ON public.todo_items
FOR DELETE
TO authenticated
USING ((SELECT auth.uid() AS uid) = user_id);

-- 5. Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
