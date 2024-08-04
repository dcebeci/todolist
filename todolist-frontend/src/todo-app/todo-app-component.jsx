import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './todo-app-component.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'react-tooltip';


const TodoComponent = () => {
  const [todos, setTodos] = useState([]);
  const [todoText, setTodoText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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
    if (!todoText.trim()) {
      setTodoTextError('Todo text cannot be empty');
      return;
    } else {
      setTodoTextError('');
    }
    setLoading(true);
    try {
      const newTodo = { todoText, cboxStatus: false };
      const response = await axios.post('http://localhost:8080/api/todos', newTodo);
      setTodos([...todos, response.data]);
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

  const deleteCompletedTodos = async () => {
    setLoading(true);
    try {
      await axios.delete('http://localhost:8080/api/todos/completed');
      setTodos(todos.filter(todo => !todo.cboxStatus));
    } catch (err) {
      setError('Failed to delete completed todos');
    } finally {
      setLoading(false);
    }
  };

  const editing = (todo) => {
    setEditingId(todo.id);
    setTodoText(todo.todoText);
  };

  const saveEdit = async () => {
    if (!todoText.trim()) {
      setTodoTextError('Todo text cannot be empty');
      return;
    } else {
      setTodoTextError('');
    }
    setLoading(true);
    try {
      const updatedTodo = { todoText, cboxStatus: todos.find(todo => todo.id === editingId).cboxStatus };
      const response = await axios.put(`http://localhost:8080/api/todos/${editingId}`, updatedTodo);
      setTodos(todos.map(todo => (todo.id === editingId ? response.data : todo)));
      setEditingId(null);
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
        <input className='todoTextInput'
          type="text"
          placeholder="Enter todo"
          value={todoText}
          onChange={(e) => setTodoText(e.target.value)}
        />
      
        {todoTextError && <p className="error">{todoTextError}</p>}
        {editingId ? (
          <button onClick={saveEdit} disabled={loading}>Save changes</button>
        ) : (
          <button onClick={addTodo} disabled={loading}>Add todo</button>
        )}
      <button className='deleteCompletedButton' onClick={deleteCompletedTodos} disabled={loading} data-tooltip-id="deleteChecked" data-tooltip-content="Delete All Checked Todos">
          <FontAwesomeIcon icon={faTrashAlt}/>
        </button>
        <Tooltip id="deleteChecked" />
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
               {todo.todoText}
            </span>
            <div className="button-group">
              <button className='editButton' onClick={() => editing(todo)} disabled={editingId === todo.id}>
                <FontAwesomeIcon icon={faEdit}/>
              </button>
              <button className='deleteButton' onClick={() => deleteTodo(todo.id)} disabled={editingId === todo.id}>
                <FontAwesomeIcon icon={faTrashAlt}/>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoComponent;