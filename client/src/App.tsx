import React, { useState, useEffect } from 'react';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

function App(){
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const response = await fetch('http://127.0.0.1:5000/tasks');
    const data = await response.json();
    setTasks(data.tasks);
  };

  const handleAddTask = async () => {
    const response = await fetch('http://127.0.0.1:5000/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: newTaskTitle }),
    });
    const data = await response.json();
    setTasks([...tasks, data.task]);
    setNewTaskTitle('');
  };

  const handleToggleTask = async (taskId: number) => {
    const taskToUpdate = tasks.find(task => task.id === taskId);
    if (!taskToUpdate) return;
    const response = await fetch(`http://127.0.0.1:5000/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed: !taskToUpdate.completed }),
    });
    const updatedTask = await response.json();
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: updatedTask.task.completed } : task
    ));
  };

  const handleDeleteTask = async (taskId: number) => {
    await fetch(`http://127.0.0.1:5000/tasks/${taskId}`, {
      method: 'DELETE',
    });
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <div>
      <h1>To-Do List</h1>
      <input
        type="text"
        value={newTaskTitle}
        onChange={(e) => setNewTaskTitle(e.target.value)}
        placeholder="Enter task title"
      />
      <button onClick={handleAddTask}>Add Task</button>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggleTask(task.id)}
            />
            <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>{task.title}</span>
            <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
