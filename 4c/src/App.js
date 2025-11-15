// client/src/App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const fetchTasks = async () => {
    const res = await axios.get('http://localhost:5000/tasks');
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!newTaskTitle) return;
    const res = await axios.post('http://localhost:5000/tasks', { title: newTaskTitle });
    setTasks([...tasks, res.data]);
    setNewTaskTitle('');
  };

  const updateStatus = async (id, status) => {
    const res = await axios.put(`http://localhost:5000/tasks/${id}`, { status });
    setTasks(tasks.map(task => task.id === id ? res.data : task));
  };

  return (
    <div className="App">
      <h1>Project Management Dashboard</h1>
      
      <div className="add-task">
        <input 
          type="text" 
          value={newTaskTitle} 
          onChange={(e) => setNewTaskTitle(e.target.value)} 
          placeholder="Enter task title" 
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      <div className="task-list">
        {tasks.map(task => (
          <div key={task.id} className="task">
            <span>{task.title}</span>
            <select 
              value={task.status} 
              onChange={(e) => updateStatus(task.id, e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="InProgress">InProgress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

