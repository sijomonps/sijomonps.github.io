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

  const editInputRef = useRef<HTMLInputElement>(null);

  // Fetch todos from Supabase
  const fetchTodos = useCallback(async () => {
    if (!supabase) return;

    try {
      setIsLoading(true);
      setErrorMessage(null);

      const { data, error } = await supabase
        .from('todo_items')
        .select('*')
        .order('created_at', { ascending: false });

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

      if (userError || !authenticatedUser) {
        setErrorMessage('No active authenticated session found. Please sign in again.');
        return;
      }

      // Omit user_id from the insert payload so the database derives ownership from default auth.uid()
      const { data, error } = await supabase
        .from('todo_items')
        .insert({
          text: trimmed,
          is_completed: false,
        })
        .select()
        .single();

      if (error) {
        const hintText = error.hint ? ` (${error.hint})` : '';
        setErrorMessage(
          `Failed to add task [${error.code || 'ERROR'}]: ${error.message}${hintText}`
        );
        return;
      }

      if (!data) {
        setErrorMessage('Failed to add task: No data returned from database.');
        return;
      }

      setTodos((prev) => [data as TodoItem, ...prev]);
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

  const completedCount = todos.filter((t) => t.is_completed).length;
  const remainingCount = todos.length - completedCount;

  return (
    <div className="space-y-5 max-w-2xl mx-auto py-4 sm:py-6 animate-in fade-in duration-150">
      {/* Minimal Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <h2 className="text-base sm:text-lg font-medium text-foreground tracking-tight">
            To-do
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
            className="text-rose-400 hover:text-rose-200"
            aria-label="Dismiss"
          >
            <FiX className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Clean Input Form */}
      <form onSubmit={handleAddTodo} className="relative flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="New task..."
          disabled={isSubmitting}
          maxLength={200}
          className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-3.5 py-2.5 text-sm text-foreground placeholder-zinc-500 focus:border-white/30 focus:outline-none transition"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isSubmitting}
          aria-label="Add task"
          className="h-10 px-3.5 shrink-0 rounded-xl bg-foreground text-background hover:bg-zinc-200 transition disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 text-xs font-medium"
        >
          <FiPlus className="h-3.5 w-3.5" />
          <span>Add</span>
        </button>
      </form>

      {/* Tasks List */}
      <div className="rounded-2xl border border-white/10 bg-zinc-900/40 overflow-hidden">
        {isLoading && todos.length === 0 ? (
          <div className="py-12 text-center text-xs text-zinc-500">
            Loading tasks...
          </div>
        ) : todos.length === 0 ? (
          <div className="py-12 text-center text-xs text-zinc-500">
            No tasks yet.
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {todos.map((todo) => {
              const isEditing = editingId === todo.id;

              return (
                <li
                  key={todo.id}
                  className="group flex items-center justify-between gap-3 px-3.5 sm:px-4 py-2.5 hover:bg-white/[0.02] transition"
                >
                  {/* Left: Checkbox & Label */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
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
                          className="w-full rounded-lg border border-white/20 bg-black/60 px-2.5 py-1 text-xs sm:text-sm text-foreground focus:outline-none focus:border-white/40"
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
                        className={`text-xs sm:text-sm leading-snug cursor-pointer select-none truncate transition ${
                          todo.is_completed
                            ? 'text-zinc-500 line-through'
                            : 'text-zinc-200'
                        }`}
                      >
                        {todo.text}
                      </span>
                    )}
                  </div>

                  {/* Actions (discreet, visible on hover / focus) */}
                  {!isEditing && (
                    <div className="flex items-center gap-1 shrink-0 opacity-70 group-hover:opacity-100 transition">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(todo)}
                        aria-label={`Edit "${todo.text}"`}
                        title="Edit"
                        className="p-1 text-zinc-500 hover:text-zinc-300 transition"
                      >
                        <FiEdit2 className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(todo.id)}
                        aria-label={`Delete "${todo.text}"`}
                        title="Delete"
                        className="p-1 text-zinc-500 hover:text-rose-400 transition"
                      >
                        <FiTrash2 className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
