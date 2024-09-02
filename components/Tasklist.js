import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Tasklist() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [editingTaskId, setEditingTaskId] = useState(null);
    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        const response = await axios.get('http://localhost:5000/api/tasks');
        setTasks(response.data);
    }

        const handleAddTask = async (e) => {
            e.preventDefault();
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            if (image) {
                formData.append('image', image);
            }
        
            try {
                await axios.post('http://localhost:5000/api/tasks', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                fetchTasks();
                resetForm();
            } catch (error) {
                console.error('Error adding task:', error); // Log the error
            }
        };
        
        const handleEditTask = (task) => {
            setTitle(task.title);
            setDescription(task.description);
            setEditingTaskId(task.id);
        }; 
        const handleUpdateTask = async (e) => {
            e.preventDefault();
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            if (image) {
                formData.append('image', image);
            }
    
            await axios.put(`http://localhost:5000/api/tasks/${editingTaskId}`, formData);
            fetchTasks(); // Refresh the task list
            resetForm();
        };
    
        const handleDeleteTask = async (id) => {
            await axios.delete(`http://localhost:5000/api/tasks/${id}`);
            fetchTasks(); // Refresh the task list
        };
    
        const resetForm = () => {
            setTitle('');
            setDescription('');
            setImage(null);
            setEditingTaskId(null);
        };
        
 return (
    <div>
      <h1>Task Manager</h1>
            <form onSubmit={editingTaskId ? handleUpdateTask : handleAddTask}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <input
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                />  
                <button type="submit">{editingTaskId ? 'Update Task' : 'Add Task'}</button>
            </form>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map(task => (
                        <tr key={task.id}>
                            <td>{task.title}</td>
                            <td>{task.description}</td>
                            <td>
                                <button onClick={() => handleEditTask(task)}>Edit</button>
                                <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
    </div>
  )
}
export default Tasklist
