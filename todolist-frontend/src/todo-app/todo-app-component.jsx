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
  const [titleError, setTitleError] = useState('');
  const [todoTextError, setTodoTextError] = useState('');

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
    if (!title.trim()) {
      setTitleError('Title cannot be empty');
      return;
    } else {
      setTitleError('');
    }
    if (!todoText.trim()) {
      setTodoTextError('Todo text cannot be empty');
      return;
    } else {
      setTodoTextError('');
    }
    setLoading(true);
    try {
      const newTodo = { title, todoText, cboxStatus: false };
      const response = await axios.post('http://localhost:8080/api/todos', newTodo);
      setTodos([...todos, response.data]);
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
      setTodos(todos.filter(todo => todo.id !== id));
      if (id === editingId) {
        setEditingId(null);
        setTitle('');
        setTodoText('');
      }
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
      setTodos(todos.map(todo => (todo.id === id ? updatedTodo : todo)));
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
    if (!title.trim()) {
      setTitleError('Title cannot be empty');
      return;
    } else {
      setTitleError('');
    }
    if (!todoText.trim()) {
      setTodoTextError('Todo text cannot be empty');
      return;
    } else {
      setTodoTextError('');
    }
    setLoading(true);
    try {
      const updatedTodo = { title, todoText, cboxStatus: todos.find(todo => todo.id === editingId).cboxStatus };
      const response = await axios.put(`http://localhost:8080/api/todos/${editingId}`, updatedTodo);
      setTodos(todos.map(todo => (todo.id === editingId ? response.data : todo)));
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
    <div className="todo-container">
      <h1>Todo List</h1>
      <div className="input-container">
        <input 
          type="text" 
          placeholder="Title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
        />
        {titleError && <p className="error">{titleError}</p>}
        <input 
          type="text" 
          placeholder="Enter todo" 
          value={todoText} 
          onChange={(e) => setTodoText(e.target.value)} 
        />
        {todoTextError && <p className="error">{todoTextError}</p>}
        {editingId ? (
          <button onClick={saveEdit} disabled={loading}>Save changes</button>
        ) : (
          <button onClick={addTodo} disabled={loading}>Add new task</button>
        )}
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <input 
              type="checkbox" 
              checked={todo.cboxStatus} 
              onChange={() => toggleComplete(todo.id)} 
            />
            <span className={todo.cboxStatus ? 'completed' : ''}>
              {todo.title} - {todo.todoText}
            </span>
            <div className="button-group">
              <button onClick={() => editing(todo)} disabled={editingId === todo.id}>Edit</button>  
              <button onClick={() => deleteTodo(todo.id)} disabled={editingId === todo.id}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoComponent;
