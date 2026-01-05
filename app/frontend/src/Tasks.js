import { Component } from "react";
import {
    addTask,
    getTasks,
    updateTask,
    deleteTask,
} from "./services/taskServices";

class Tasks extends Component {
    state = { 
        tasks: [], 
        currentTask: "", 
        currentDescription: "",
        currentPriority: "medium",
        currentDueDate: "",
        loading: true, 
        error: null,
        filter: "all",
        searchTerm: "",
        editMode: false,
        editingTaskId: null,
    };

    async componentDidMount() {
        this.setState({ loading: true, error: null });
        try {
            const { data } = await getTasks();
            this.setState({ tasks: data || [], loading: false });
        } catch (error) {
            console.log(error);
            this.setState({ error: error.message || "Failed to load tasks", loading: false });
        }
    }

    handleChange = ({ currentTarget: input }) => {
        this.setState({ [input.name]: input.value });
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        const { currentTask, currentDescription, currentPriority, currentDueDate, editMode, editingTaskId } = this.state;
        const originalTasks = this.state.tasks;
        
        if (!currentTask || !currentTask.trim()) return;

        try {
            if (editMode) {
                // Update existing task
                const taskData = {
                    task: currentTask.trim(),
                    description: currentDescription.trim(),
                    priority: currentPriority,
                    dueDate: currentDueDate || null,
                };
                await updateTask(editingTaskId, taskData);
                
                const tasks = originalTasks.map(t => 
                    t._id === editingTaskId ? { ...t, ...taskData } : t
                );
                this.setState({ 
                    tasks,
                    currentTask: "",
                    currentDescription: "",
                    currentPriority: "medium",
                    currentDueDate: "",
                    editMode: false,
                    editingTaskId: null,
                });
            } else {
                // Add new task
                const { data } = await addTask({ 
                    task: currentTask.trim(),
                    description: currentDescription.trim(),
                    priority: currentPriority,
                    dueDate: currentDueDate || null,
                });
                const tasks = [...originalTasks, data];
                this.setState({ 
                    tasks, 
                    currentTask: "",
                    currentDescription: "",
                    currentPriority: "medium",
                    currentDueDate: "",
                });
            }
        } catch (error) {
            console.log(error);
            this.setState({ error: error.message || "Failed to save task" });
        }
    };

    handleToggleComplete = async (taskId) => {
        const originalTasks = this.state.tasks;
        try {
            const tasks = [...originalTasks];
            const index = tasks.findIndex((task) => task._id === taskId);
            if (index === -1) return;
            
            tasks[index] = { ...tasks[index] };
            tasks[index].completed = !tasks[index].completed;
            this.setState({ tasks });
            
            await updateTask(taskId, {
                completed: tasks[index].completed,
            });
        } catch (error) {
            this.setState({ tasks: originalTasks, error: error.message || "Failed to update" });
            console.log(error);
        }
    };

    handleEdit = (task) => {
        this.setState({
            currentTask: task.task,
            currentDescription: task.description || "",
            currentPriority: task.priority || "medium",
            currentDueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "",
            editMode: true,
            editingTaskId: task._id,
        });
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    cancelEdit = () => {
        this.setState({
            currentTask: "",
            currentDescription: "",
            currentPriority: "medium",
            currentDueDate: "",
            editMode: false,
            editingTaskId: null,
        });
    };

    handleDelete = async (taskId) => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;
        
        const originalTasks = this.state.tasks;
        try {
            const tasks = originalTasks.filter((task) => task._id !== taskId);
            this.setState({ tasks });
            await deleteTask(taskId);
        } catch (error) {
            this.setState({ tasks: originalTasks, error: error.message || "Failed to delete" });
            console.log(error);
        }
    };

    getFilteredTasks = () => {
        const { tasks, filter, searchTerm } = this.state;
        
        let filtered = tasks;
        
        // Apply filter
        if (filter === "active") {
            filtered = filtered.filter(t => !t.completed);
        } else if (filter === "completed") {
            filtered = filtered.filter(t => t.completed);
        } else if (filter === "high" || filter === "medium" || filter === "low") {
            filtered = filtered.filter(t => t.priority === filter);
        }
        
        // Apply search
        if (searchTerm) {
            filtered = filtered.filter(t => 
                t.task.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }
        
        // Sort: incomplete first, then by priority, then by due date
        return filtered.sort((a, b) => {
            if (a.completed !== b.completed) return a.completed ? 1 : -1;
            
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            if (a.priority !== b.priority) {
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            }
            
            if (a.dueDate && b.dueDate) {
                return new Date(a.dueDate) - new Date(b.dueDate);
            }
            return 0;
        });
    };

    getStats = () => {
        const { tasks } = this.state;
        return {
            total: tasks.length,
            completed: tasks.filter(t => t.completed).length,
            pending: tasks.filter(t => !t.completed).length,
        };
    };

    clearError = () => this.setState({ error: null });
}

export default Tasks;