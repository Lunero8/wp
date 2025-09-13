// Check if we're on the login page or todo page
document.addEventListener('DOMContentLoaded', function() {
    // Check which page we're on
    if (window.location.pathname.includes('todo.html')) {
        initTodoPage();
    } else {
        initLoginPage();
    }
});

// LOGIN FUNCTIONALITY
function initLoginPage() {
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        // Redirect to todo page if already logged in
        window.location.href = 'todo.html';
        return;
    }

    const loginForm = document.getElementById('loginForm');
    const messageDiv = document.getElementById('message');

    // Handle login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Simple authentication (in real app, this would be more secure)
        if (username === 'admin' && password === 'password') {
            // Store login status in localStorage
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            
            showMessage('Login successful! Redirecting...', 'success');
            
            // Redirect to todo page after short delay
            setTimeout(() => {
                window.location.href = 'todo.html';
            }, 1000);
        } else {
            showMessage('Invalid username or password!', 'error');
        }
    });
}

// TO-DO FUNCTIONALITY
function initTodoPage() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
        // Redirect to login page if not logged in
        window.location.href = 'login.html';
        return;
    }

    const taskInput = document.getElementById('taskInput');
    const addBtn = document.getElementById('addBtn');
    const taskList = document.getElementById('taskList');
    const logoutBtn = document.getElementById('logoutBtn');
    const taskCount = document.getElementById('taskCount');

    // Load existing tasks from localStorage
    loadTasks();
    
    // Add new task event listener
    addBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Logout functionality
    logoutBtn.addEventListener('click', function() {
        // Clear login status from localStorage
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        // Redirect to login page
        window.location.href = 'login.html';
    });
}

// Add a new task
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }

    // Get existing tasks from localStorage
    const tasks = getTasksFromStorage();
    
    // Create new task object
    const newTask = {
        id: Date.now(), // Simple ID using timestamp
        text: taskText,
        completed: false
    };
    
    // Add new task to array
    tasks.push(newTask);
    
    // Save tasks back to localStorage
    saveTasksToStorage(tasks);
    
    // Clear input field
    taskInput.value = '';
    
    // Refresh the task display
    displayTasks();
    updateTaskCount();
}

// Load and display tasks from localStorage
function loadTasks() {
    displayTasks();
    updateTaskCount();
}

// Display all tasks in the DOM
function displayTasks() {
    const taskList = document.getElementById('taskList');
    const tasks = getTasksFromStorage();
    
    // Clear existing tasks
    taskList.innerHTML = '';
    
    // Loop through tasks and create DOM elements
    tasks.forEach(task => {
        const taskItem = createTaskElement(task);
        taskList.appendChild(taskItem);
    });
}

// Create a single task element
function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    
    li.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} 
               onchange="toggleTask(${task.id})">
        <span class="task-text">${task.text}</span>
        <div class="task-actions">
            <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
            <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
        </div>
    `;
    
    return li;
}

// Toggle task completion status
function toggleTask(taskId) {
    const tasks = getTasksFromStorage();
    
    // Find the task and toggle its completed status
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        saveTasksToStorage(tasks);
        displayTasks();
        updateTaskCount();
    }
}

// Edit a task
function editTask(taskId) {
    const tasks = getTasksFromStorage();
    const task = tasks.find(task => task.id === taskId);
    
    if (task) {
        const newText = prompt('Edit task:', task.text);
        if (newText !== null && newText.trim() !== '') {
            task.text = newText.trim();
            saveTasksToStorage(tasks);
            displayTasks();
        }
    }
}

// Delete a task
function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        const tasks = getTasksFromStorage();
        
        // Filter out the task to be deleted
        const updatedTasks = tasks.filter(task => task.id !== taskId);
        
        saveTasksToStorage(updatedTasks);
        displayTasks();
        updateTaskCount();
    }
}

// Update task count display
function updateTaskCount() {
    const taskCount = document.getElementById('taskCount');
    const tasks = getTasksFromStorage();
    const completedTasks = tasks.filter(task => task.completed).length;
    
    taskCount.textContent = `${tasks.length} tasks (${completedTasks} completed)`;
}

// Get tasks from localStorage
function getTasksFromStorage() {
    const tasksJSON = localStorage.getItem('todos');
    return tasksJSON ? JSON.parse(tasksJSON) : [];
}

// Save tasks to localStorage
function saveTasksToStorage(tasks) {
    localStorage.setItem('todos', JSON.stringify(tasks));
}

// Show login message
function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    
    // Clear message after 3 seconds
    setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.className = 'message';
    }, 3000);
}