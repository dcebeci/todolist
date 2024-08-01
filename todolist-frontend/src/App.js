import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './App.css';


const App = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await axios.get('http://localhost:8080/api/todos');
    setTodos(response.data);
  };

  const addTodo = async () => {
    const newTodo = { title, description, completed: false };
    await axios.post('http://localhost:8080/api/todos', newTodo);
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await axios.delete(`http://localhost:8080/api/todos/${id}`);
    fetchTodos();
  };

  const toggleComplete = async (id) => {
    const todo = todos.find(todo => todo.id === id);
    const updatedTodo = { ...todo, completed: !todo.completed };
    await axios.put(`http://localhost:8080/api/todos/${id}`, updatedTodo);
    fetchTodos();
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
          placeholder="Description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
        />
        <button onClick={addTodo}>Add new task</button>
      </div>
      <ul>
        {todos.map(todo => (
          <li key={todo.id} style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
            {todo.title} - {todo.description}
            <button onClick={() => toggleComplete(todo.id)}>
              {todo.completed ? 'Uncomplete' : 'Complete'}
            </button>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default App;
