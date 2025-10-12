'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export interface Todo {
  _id: string;
  title: string;
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// 🧩 Безопасный fetch — не ломает билд
const fetchTodos = async () => {
  if (typeof window === 'undefined') return []; // пропускаем вызов при билде

  const res = await fetch('/api/todos');
  if (!res.ok) throw new Error('Failed to fetch todos');
  return res.json();
};

export default function Home() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');

  const { data: todos = [], isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });

  const addTodo = useMutation({
    mutationFn: async (newTodo: string) =>
      fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTodo }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  });

  const toggleTodo = useMutation({
    mutationFn: async (todo: Todo) =>
      fetch('/api/todos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: todo._id, completed: !todo.completed }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  });

  const deleteTodo = useMutation({
    mutationFn: async (id: string) =>
      fetch('/api/todos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  });

  return (
    <main className='p-4 max-w-md mx-auto'>
      <h1 className='text-2xl font-bold mb-4'>Todo List</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (title.trim()) addTodo.mutate(title);
          setTitle('');
        }}
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder='New todo...'
          className='border p-2 rounded w-full'
        />
      </form>

      <ul className='mt-4 space-y-2'>
        {isLoading ? (
          <div className='text-center p-4 bg-gray-200'>Loading...</div>
        ) : (
          todos.map((todo: Todo) => (
            <li
              key={todo._id}
              className='flex justify-between items-center border p-2 rounded'
            >
              <span
                className={todo.completed ? 'line-through' : ''}
                onClick={() => toggleTodo.mutate(todo)}
              >
                {todo.title}
              </span>
              <button onClick={() => deleteTodo.mutate(todo._id)}>❌</button>
            </li>
          ))
        )}
      </ul>
    </main>
  );
}
