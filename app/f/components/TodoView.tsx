'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  FiTrash2,
  FiEdit2,
  FiX,
  FiPlus,
  FiAlertCircle,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiCheck,
  FiCalendar,
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { type Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import { TodoItem } from '@/lib/todoTypes';

interface TodoViewProps {
  session?: Session | null;
  onTasksCountChange?: (remaining: number, total: number) => void;
}

const PAGE_SIZE = 15;

function formatCreatedDate(dateStr?: string | null): string | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;

  const day = d.getDate().toString().padStart(2, '0');
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

/**
 * Reorders tasks when toggling completion status:
 * - Marked completed: placed at the end of the active list, on top of previously marked tasks.
 * - Unmarked: returns to the active list, placed right above the marked tasks.
 */
function reorderOnToggle(
  currentTodos: TodoItem[],
  todoId: string,
  nextCompleted: boolean
): TodoItem[] {
  const currentTodo = currentTodos.find((t) => t.id === todoId);
  if (!currentTodo) return currentTodos;

  const updatedTodo = { ...currentTodo, is_completed: nextCompleted };
  const activeTodos = currentTodos.filter((t) => t.id !== todoId && !t.is_completed);
  const completedTodos = currentTodos.filter((t) => t.id !== todoId && t.is_completed);

  if (nextCompleted) {
    // Put at the end of the active list, on top of the marked tasks
    return [...activeTodos, updatedTodo, ...completedTodos];
  } else {
    // Return to the active section, right before completed tasks
    return [...activeTodos, updatedTodo, ...completedTodos];
  }
}

export default function TodoView({ session, onTasksCountChange }: TodoViewProps) {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Drag and Reorder state (local slot indices on current page)
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dropInsertionIndex, setDropInsertionIndex] = useState<number | null>(null);

  const editInputRef = useRef<HTMLInputElement>(null);
  const todosRef = useRef<TodoItem[]>([]);
  todosRef.current = todos;

  const currentPageRef = useRef(currentPage);
  currentPageRef.current = currentPage;

  const itemElementsRef = useRef<Map<string, HTMLElement>>(new Map());
  const dragSessionRef = useRef<{
    sourceId: string;
    sourceLocalIndex: number;
    sourceGlobalIndex: number;
    pointerId: number;
  } | null>(null);
  const dropInsertionIndexRef = useRef<number | null>(null);
  const isSavingOrderRef = useRef(false);

  // Pagination metrics (at least 15 tasks per page)
  const totalItems = todos.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, totalItems);
  const paginatedTodos = todos.slice(startIndex, endIndex);

  // Keep current page valid if todos length decreases (e.g., on task deletion)
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(todos.length / PAGE_SIZE));
    if (currentPage > maxPage) {
      setCurrentPage(maxPage);
    }
  }, [todos.length, currentPage]);

  // Fetch todos from Supabase (ordered by sort_order ASC, then created_at DESC)
  const fetchTodos = useCallback(async () => {
    if (!supabase) return;

    try {
      setIsLoading(true);
      setErrorMessage(null);

      // Attempt to query ordered by sort_order ASC, then created_at DESC
      let { data, error } = await supabase
        .from('todo_items')
        .select('*')
        .order('sort_order', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: false });

      // Fallback if sort_order column does not exist yet in live Supabase
      if (
        error &&
        (error.code === '42703' ||
          error.code === 'PGRST204' ||
          error.message?.includes('sort_order'))
      ) {
        const fallbackRes = await supabase
          .from('todo_items')
          .select('*')
          .order('created_at', { ascending: false });
        data = fallbackRes.data;
        error = fallbackRes.error;
      }

      if (error) {
        setErrorMessage(error.message || 'Failed to load tasks.');
      } else {
        const items = (data as TodoItem[]) || [];
        setTodos(items);
      }
    } catch {
      setErrorMessage('Could not load tasks. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // Optional notification for parent
  useEffect(() => {
    const remaining = todos.filter((t) => !t.is_completed).length;
    onTasksCountChange?.(remaining, todos.length);
  }, [todos, onTasksCountChange]);

  // Auto focus on edit input
  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  // Add new task
  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed || isSubmitting) return;

    if (!supabase) {
      setErrorMessage('Database connection unavailable.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      // Verify authenticated Supabase user immediately before insertion
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      const authenticatedUser = user || session?.user;

      if (userError || !authenticatedUser || !authenticatedUser.id) {
        setErrorMessage(
          `Session error: ${userError?.message || 'No authenticated user session found.'} Please sign in again.`
        );
        return;
      }

      const ownerId = authenticatedUser.id;

      // Calculate sort_order so new task appears at the top of active tasks
      const minOrder =
        todos.length > 0
          ? Math.min(...todos.map((t) => (typeof t.sort_order === 'number' ? t.sort_order : 0)))
          : 0;
      const newSortOrder = minOrder - 1;

      // Attempt insert with sort_order
      let insertRes = await supabase
        .from('todo_items')
        .insert({
          user_id: ownerId,
          text: trimmed,
          is_completed: false,
          sort_order: newSortOrder,
        })
        .select()
        .single();

      // Fallback if sort_order column does not exist yet
      const isMissingSortOrder =
        insertRes.error &&
        (insertRes.error.code === 'PGRST204' ||
          insertRes.error.code === '42703' ||
          insertRes.error.message?.includes('sort_order'));

      if (isMissingSortOrder) {
        insertRes = await supabase
          .from('todo_items')
          .insert({
            user_id: ownerId,
            text: trimmed,
            is_completed: false,
          })
          .select()
          .single();
      }

      if (insertRes.error) {
        const hintText = insertRes.error.hint ? ` (${insertRes.error.hint})` : '';
        const diagnosis = `[User authenticated: YES, Owner ID matched: YES]`;
        setErrorMessage(
          `Failed to add task [${insertRes.error.code || 'ERROR'}]: ${insertRes.error.message}${hintText} ${diagnosis}`
        );
        return;
      }

      if (!insertRes.data) {
        setErrorMessage('Failed to add task: No data returned from database.');
        return;
      }

      // Add to list, clear input, and jump to page 1 to immediately see the new task
      setTodos((prev) => [insertRes.data as TodoItem, ...prev]);
      setInputText('');
      setCurrentPage(1);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to add task.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle completion: when marked, smoothly moves to the end of the active list on top of marked tasks
  const handleToggleComplete = async (todo: TodoItem) => {
    if (!supabase) return;

    const nextCompleted = !todo.is_completed;
    const previousTodos = [...todos];
    const newTodos = reorderOnToggle(todos, todo.id, nextCompleted);

    // Optimistic update
    setTodos(newTodos);

    try {
      const { error } = await supabase
        .from('todo_items')
        .update({ is_completed: nextCompleted })
        .eq('id', todo.id);

      if (error) {
        // Rollback on failure
        setTodos(previousTodos);
        setErrorMessage(`Failed to update task [${error.code || 'ERROR'}]: ${error.message}`);
        return;
      }

      // Persist reordered sort positions permanently to database
      await persistOrder(newTodos, previousTodos);
    } catch {
      setTodos(previousTodos);
      setErrorMessage('Network error while updating task.');
    }
  };

  // Start editing
  const handleStartEdit = (todo: TodoItem) => {
    setEditingId(todo.id);
    setEditingText(todo.text);
    setErrorMessage(null);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  // Save edited task
  const handleSaveEdit = async (todo: TodoItem) => {
    const trimmed = editingText.trim();
    if (!trimmed) {
      setErrorMessage('Task cannot be empty.');
      return;
    }
    if (trimmed === todo.text) {
      handleCancelEdit();
      return;
    }
    if (!supabase) return;

    try {
      setIsUpdating(true);
      setErrorMessage(null);

      const { error } = await supabase
        .from('todo_items')
        .update({ text: trimmed })
        .eq('id', todo.id);

      if (error) {
        setErrorMessage(`Failed to save changes [${error.code || 'ERROR'}]: ${error.message}`);
      } else {
        setTodos((prev) =>
          prev.map((t) => (t.id === todo.id ? { ...t, text: trimmed } : t))
        );
        handleCancelEdit();
      }
    } catch {
      setErrorMessage('Failed to save changes.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete task
  const handleDelete = async (id: string) => {
    if (!supabase) return;

    const previousTodos = todos;
    const remainingTodos = todos.filter((t) => t.id !== id);
    setTodos(remainingTodos);

    // Adjust page if current page exceeds new total pages
    const newTotalPages = Math.max(1, Math.ceil(remainingTodos.length / PAGE_SIZE));
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages);
    }

    try {
      const { error } = await supabase.from('todo_items').delete().eq('id', id);

      if (error) {
        setTodos(previousTodos);
        setErrorMessage(`Failed to delete task [${error.code || 'ERROR'}]: ${error.message}`);
      }
    } catch {
      setTodos(previousTodos);
      setErrorMessage('Failed to delete task.');
    }
  };

  // Persist reordered tasks permanently to Supabase
  const persistOrder = async (reordered: TodoItem[], fallback: TodoItem[]) => {
    const client = supabase;
    if (!client) return;

    // Check which items need their sort_order updated
    const updates: { id: string; sort_order: number }[] = [];
    const normalized = reordered.map((item, idx) => {
      if (item.sort_order !== idx) {
        updates.push({ id: item.id, sort_order: idx });
        return { ...item, sort_order: idx };
      }
      return item;
    });

    if (updates.length === 0) return;

    // Guard against simultaneous conflicting saves
    if (isSavingOrderRef.current) return;
    isSavingOrderRef.current = true;

    try {
      const {
        data: { user },
        error: userError,
      } = await client.auth.getUser();

      const authenticatedUser = user || session?.user;
      if (userError || !authenticatedUser || !authenticatedUser.id) {
        setTodos(fallback);
        setErrorMessage(
          `Session error: ${userError?.message || 'No authenticated user session found.'} Please sign in again.`
        );
        return;
      }

      const ownerId = authenticatedUser.id;

      // Optimistically update normalized sort_orders in state
      setTodos(normalized);

      // Update sort_order for modified rows, targeting both task ID and owner ID
      const results = await Promise.all(
        updates.map(({ id, sort_order }) =>
          client
            .from('todo_items')
            .update({ sort_order })
            .eq('id', id)
            .eq('user_id', ownerId)
        )
      );

      const failure = results.find((r) => r.error);
      if (failure && failure.error) {
        const postgrestErr = failure.error;
        const code = postgrestErr.code || 'UNKNOWN';
        const message = postgrestErr.message || 'Database update failed';
        const details =
          postgrestErr.details &&
          typeof postgrestErr.details === 'string' &&
          postgrestErr.details.trim().length > 0
            ? ` (${postgrestErr.details.trim()})`
            : '';

        if (code === 'PGRST204' || code === '42703' || message.includes('sort_order')) {
          setErrorMessage(
            `Database column "sort_order" does not exist in Supabase [${code}]: ${message}. Please run the SQL migration to enable persistent reordering.`
          );
        } else if (
          code === '42501' ||
          message.toLowerCase().includes('permission denied') ||
          message.toLowerCase().includes('row-level security')
        ) {
          setErrorMessage(
            `Database permission error [${code}]: ${message}${details}. UPDATE grant required on "sort_order". Please run the SQL migration.`
          );
        } else {
          setErrorMessage(
            `Failed to save task order [${code}]: ${message}${details}. Restored previous order.`
          );
        }
        setTodos(fallback);
        return;
      }
    } catch (err: unknown) {
      setTodos(fallback);
      const postgrestErr = err as { code?: string; message?: string; details?: string | null };
      const code = postgrestErr?.code ? ` [${postgrestErr.code}]` : '';
      const msg =
        postgrestErr?.message ||
        (err instanceof Error ? err.message : String(err) || 'Database update failed');
      const details =
        postgrestErr?.details &&
        typeof postgrestErr.details === 'string' &&
        postgrestErr.details.trim().length > 0
          ? ` (${postgrestErr.details.trim()})`
          : '';
      setErrorMessage(`Failed to save task order${code}: ${msg}${details}. Restored previous order.`);
    } finally {
      isSavingOrderRef.current = false;
    }
  };

  // Reorder tasks in list (used by both drag-and-drop and keyboard shortcuts)
  const reorderTasks = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return;
    if (fromIndex >= todos.length || toIndex >= todos.length) return;

    const previousTodos = [...todos];
    const newTodos = [...todos];
    const [movedItem] = newTodos.splice(fromIndex, 1);
    newTodos.splice(toIndex, 0, movedItem);

    setTodos(newTodos);
    persistOrder(newTodos, previousTodos);
  };

  // Keyboard accessibility for reordering
  const handleKeyDown = (e: React.KeyboardEvent, localIndex: number) => {
    const startIdx = (currentPage - 1) * PAGE_SIZE;
    const globalIndex = startIdx + localIndex;

    if (e.key === 'ArrowUp' || (e.altKey && e.key === 'ArrowUp')) {
      e.preventDefault();
      if (globalIndex > 0) {
        reorderTasks(globalIndex, globalIndex - 1);
        if (localIndex === 0 && currentPage > 1) {
          setCurrentPage((p) => p - 1);
        }
      }
    } else if (e.key === 'ArrowDown' || (e.altKey && e.key === 'ArrowDown')) {
      e.preventDefault();
      if (globalIndex < todos.length - 1) {
        reorderTasks(globalIndex, globalIndex + 1);
        if (localIndex === paginatedTodos.length - 1 && currentPage < totalPages) {
          setCurrentPage((p) => p + 1);
        }
      }
    }
  };

  // Pointer drag handling for both desktop mouse and mobile touch
  const handlePointerDown = (
    e: React.PointerEvent<HTMLButtonElement>,
    todoId: string,
    localIndex: number
  ) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    if (editingId) return;

    const currentStartIndex = (currentPageRef.current - 1) * PAGE_SIZE;
    const globalIndex = currentStartIndex + localIndex;

    dragSessionRef.current = {
      sourceId: todoId,
      sourceLocalIndex: localIndex,
      sourceGlobalIndex: globalIndex,
      pointerId: e.pointerId,
    };
    dropInsertionIndexRef.current = localIndex;

    setDraggedId(todoId);
    setDropInsertionIndex(localIndex);

    const onPointerMove = (moveEv: PointerEvent) => {
      if (!dragSessionRef.current) return;
      const clientY = moveEv.clientY;
      const startIdx = (currentPageRef.current - 1) * PAGE_SIZE;
      const visibleTodos = todosRef.current.slice(startIdx, startIdx + PAGE_SIZE);

      const rects: { localIndex: number; mid: number }[] = [];
      visibleTodos.forEach((t, i) => {
        const el = itemElementsRef.current.get(t.id);
        if (el) {
          const r = el.getBoundingClientRect();
          rects.push({ localIndex: i, mid: (r.top + r.bottom) / 2 });
        }
      });

      if (rects.length === 0) return;

      let targetSlot = 0;
      if (clientY < rects[0].mid) {
        targetSlot = 0;
      } else if (clientY >= rects[rects.length - 1].mid) {
        targetSlot = rects.length;
      } else {
        for (let i = 0; i < rects.length - 1; i++) {
          if (clientY >= rects[i].mid && clientY < rects[i + 1].mid) {
            targetSlot = i + 1;
            break;
          }
        }
      }

      dropInsertionIndexRef.current = targetSlot;
      setDropInsertionIndex(targetSlot);
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerCancel);

      const session = dragSessionRef.current;
      const targetSlot = dropInsertionIndexRef.current;

      dragSessionRef.current = null;
      dropInsertionIndexRef.current = null;
      setDraggedId(null);
      setDropInsertionIndex(null);

      if (!session || targetSlot === null) return;
      const sourceLocal = session.sourceLocalIndex;

      // If dropped in current slot, no move needed
      if (targetSlot === sourceLocal || targetSlot === sourceLocal + 1) return;

      const destLocal = sourceLocal < targetSlot ? targetSlot - 1 : targetSlot;
      const startIdx = (currentPageRef.current - 1) * PAGE_SIZE;
      const globalSource = session.sourceGlobalIndex;
      const globalDest = startIdx + destLocal;

      if (globalSource !== globalDest) {
        reorderTasks(globalSource, globalDest);
      }
    };

    const onPointerCancel = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerCancel);

      dragSessionRef.current = null;
      dropInsertionIndexRef.current = null;
      setDraggedId(null);
      setDropInsertionIndex(null);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerCancel);
  };

  // Helper to render drop indicator line at slot
  const renderDropIndicator = (slotIndex: number) => {
    if (dropInsertionIndex !== slotIndex) return null;
    const sourceLocal = dragSessionRef.current?.sourceLocalIndex;
    if (sourceLocal === slotIndex || sourceLocal === slotIndex - 1) return null;

    return (
      <div
        key={`drop-indicator-${slotIndex}`}
        className="px-3 py-1 -my-1 relative z-20 pointer-events-none transition-all duration-150 animate-in fade-in"
        aria-hidden="true"
      >
        <div className="h-0.5 w-full bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
      </div>
    );
  };

  const completedCount = todos.filter((t) => t.is_completed).length;
  const remainingCount = todos.length - completedCount;

  return (
    <div className="space-y-4 max-w-2xl mx-auto py-4 sm:py-6 animate-in fade-in duration-200">
      {/* Refined Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
            <h2 className="text-sm font-semibold tracking-wider text-zinc-100 uppercase font-display">
              Tasks
            </h2>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-zinc-400">
              {remainingCount} pending
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchTodos}
          disabled={isLoading}
          aria-label="Refresh tasks"
          title="Refresh tasks"
          className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.06] transition-all rounded-lg disabled:opacity-40"
        >
          <FiRefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Discreet Error Alert */}
      {errorMessage && (
        <div className="flex items-start justify-between gap-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3.5 py-2.5 text-xs text-rose-300">
          <div className="flex items-start gap-2 min-w-0">
            <FiAlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-rose-400" />
            <span className="leading-snug break-words">{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-rose-400 hover:text-rose-200 shrink-0"
            aria-label="Dismiss"
          >
            <FiX className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Command-Style Input Form */}
      <form onSubmit={handleAddTodo} className="relative flex items-center gap-2">
        <div className="relative flex-1 group">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Add a new task..."
            disabled={isSubmitting}
            maxLength={200}
            className="w-full rounded-xl border border-white/[0.08] bg-zinc-900/60 backdrop-blur-md pl-3.5 pr-12 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 shadow-inner focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all duration-200"
          />
          {inputText.trim() && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-zinc-500 uppercase tracking-wider hidden sm:inline-block pointer-events-none">
              ↵ Enter
            </span>
          )}
        </div>
        <button
          type="submit"
          disabled={!inputText.trim() || isSubmitting}
          aria-label="Add task"
          className="h-10 px-4 shrink-0 rounded-xl bg-zinc-100 text-zinc-950 hover:bg-white font-medium shadow-[0_2px_10px_rgba(255,255,255,0.08)] hover:shadow-[0_4px_16px_rgba(255,255,255,0.18)] transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-1.5 text-xs"
        >
          <FiPlus className="h-4 w-4" />
          <span>Add</span>
        </button>
      </form>

      {/* Tasks List Card Container */}
      <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/60 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden divide-y divide-white/[0.05]">
        {isLoading && todos.length === 0 ? (
          <div className="py-14 text-center">
            <div className="inline-block h-5 w-5 border-2 border-zinc-600 border-t-zinc-200 rounded-full animate-spin mb-2" />
            <p className="text-xs text-zinc-500 font-mono">Loading tasks...</p>
          </div>
        ) : todos.length === 0 ? (
          <div className="py-14 text-center px-4">
            <div className="mx-auto w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-zinc-400 mb-3">
              <FiCheck className="w-5 h-5 text-zinc-400" />
            </div>
            <p className="text-xs font-medium text-zinc-300">All clear — no tasks yet</p>
            <p className="text-[11px] text-zinc-500 mt-1">Add a task above to plan your day</p>
          </div>
        ) : (
          <>
            <ul className="divide-y divide-white/[0.05]">
              {renderDropIndicator(0)}
              {paginatedTodos.map((todo, localIndex) => {
                const isEditing = editingId === todo.id;
                const isBeingDragged = draggedId === todo.id;
                const formattedDate = formatCreatedDate(todo.created_at);
                const globalIndex = startIndex + localIndex;

                // Detect transition between active and completed tasks
                const isFirstCompletedOnPage =
                  todo.is_completed &&
                  (localIndex === 0
                    ? startIndex === 0 || !todos[startIndex - 1]?.is_completed
                    : !paginatedTodos[localIndex - 1]?.is_completed);

                return (
                  <React.Fragment key={todo.id}>
                    {isFirstCompletedOnPage && (
                      <li
                        key="completed-section-divider"
                        className="list-none flex items-center gap-2.5 px-4 py-2 bg-white/[0.015] border-y border-white/[0.04] pointer-events-none select-none"
                      >
                        <span className="flex items-center gap-1.5 text-[10px] font-mono tracking-wider text-zinc-500 uppercase">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/80" />
                          Completed
                        </span>
                        <div className="h-px flex-1 bg-white/[0.04]" />
                        <span className="text-[10px] font-mono text-zinc-500">
                          {completedCount}
                        </span>
                      </li>
                    )}

                    <motion.li
                      layout={draggedId ? false : 'position'}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 30,
                      }}
                      ref={(el) => {
                        if (el) itemElementsRef.current.set(todo.id, el);
                        else itemElementsRef.current.delete(todo.id);
                      }}
                      className={`group flex items-center justify-between gap-3 px-3.5 py-3 sm:px-4 sm:py-3 transition-colors duration-150 ${
                        isBeingDragged
                          ? 'opacity-40 bg-white/[0.04] ring-1 ring-white/10'
                          : 'hover:bg-white/[0.025]'
                      }`}
                    >
                      {/* Left: Drag Handle, Checkbox & Content */}
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                        {/* Accessible Drag Handle */}
                        <button
                          type="button"
                          aria-label={`Task "${todo.text}". Position ${globalIndex + 1} of ${todos.length}. Press Up or Down Arrow to change order.`}
                          title="Drag to reorder (or press Up/Down)"
                          onPointerDown={(e) => handlePointerDown(e, todo.id, localIndex)}
                          onKeyDown={(e) => handleKeyDown(e, localIndex)}
                          className="p-1 -ml-1 text-zinc-700 group-hover:text-zinc-400 hover:!text-zinc-200 active:text-foreground cursor-grab active:cursor-grabbing touch-none select-none rounded-lg focus:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 transition-colors shrink-0"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <circle cx="5" cy="3.5" r="1.5" />
                            <circle cx="11" cy="3.5" r="1.5" />
                            <circle cx="5" cy="8" r="1.5" />
                            <circle cx="11" cy="8" r="1.5" />
                            <circle cx="5" cy="12.5" r="1.5" />
                            <circle cx="11" cy="12.5" r="1.5" />
                          </svg>
                        </button>

                        {/* Animated Custom Checkbox */}
                        <button
                          type="button"
                          onClick={() => handleToggleComplete(todo)}
                          aria-label={
                            todo.is_completed
                              ? `Mark "${todo.text}" incomplete`
                              : `Mark "${todo.text}" complete`
                          }
                          className={`relative h-[18px] w-[18px] rounded-[6px] border flex items-center justify-center shrink-0 transition-all duration-200 ${
                            todo.is_completed
                              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.25)]'
                              : 'border-white/20 bg-zinc-900/60 hover:border-zinc-400 hover:bg-zinc-800/60'
                          }`}
                        >
                          <AnimatePresence>
                            {todo.is_completed && (
                              <motion.svg
                                initial={{ scale: 0.4, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.4, opacity: 0 }}
                                transition={{ duration: 0.15, ease: 'easeOut' }}
                                className="h-3 w-3 stroke-[3]"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </motion.svg>
                            )}
                          </AnimatePresence>
                        </button>

                        {/* Text or Inline Edit Input */}
                        {isEditing ? (
                          <div className="flex items-center gap-1.5 min-w-0 flex-1">
                            <input
                              ref={editInputRef}
                              type="text"
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleSaveEdit(todo);
                                } else if (e.key === 'Escape') {
                                  handleCancelEdit();
                                }
                              }}
                              disabled={isUpdating}
                              maxLength={200}
                              className="w-full rounded-lg border border-white/20 bg-black/60 px-2.5 py-1 text-xs sm:text-sm text-foreground focus:outline-none focus:border-zinc-400"
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveEdit(todo)}
                              disabled={isUpdating || !editingText.trim()}
                              aria-label="Save"
                              className="p-1 text-emerald-400 hover:text-emerald-300"
                            >
                              <FiCheck className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={handleCancelEdit}
                              disabled={isUpdating}
                              aria-label="Cancel"
                              className="p-1 text-zinc-500 hover:text-zinc-300"
                            >
                              <FiX className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col min-w-0 flex-1 py-0.5">
                            <span
                              onClick={() => handleToggleComplete(todo)}
                              className={`text-xs sm:text-sm leading-snug cursor-pointer select-none break-words transition-all duration-200 ${
                                todo.is_completed
                                  ? 'text-zinc-500 line-through decoration-zinc-600/70'
                                  : 'text-zinc-200 hover:text-white'
                              }`}
                            >
                              {todo.text}
                            </span>
                            {formattedDate && (
                              <span
                                className={`inline-flex items-center gap-1.5 text-[11px] font-mono tracking-tight mt-0.5 select-none transition-colors duration-200 ${
                                  todo.is_completed ? 'text-zinc-600' : 'text-zinc-500'
                                }`}
                              >
                                <FiCalendar className="w-2.5 h-2.5 opacity-60" />
                                {formattedDate}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Right: Hover Action Buttons */}
                      {!isEditing && (
                        <div className="flex items-center gap-1 shrink-0 sm:opacity-0 sm:group-hover:opacity-100 opacity-70 transition-opacity duration-150">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(todo)}
                            aria-label={`Edit "${todo.text}"`}
                            title="Edit"
                            className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.08] transition-all rounded-lg"
                          >
                            <FiEdit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(todo.id)}
                            aria-label={`Delete "${todo.text}"`}
                            title="Delete"
                            className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all rounded-lg"
                          >
                            <FiTrash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </motion.li>
                    {renderDropIndicator(localIndex + 1)}
                  </React.Fragment>
                );
              })}
            </ul>

            {/* Pagination Controls Footer (15 per page) */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.06] bg-white/[0.01] text-xs">
                <span className="text-[11px] sm:text-xs text-zinc-500 font-mono">
                  Showing {startIndex + 1}–{endIndex} of {totalItems}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] sm:text-xs text-zinc-400 font-mono">
                    {currentPage} / {totalPages}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage <= 1}
                      aria-label="Previous page"
                      title="Previous page"
                      className="h-7 w-7 flex items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/20 text-zinc-400 hover:text-white disabled:opacity-25 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all"
                    >
                      <FiChevronLeft className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage >= totalPages}
                      aria-label="Next page"
                      title="Next page"
                      className="h-7 w-7 flex items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/20 text-zinc-400 hover:text-white disabled:opacity-25 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all"
                    >
                      <FiChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
