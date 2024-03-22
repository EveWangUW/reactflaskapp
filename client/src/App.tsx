import React, { useState, useEffect } from 'react';  // Importing React and necessary hooks
import './App.css';  // Importing CSS file for styling

// Defining the shape of a Task object
interface Task {
  id: number;
  title: string;
  completed: boolean;
}

function App() {
  // State variables for tasks and new task title
  const [tasks, setTasks] = useState<Task[]>([]);  // Initializing tasks state as an empty array
  const [newTaskTitle, setNewTaskTitle] = useState('');  // Initializing newTaskTitle state as an empty string

  // Fetch tasks from the server on component mount
  useEffect(() => {
    fetchTasks();  // Invoking the fetchTasks function when the component mounts
  }, []);

  // Function to fetch tasks from the server
  const fetchTasks = async () => {
    const response = await fetch('http://127.0.0.1:5000/tasks');  // Fetching tasks from the server
    const data = await response.json();  // Parsing the JSON response
    setTasks(data.tasks);  // Updating the tasks state with the fetched tasks
  };

  // Function to handle adding a new task
  const handleAddTask = async () => {
    const response = await fetch('http://127.0.0.1:5000/tasks', {  // Sending a POST request to add a new task
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',  // Specifying content type as JSON
      },
      body: JSON.stringify({ title: newTaskTitle }),  // Sending the new task title in the request body
    });
    const data = await response.json();  // Parsing the JSON response
    setTasks([...tasks, data.task]);  // Updating the tasks state with the newly added task
    setNewTaskTitle('');  // Resetting the new task title input
  };

  // Function to handle toggling the completion status of a task
  const handleToggleTask = async (taskId: number) => {
    const taskToUpdate = tasks.find(task => task.id === taskId);  // Finding the task to update by its ID
    if (!taskToUpdate) return;  // If task not found, return early
    const response = await fetch(`http://127.0.0.1:5000/tasks/${taskId}`, {  // Sending a PUT request to update task completion status
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',  // Specifying content type as JSON
      },
      body: JSON.stringify({ completed: !taskToUpdate.completed }),  // Toggling the completed status of the task
    });
    const updatedTask = await response.json();  // Parsing the JSON response
    // Updating the tasks state with the updated task
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: updatedTask.task.completed } : task
    ));
  };

  // Function to handle deleting a task
  const handleDeleteTask = async (taskId: number) => {
    await fetch(`http://127.0.0.1:5000/tasks/${taskId}`, {  // Sending a DELETE request to delete the task
      method: 'DELETE',
    });
    // Removing the deleted task from the tasks state
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  // Rendering JSX for the application UI
  return (
    <div>
      <h1>To-Do List</h1>
      {/* Input field for entering new task title */}
      <input
        type="text"
        value={newTaskTitle}  // Binding the input value to newTaskTitle state
        onChange={(e) => setNewTaskTitle(e.target.value)}  // Handling input change to update newTaskTitle state
        placeholder="Enter task title"
      />
      {/* Button to add a new task */}
      <button onClick={handleAddTask}>Add Task</button>
      {/* List of tasks */}
      <ul>
        {/* Mapping over tasks and rendering each task */}
        {tasks.map(task => (
          <li key={task.id}>
            {/* Checkbox to toggle task completion status */}
            <input
              type="checkbox"
              checked={task.completed}  // Binding checkbox checked state to task completion status
              onChange={() => handleToggleTask(task.id)}  // Handling checkbox change to toggle task completion status
            />
            {/* Task title with strike-through if completed */}
            <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>{task.title}</span>
            {/* Button to delete a task */}
            <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;  // Exporting the App component
