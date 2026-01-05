import React from "react";
import Tasks from "./Tasks";
import { 
    Paper, 
    TextField, 
    CircularProgress, 
    Snackbar,
    Button,
    Checkbox,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Chip,
    IconButton,
} from "@material-ui/core";
import { 
    Delete as DeleteIcon, 
    Edit as EditIcon,
    Search as SearchIcon,
} from "@material-ui/icons";
import "./App.css";
import backgroundImg from "./background.jpg";

// Inline style for the page background (clean image without overlays)
const pageStyle = {
    backgroundImage: `url(${backgroundImg})`,
};

class App extends Tasks {
    render() {
        const { 
            tasks, 
            loading, 
            error, 
            currentTask,
            currentDescription,
            currentPriority,
            currentDueDate,
            filter,
            searchTerm,
            editMode,
            editingTaskId,
        } = this.state;

        const filteredTasks = this.getFilteredTasks();
        const stats = this.getStats();

        return (
            <div className="App page" style={pageStyle}>
                <Paper elevation={6} className="container">
                    {/* Header with Stats */}
                    <div className="header">
                        <div className="heading">✨ My Tasks</div>
                        <div className="stats">
                            <Chip label={`Total: ${stats.total}`} className="stat-chip total" />
                            <Chip label={`Done: ${stats.completed}`} className="stat-chip completed" />
                            <Chip label={`Pending: ${stats.pending}`} className="stat-chip pending" />
                        </div>
                    </div>

                    {/* Add Task Form */}
                    <Paper elevation={3} className="formContainer">
                        <form onSubmit={this.handleSubmit} className="formRow">
                            <TextField
                                variant="outlined"
                                size="small"
                                className="taskInput"
                                value={currentTask}
                                onChange={this.handleChange}
                                name="currentTask"
                                placeholder="Task title..."
                                required
                            />
                            <TextField
                                variant="outlined"
                                size="small"
                                className="descInput"
                                value={currentDescription}
                                onChange={this.handleChange}
                                name="currentDescription"
                                placeholder="Description (optional)"
                            />
                            <FormControl variant="outlined" size="small" className="prioritySelect">
                                <InputLabel>Priority</InputLabel>
                                <Select
                                    value={currentPriority}
                                    onChange={this.handleChange}
                                    name="currentPriority"
                                    label="Priority"
                                >
                                    <MenuItem value="low">Low</MenuItem>
                                    <MenuItem value="medium">Medium</MenuItem>
                                    <MenuItem value="high">High</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                variant="outlined"
                                size="small"
                                type="date"
                                className="dateInput"
                                value={currentDueDate}
                                onChange={this.handleChange}
                                name="currentDueDate"
                                InputLabelProps={{ shrink: true }}
                                label="Due Date"
                            />
                            <Button
                                className="addButton"
                                color="primary"
                                variant="contained"
                                type="submit"
                            >
                                {editMode ? "Update" : "Add Task"}
                            </Button>
                            {editMode && (
                                <Button
                                    className="cancelButton"
                                    variant="outlined"
                                    onClick={this.cancelEdit}
                                >
                                    Cancel
                                </Button>
                            )}
                        </form>
                    </Paper>

                    {/* Search and Filter */}
                    <div className="filterRow">
                        <TextField
                            variant="outlined"
                            size="small"
                            className="searchInput"
                            value={searchTerm}
                            onChange={this.handleChange}
                            name="searchTerm"
                            placeholder="Search tasks..."
                            InputProps={{
                                startAdornment: <SearchIcon className="searchIcon" />,
                            }}
                        />
                        <FormControl variant="outlined" size="small" className="filterSelect">
                            <InputLabel>Filter</InputLabel>
                            <Select
                                value={filter}
                                onChange={this.handleChange}
                                name="filter"
                                label="Filter"
                            >
                                <MenuItem value="all">All Tasks</MenuItem>
                                <MenuItem value="active">Active</MenuItem>
                                <MenuItem value="completed">Completed</MenuItem>
                                <MenuItem value="high">High Priority</MenuItem>
                                <MenuItem value="medium">Medium Priority</MenuItem>
                                <MenuItem value="low">Low Priority</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    {/* Tasks List */}
                    <div className="bodyArea">
                        {loading ? (
                            <div className="centerRow">
                                <CircularProgress />
                            </div>
                        ) : filteredTasks.length === 0 ? (
                            <div className="emptyState">
                                {searchTerm || filter !== "all" 
                                    ? "No tasks found matching your criteria" 
                                    : "No tasks yet — add your first task above! 🚀"}
                            </div>
                        ) : (
                            filteredTasks.map((task) => (
                                <Paper 
                                    key={task._id} 
                                    elevation={2}
                                    className={`task_container ${task.completed ? 'completed' : ''} priority-${task.priority}`}
                                >
                                    <Checkbox
                                        checked={task.completed}
                                        onChange={() => this.handleToggleComplete(task._id)}
                                        color="primary"
                                        className="taskCheckbox"
                                    />
                                    <div className="taskContent">
                                        <div className={task.completed ? "taskTitle line_through" : "taskTitle"}>
                                            {task.task}
                                            <Chip 
                                                label={task.priority} 
                                                size="small" 
                                                className={`priorityChip priority-${task.priority}`}
                                            />
                                        </div>
                                        {task.description && (
                                            <div className="taskDescription">{task.description}</div>
                                        )}
                                        {task.dueDate && (
                                            <div className="taskDueDate">
                                                📅 Due: {new Date(task.dueDate).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>
                                    <div className="taskActions">
                                        <IconButton 
                                            size="small" 
                                            onClick={() => this.handleEdit(task)}
                                            className="editButton"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton 
                                            size="small" 
                                            onClick={() => this.handleDelete(task._id)}
                                            className="deleteButton"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </div>
                                </Paper>
                            ))
                        )}
                    </div>

                    <Snackbar 
                        open={!!error} 
                        message={error || ""} 
                        onClose={this.clearError} 
                        autoHideDuration={4000} 
                    />
                </Paper>
            </div>
        );
    }
}

export default App;