document.addEventListener("DOMContentLoaded", function () {
  const taskForm = document.getElementById("task-form");
  const taskInput = document.getElementById("task-input");
  const taskList = document.getElementById("task-list");
  const filterInput = document.getElementById("filter");
  const themeToggle = document.getElementById("theme-toggle");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [
    { text: "Tarefa Exemplo 1", completed: false },
    { text: "Tarefa Exemplo 2", completed: true },
  ];

  let theme = localStorage.getItem("theme") || "light";

  function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.className = task.completed ? "completed" : "";
      li.textContent = task.text;
      li.tabIndex = 0;
      li.addEventListener("click", () => toggleTaskCompletion(index));
      li.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          toggleTaskCompletion(index);
        }
      });
      taskList.appendChild(li);
    });
  }

  function toggleTaskCompletion(index) {
    tasks[index].completed = !tasks[index].completed;
    updateLocalStorage();
    renderTasks();
  }

  function updateLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  taskForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const newTask = taskInput.value.trim();
    if (newTask !== "") {
      tasks.push({ text: newTask, completed: false });
      taskInput.value = "";
      updateLocalStorage();
      renderTasks();
    }
  });

  filterInput.addEventListener("input", function () {
    const filterText = filterInput.value.toLowerCase();
    Array.from(taskList.children).forEach(function (task) {
      const taskText = task.textContent.toLowerCase();
      if (taskText.includes(filterText)) {
        task.style.display = "";
      } else {
        task.style.display = "none";
      }
    });
  });

  themeToggle.addEventListener("click", function () {
    theme = theme === "light" ? "dark" : "light";
    document.body.className = `${theme}-theme`;
    localStorage.setItem("theme", theme);
  });

  document.body.className = `${theme}-theme`;

  renderTasks();
});
