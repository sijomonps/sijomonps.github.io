-- Migration: Add sort_order column and reorder permissions to public.todo_items
-- Run this script in your Supabase Dashboard SQL Editor (SQL Editor -> New Query -> Run)

-- 1. Add sort_order column to todo_items if it doesn't already exist
ALTER TABLE public.todo_items
ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- 2. Populate sort_order for existing tasks based on their creation time (newest tasks first)
WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) - 1 AS initial_order
  FROM public.todo_items
)
UPDATE public.todo_items t
SET sort_order = ranked.initial_order
FROM ranked
WHERE t.id = ranked.id AND (t.sort_order IS NULL OR t.sort_order = 0);

-- 3. Set NOT NULL constraint with DEFAULT 0
ALTER TABLE public.todo_items
ALTER COLUMN sort_order SET DEFAULT 0;

UPDATE public.todo_items
SET sort_order = 0
WHERE sort_order IS NULL;

ALTER TABLE public.todo_items
ALTER COLUMN sort_order SET NOT NULL;

-- 4. Create an index to optimize ordering queries by user and sort_order
CREATE INDEX IF NOT EXISTS idx_todo_items_user_sort_order
ON public.todo_items (user_id, sort_order ASC);

-- 5. Security & Grants: Allow authenticated users to update sort_order alongside text and is_completed
GRANT SELECT, INSERT, DELETE ON TABLE public.todo_items TO authenticated;
GRANT UPDATE (text, is_completed, sort_order) ON TABLE public.todo_items TO authenticated;

-- 6. Ensure the owner-restricted UPDATE policy covers sort_order updates
DROP POLICY IF EXISTS "Users can update own todo items" ON public.todo_items;
CREATE POLICY "Users can update own todo items"
ON public.todo_items
FOR UPDATE
TO authenticated
USING ((SELECT auth.uid() AS uid) = user_id)
WITH CHECK ((SELECT auth.uid() AS uid) = user_id);

-- 7. Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
