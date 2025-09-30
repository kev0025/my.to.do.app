import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Trash2, Edit2, CheckCircle, XCircle } from 'lucide-react';

export default function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const raw = localStorage.getItem('todo.tasks.v1');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [query, setQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('todo.tasks.v1', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (editingId !== null) inputRef.current?.focus();
  }, [editingId]);

  function addTask(e) {
    e?.preventDefault();
    const title = input.trim();
    if (!title) return;
    const newTask = {
      id: Date.now().toString(),
      title,
      done: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((t) => [newTask, ...t]);
    setInput('');
  }

  function deleteTask(id) {
    setTasks((t) => t.filter((x) => x.id !== id));
  }

  function toggleDone(id) {
    setTasks((t) => t.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
  }

  function startEdit(task) {
    setEditingId(task.id);
    setInput(task.title);
  }

  function saveEdit(e) {
    e?.preventDefault();
    const title = input.trim();
    if (!title) return;
    setTasks((t) => t.map((x) => (x.id === editingId ? { ...x, title } : x)));
    setEditingId(null);
    setInput('');
  }

  function cancelEdit() {
    setEditingId(null);
    setInput('');
  }

  const filtered = tasks.filter((t) =>
    t.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Simple To‑Do</h1>
      <form onSubmit={editingId ? saveEdit : addTask}>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={editingId ? 'Edit task...' : 'Add a new task...'}
        />
        <button type="submit">{editingId ? 'Save' : 'Add'}</button>
        {editingId && <button onClick={cancelEdit}>Cancel</button>}
      </form>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search tasks..."
      />

      <AnimatePresence>
        {filtered.length === 0 ? (
          <motion.div>No tasks yet — add one to get started.</motion.div>
        ) : (
          filtered.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '10px',
              }}
            >
              <div>
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleDone(task.id)}
                />
                <span style={{ textDecoration: task.done ? 'line-through' : 'none' }}>
                  {task.title}
                </span>
              </div>
              <div>
                <button onClick={() => startEdit(task)}>Edit</button>
                <button onClick={() => deleteTask(task.id)}>Delete</button>
              </div>
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  );
}
