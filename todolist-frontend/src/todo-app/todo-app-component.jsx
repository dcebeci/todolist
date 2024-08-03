import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './todo-app-component.css';

const TodoComponent = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [todoText, setTodoText] = useState('');
  const [editingId, setEditingId] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/todos');
      setTodos(response.data);
    } catch (err) {
      setError('Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async () => {
    setLoading(true);
    try {
      const newTodo = { title, todoText, cboxStatus: false };
      await axios.post('http://localhost:8080/api/todos', newTodo);
      fetchTodos();
      setTitle('');
      setTodoText('');
    } catch (err) {
      setError('Failed to add todo');
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8080/api/todos/${id}`);
      fetchTodos();
    } catch (err) {
      setError('Failed to delete todo');
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = async (id) => {
    setLoading(true);
    try {
      const todo = todos.find(todo => todo.id === id);
      const updatedTodo = { ...todo, cboxStatus: !todo.cboxStatus };
      await axios.put(`http://localhost:8080/api/todos/${id}`, updatedTodo);
      fetchTodos();
    } catch (err) {
      setError('Failed to update todo');
    } finally {
      setLoading(false);
    }
  };

  const editing = (todo) => {
    setEditingId(todo.id);
    setTitle(todo.title);
    setTodoText(todo.todoText);
  };

  const saveEdit = async () => {
    setLoading(true);
    try {
      const updatedTodo = { title, todoText, cboxStatus: todos.find(todo => todo.id === editingId).cboxStatus };
      await axios.put(`http://localhost:8080/api/todos/${editingId}`, updatedTodo);
      fetchTodos();
      setEditingId(null);
      setTitle('');
      setTodoText('');
    } catch (err) {
      setError('Failed to update todo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Todo List</h1>
      <div>
        <input 
          type="text" 
          placeholder="Title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="enter todo" 
          value={todoText} 
          onChange={(e) => setTodoText(e.target.value)} 
        />
        {editingId ? (
          <button onClick={saveEdit} disabled={loading}>Save changes</button>
        ) : (
          <button onClick={addTodo} disabled={loading}>Add new task</button>
        )}
      </div>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {todos.map(todo => (
          <li key={todo.id} className={todo.cboxStatus ? 'completed' : ''}>
            <input 
              type="checkbox" 
              checked={todo.cboxStatus} 
              onChange={() => toggleComplete(todo.id)} 
            />
            {todo.title} - {todo.todoText}
            <button onClick={() => editing(todo)}>Edit</button>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoComponent;
