const inputBox = document.getElementById("inputBox");
const addBtn = document.getElementById("addBtn");
const clearBtn = document.getElementById("clearBtn");
const todoList = document.getElementById("todoList");

let editTarget = null; // Keeps track of task being edited

// Load tasks from localStorage
function getTodos() {
  const todos = localStorage.getItem("todos");
  return todos ? JSON.parse(todos) : [];
}

// Save tasks to localStorage
function saveTodos(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// Add or update a task
function handleAdd() {
  const text = inputBox.value.trim();
  if (text === "") {
    alert("Please enter something.");
    return;
  }

  if (editTarget) {
    const oldText = editTarget.querySelector("p").textContent;
    editTarget.querySelector("p").textContent = text;
    updateTodo(oldText, text);
    addBtn.value = "Add";
    editTarget = null;
  } else {
    addTaskToDOM(text);
    const todos = getTodos();
    todos.push(text);
    saveTodos(todos);
  }

  inputBox.value = "";
}

// Create a new task item in the DOM
function addTaskToDOM(text) {
  const li = document.createElement("li");
  const p = document.createElement("p");
  p.textContent = text;
  li.appendChild(p);

  const editBtn = document.createElement("button");
  editBtn.innerText = "Edit";
  editBtn.classList.add("btn", "editBtn");

  const deleteBtn = document.createElement("button");
  deleteBtn.innerText = "Remove";
  deleteBtn.classList.add("btn", "deleteBtn");

  li.appendChild(editBtn);
  li.appendChild(deleteBtn);

  todoList.appendChild(li);
}

// Edit or delete handler
function handleListClick(e) {
  const target = e.target;

  if (target.classList.contains("deleteBtn")) {
    const li = target.parentElement;
    const text = li.querySelector("p").textContent;
    todoList.removeChild(li);
    removeTodo(text);

    if (editTarget === li) {
      editTarget = null;
      addBtn.value = "Add";
      inputBox.value = "";
    }
  }

  if (target.classList.contains("editBtn")) {
    editTarget = target.parentElement;
    inputBox.value = editTarget.querySelector("p").textContent;
    inputBox.focus();
    addBtn.value = "Update";
  }
}

// Remove a task from storage
function removeTodo(text) {
  const todos = getTodos();
  const updated = todos.filter(todo => todo !== text);
  saveTodos(updated);
}

// Update edited task in storage
function updateTodo(oldText, newText) {
  const todos = getTodos();
  const index = todos.indexOf(oldText);
  if (index !== -1) {
    todos[index] = newText;
    saveTodos(todos);
  }
}

// Show stored tasks when page loads
function loadTasks() {
  const todos = getTodos();
  todos.forEach(todo => addTaskToDOM(todo));
}

// Clear all tasks
function clearAllTasks() {
  if (confirm("Are you sure you want to delete all tasks?")) {
    todoList.innerHTML = "";
    localStorage.removeItem("todos");
    editTarget = null;
    addBtn.value = "Add";
    inputBox.value = "";
  }
}

// Event Listeners
addBtn.addEventListener("click", handleAdd);
clearBtn.addEventListener("click", clearAllTasks);
todoList.addEventListener("click", handleListClick);
inputBox.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleAdd();
});
window.addEventListener("DOMContentLoaded", loadTasks);
