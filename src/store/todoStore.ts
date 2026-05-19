import { create } from 'zustand';
import { nanoid } from 'nanoid';
import type { Todo } from '../types';
import { loadTodos, saveTodos } from '../lib/storage';

type State = {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  removeTodo: (id: string) => void;
  clearDone: () => void;
};

export const useTodoStore = create<State>((set, get) => ({
  todos: loadTodos(),

  addTodo: (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const todo: Todo = {
      id: nanoid(8),
      text: trimmed,
      done: false,
      createdAt: Date.now(),
    };
    const next = [todo, ...get().todos];
    saveTodos(next);
    set({ todos: next });
  },

  toggleTodo: (id) => {
    const next = get().todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    saveTodos(next);
    set({ todos: next });
  },

  removeTodo: (id) => {
    const next = get().todos.filter((t) => t.id !== id);
    saveTodos(next);
    set({ todos: next });
  },

  clearDone: () => {
    const next = get().todos.filter((t) => !t.done);
    saveTodos(next);
    set({ todos: next });
  },
}));
