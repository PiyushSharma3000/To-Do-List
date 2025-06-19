// Get the HTML elements we will interact with
const inputBox = document.getElementById("inputBox"); // The input where user types the task
const addBtn = document.getElementById("addBtn");     // The "Add" button
const todoList = document.getElementById("todoList"); // The <ul> where tasks will be shown

// To track if we're editing an existing task
let editTarget = null;


// ✅ FUNCTION: Get tasks from localStorage
const getTodosFromLocal = () => {
    const todos = localStorage.getItem("todos"); // Try to get the 'todos' array
    return todos ? JSON.parse(todos) : [];       // If found, convert from string to array; if not, return empty array
};


// ✅ FUNCTION: Save tasks to localStorage
const saveTodosToLocal = (todos) => {
    localStorage.setItem("todos", JSON.stringify(todos)); // Convert array to string and save
};


// ✅ FUNCTION: Add or Update a task
const addTodo = () => {
    const inputText = inputBox.value.trim(); // Get and trim the input value (remove extra spaces)

    // If nothing is typed, show an alert
    if (inputText.length <= 0) {
        alert('Write something!');
        return;
    }

    // If we are editing an existing task
    if (editTarget) {
        console.log(editTarget.querySelector("p").textContent); //if old task = ok then edit..= ok
        
        const oldText = editTarget.querySelector("p").textContent; // Get old text of the task
        editTarget.querySelector("p").textContent = inputText;     // Replace with new text

        updateTodoInLocal(oldText, inputText);                     // Update localStorage with new text

        addBtn.value = "Add";     // Change button text back to "Add"
        editTarget = null;        // Clear the editing tracker
        inputBox.value = "";      // Clear the input box
        return;
    }

    // If adding a brand new task
    createTodoElement(inputText);          // Show on screen

    const todos = getTodosFromLocal();     // Get all existing todos from storage
    todos.push(inputText);                 // Add the new one
    saveTodosToLocal(todos);               // Save updated list

    inputBox.value = "";                   // Clear the input box
};


// ✅ FUNCTION: Create and show a new task on the screen
const createTodoElement = (text) => {
    const li = document.createElement("li");    // Create new list item
    const p = document.createElement("p");      // Create <p> to hold the task text
    p.textContent = text;                       // Set the task text
    li.appendChild(p);                          // Add <p> to <li>

    // Create Remove Button
    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Remove";
    deleteBtn.classList.add("btn", "deleteBtn"); // Add CSS classes
    li.appendChild(deleteBtn);                   // Add button to <li>

    // Create Edit Button
    const editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    editBtn.classList.add("btn", "editBtn");     // Add CSS classes
    li.appendChild(editBtn);                     // Add button to <li>

    // Add the final <li> to the <ul> (todoList)
    todoList.appendChild(li);
};


// ✅ FUNCTION: Handle edit and delete buttons
const updateTodo = (e) => {
    const target = e.target; // Get the clicked element

    // If Delete button clicked
    if (target.classList.contains("deleteBtn")) {
        const li = target.parentElement;                       // Get parent <li>
        const text = li.querySelector("p").textContent;        // Get the task text
        todoList.removeChild(li);                              // Remove <li> from screen

        if (editTarget === li) {                               // If we were editing this, cancel editing
            editTarget = null;
            addBtn.value = "Add";
            inputBox.value = "";
        }

        removeTodoFromLocal(text);                             // Remove from localStorage
    }

    // If Edit button clicked
    if (target.classList.contains("editBtn")) {
        editTarget = target.parentElement;                     // Set this <li> as the one we're editing
        inputBox.value = editTarget.querySelector("p").textContent; // Show its text in input
        inputBox.focus();                                      // Focus on input
        addBtn.value = "Update";                               // Change button to "Update"
    }
};


// ✅ FUNCTION: Remove a task from localStorage
const removeTodoFromLocal = (text) => {
    const todos = getTodosFromLocal();                  // Get saved tasks
    const filteredTodos = todos.filter( (todo) => todo !== text); // Remove the one that matches
    saveTodosToLocal(filteredTodos);                    // Save updated list
};


// ✅ FUNCTION: Update a task in localStorage
const updateTodoInLocal = (oldText, newText) => {
    const todos = getTodosFromLocal();                  // Get saved tasks
    const index = todos.indexOf(oldText);               // Find the one to replace
    if (index !== -1) {
        todos[index] = newText;                         // Replace it
        saveTodosToLocal(todos);                        // Save updated list
    }
};


// ✅ FUNCTION: Show all tasks saved in localStorage (when page loads)
const loadTodos = () => {
    const todos = getTodosFromLocal();                  // Get tasks from storage
    todos.forEach(todo => createTodoElement(todo));     // Show each one on the screen
};


// ✅ EVENT LISTENERS

// When "Add" button is clicked
addBtn.addEventListener("click", addTodo);

// When any button inside the list is clicked (Edit/Delete)
todoList.addEventListener("click", updateTodo);

// When user presses Enter key inside the input box
inputBox.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        addTodo();
    }
});

// When page fully loads, show stored tasks
window.addEventListener("DOMContentLoaded", loadTodos);
