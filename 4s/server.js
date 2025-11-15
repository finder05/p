// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory storage for tasks
let tasks = [];
let currentId = 1;

// Get all tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// Add a new task
app.post('/tasks', (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  const newTask = {
    id: currentId++,
    title,
    status: 'Pending' // default status
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Update task status
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const task = tasks.find(t => t.id === parseInt(id));
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  if (!['Pending', 'InProgress', 'Completed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  task.status = status;
  res.json(task);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
