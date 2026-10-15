'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  FiCheck,
  FiTrash2,
  FiEdit2,
  FiX,
  FiPlus,
  FiAlertCircle,
  FiRefreshCw,
} from 'react-icons/fi';
import { type Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import { TodoItem } from '@/lib/todoTypes';

interface TodoViewProps {
  session?: Session | null;
  onTasksCountChange?: (remaining: number, total: number) => void;
}

export default function TodoView({ session, onTasksCountChange }: TodoViewProps) {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Drag and Reorder state
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dropInsertionIndex, setDropInsertionIndex] = useState<number | null>(null);

  const editInputRef = useRef<HTMLInputElement>(null);
  const todosRef = useRef<TodoItem[]>([]);
  todosRef.current = todos;

  const itemElementsRef = useRef<Map<string, HTMLElement>>(new Map());
  const dragSessionRef = useRef<{
    sourceId: string;
    sourceIndex: number;
    pointerId: number;
  } | null>(null);
  const dropInsertionIndexRef = useRef<number | null>(null);
  const isSavingOrderRef = useRef(false);

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

      // Verify that a valid authenticated Supabase user exists immediately before insertion
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

      // Calculate sort_order so new task appears at the top
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

      // If sort_order column does not exist yet, fallback to inserting without it
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

      setTodos((prev) => [insertRes.data as TodoItem, ...prev]);
      setInputText('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to add task.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle completion
  const handleToggleComplete = async (todo: TodoItem) => {
    if (!supabase) return;

    const nextCompleted = !todo.is_completed;
    // Optimistic update
    setTodos((prev) =>
      prev.map((t) => (t.id === todo.id ? { ...t, is_completed: nextCompleted } : t))
    );

    try {
      const { error } = await supabase
        .from('todo_items')
        .update({ is_completed: nextCompleted })
        .eq('id', todo.id);

      if (error) {
        // Rollback on failure
        setTodos((prev) =>
          prev.map((t) => (t.id === todo.id ? { ...t, is_completed: todo.is_completed } : t))
        );
        setErrorMessage(`Failed to update task [${error.code || 'ERROR'}]: ${error.message}`);
      }
    } catch {
      setTodos((prev) =>
        prev.map((t) => (t.id === todo.id ? { ...t, is_completed: todo.is_completed } : t))
      );
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
    setTodos((prev) => prev.filter((t) => t.id !== id));

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
      // Verify authenticated user session immediately before updating
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

      // Update only sort_order for modified rows, targeting both task ID and owner ID
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
      // Restore previous order on failure
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
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowUp' || (e.altKey && e.key === 'ArrowUp')) {
      e.preventDefault();
      if (index > 0) {
        reorderTasks(index, index - 1);
      }
    } else if (e.key === 'ArrowDown' || (e.altKey && e.key === 'ArrowDown')) {
      e.preventDefault();
      if (index < todos.length - 1) {
        reorderTasks(index, index + 1);
      }
    }
  };

  // Pointer drag handling for both desktop mouse and mobile touch
  const handlePointerDown = (
    e: React.PointerEvent<HTMLButtonElement>,
    todoId: string,
    index: number
  ) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    if (editingId) return;

    dragSessionRef.current = {
      sourceId: todoId,
      sourceIndex: index,
      pointerId: e.pointerId,
    };
    dropInsertionIndexRef.current = index;

    setDraggedId(todoId);
    setDropInsertionIndex(index);

    const onPointerMove = (moveEv: PointerEvent) => {
      if (!dragSessionRef.current) return;
      const clientY = moveEv.clientY;
      const currentTodos = todosRef.current;

      const rects: { index: number; mid: number }[] = [];
      currentTodos.forEach((t, i) => {
        const el = itemElementsRef.current.get(t.id);
        if (el) {
          const r = el.getBoundingClientRect();
          rects.push({ index: i, mid: (r.top + r.bottom) / 2 });
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
      const sourceIdx = session.sourceIndex;

      // If dropped in current slot, no move needed
      if (targetSlot === sourceIdx || targetSlot === sourceIdx + 1) return;

      const destIdx = sourceIdx < targetSlot ? targetSlot - 1 : targetSlot;
      if (destIdx !== sourceIdx) {
        reorderTasks(sourceIdx, destIdx);
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
    const sourceIdx = dragSessionRef.current?.sourceIndex;
    if (sourceIdx === slotIndex || sourceIdx === slotIndex - 1) return null;

    return (
      <div
        key={`drop-indicator-${slotIndex}`}
        className="px-3 py-1 -my-1 relative z-20 pointer-events-none transition-all duration-150 animate-in fade-in"
        aria-hidden="true"
      >
        <div className="h-0.5 w-full bg-zinc-200 dark:bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
      </div>
    );
  };

  const completedCount = todos.filter((t) => t.is_completed).length;
  const remainingCount = todos.length - completedCount;

  return (
    <div className="space-y-4 max-w-2xl mx-auto py-3 sm:py-5 animate-in fade-in duration-150">
      {/* Compact Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <h2 className="text-sm font-semibold tracking-wider text-foreground uppercase">
            TO-DO
          </h2>
          <span className="text-xs text-zinc-500 font-mono">
            {remainingCount} pending · {completedCount} done
          </span>
        </div>

        <button
          type="button"
          onClick={fetchTodos}
          disabled={isLoading}
          aria-label="Refresh tasks"
          title="Refresh"
          className="p-1.5 text-zinc-500 hover:text-zinc-200 transition rounded-lg disabled:opacity-40"
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

      {/* Clean Input Form */}
      <form onSubmit={handleAddTodo} className="flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Add a new task..."
          disabled={isSubmitting}
          maxLength={200}
          className="w-full rounded-xl border border-white/10 bg-zinc-900/40 px-3.5 py-2 text-sm text-foreground placeholder-zinc-500 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400/30 transition"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isSubmitting}
          aria-label="Add task"
          className="h-9 px-3.5 shrink-0 rounded-xl bg-foreground text-background hover:bg-zinc-200 transition disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 text-xs font-medium"
        >
          <FiPlus className="h-3.5 w-3.5" />
          <span>Add</span>
        </button>
      </form>

      {/* Tasks List Container */}
      <div className="rounded-xl border border-white/10 bg-zinc-950/40 overflow-hidden divide-y divide-white/5">
        {isLoading && todos.length === 0 ? (
          <div className="py-10 text-center text-xs text-zinc-500 font-normal">
            Loading tasks...
          </div>
        ) : todos.length === 0 ? (
          <div className="py-10 text-center text-xs text-zinc-500 font-normal">
            No tasks yet.
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {renderDropIndicator(0)}
            {todos.map((todo, index) => {
              const isEditing = editingId === todo.id;
              const isBeingDragged = draggedId === todo.id;

              return (
                <React.Fragment key={todo.id}>
                  <li
                    ref={(el) => {
                      if (el) itemElementsRef.current.set(todo.id, el);
                      else itemElementsRef.current.delete(todo.id);
                    }}
                    className={`group flex items-center justify-between gap-2 px-3 py-2.5 sm:px-4 sm:py-2.5 transition ${
                      isBeingDragged
                        ? 'opacity-35 bg-white/[0.04] ring-1 ring-white/10'
                        : 'hover:bg-white/[0.02]'
                    }`}
                  >
                    {/* Left: Drag Handle, Checkbox & Text */}
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {/* Accessible Drag Handle */}
                      <button
                        type="button"
                        aria-label={`Task "${todo.text}". Position ${index + 1} of ${todos.length}. Press Up or Down Arrow to change order.`}
                        title="Drag to reorder (or press Up/Down)"
                        onPointerDown={(e) => handlePointerDown(e, todo.id, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        className="p-1 -ml-1 text-zinc-600 hover:text-zinc-300 active:text-foreground cursor-grab active:cursor-grabbing touch-none select-none rounded-lg focus:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 transition shrink-0"
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

                      {/* Checkbox */}
                      <button
                        type="button"
                        onClick={() => handleToggleComplete(todo)}
                        aria-label={
                          todo.is_completed
                            ? `Mark "${todo.text}" incomplete`
                            : `Mark "${todo.text}" complete`
                        }
                        className={`h-4 w-4 rounded border flex items-center justify-center shrink-0 transition ${
                          todo.is_completed
                            ? 'bg-zinc-200 border-zinc-200 text-zinc-950'
                            : 'border-white/20 bg-transparent hover:border-white/40'
                        }`}
                      >
                        {todo.is_completed && <FiCheck className="h-3 w-3 stroke-[3]" />}
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
                        <span
                          onClick={() => handleToggleComplete(todo)}
                          className={`text-xs sm:text-sm leading-snug cursor-pointer select-none break-words min-w-0 flex-1 transition ${
                            todo.is_completed
                              ? 'text-zinc-500 line-through'
                              : 'text-zinc-200'
                          }`}
                        >
                          {todo.text}
                        </span>
                      )}
                    </div>

                    {/* Right: Actions */}
                    {!isEditing && (
                      <div className="flex items-center gap-0.5 shrink-0 opacity-70 group-hover:opacity-100 transition">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(todo)}
                          aria-label={`Edit "${todo.text}"`}
                          title="Edit"
                          className="p-1 text-zinc-500 hover:text-zinc-300 transition rounded-md"
                        >
                          <FiEdit2 className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(todo.id)}
                          aria-label={`Delete "${todo.text}"`}
                          title="Delete"
                          className="p-1 text-zinc-500 hover:text-rose-400 transition rounded-md"
                        >
                          <FiTrash2 className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </li>
                  {renderDropIndicator(index + 1)}
                </React.Fragment>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
