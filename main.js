const calendar = document.getElementById("calendar");
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

let tasksByDate = {};
let selectedDate = null;


let currentYear;
let currentMonth;

addTaskBtn.addEventListener("click", addTask);

function generateCalendar(selectToday = false) {
calendar.innerHTML = "";

const today = new Date();

const year = currentYear;
const month = currentMonth;

const firstDayOfMonth = new Date(year, month, 1).getDay();
const lastDateOfMonth = new Date(year, month + 1, 0).getDate();

const monthName = new Date(year, month).toLocaleString("default", { month: "long" });
const header = document.createElement("div");
header.classList.add("calendar-header");

const prevBtn = document.createElement("button");
prevBtn.textContent = "<";
prevBtn.classList.add("month-btn");
prevBtn.addEventListener("click", () => changeMonth(-1));

const title = document.createElement("h2");
title.textContent = `${monthName} ${year}`;

const nextBtn = document.createElement("button");
nextBtn.textContent = ">";
nextBtn.classList.add("month-btn");
nextBtn.addEventListener("click", () => changeMonth(1));

header.appendChild(prevBtn);
header.appendChild(title);
header.appendChild(nextBtn);
calendar.appendChild(header);

const daysRow = document.createElement("div");
daysRow.classList.add("days-row");
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
days.forEach((day) => {
const dayCell = document.createElement("div");
dayCell.classList.add("day-name");
dayCell.textContent = day;
daysRow.appendChild(dayCell);
});
calendar.appendChild(daysRow);

const datesGrid = document.createElement("div");
datesGrid.classList.add("dates-grid");

for (let i = 0; i < firstDayOfMonth; i++) {
const emptyCell = document.createElement("div");
emptyCell.classList.add("date-cell", "empty");
datesGrid.appendChild(emptyCell);
}

for (let date = 1; date <= lastDateOfMonth; date++) {
const dateCell = document.createElement("div");
dateCell.classList.add("date-cell");
dateCell.textContent = date;

const dateValue = new Date(year, month, date).toISOString().split("T")[0];

if (tasksByDate[dateValue] && tasksByDate[dateValue].length > 0) {
dateCell.classList.add("has-tasks");
}

dateCell.addEventListener("click", () => {
selectedDate = dateValue;
renderTasks();
highlightSelectedDate(dateCell);
});

datesGrid.appendChild(dateCell);

if (selectToday && year === today.getFullYear() && month === today.getMonth() && date === today.getDate()) {
selectedDate = dateValue;
highlightSelectedDate(dateCell);
}
}

calendar.appendChild(datesGrid);
}


function changeMonth(direction) {
currentMonth += direction;

if (currentMonth < 0) {
currentMonth = 11;
currentYear--;
} else if (currentMonth > 11) {
currentMonth = 0;
currentYear++;
}

generateCalendar(false); 
}


function highlightSelectedDate(selectedCell) {
  const allCells = document.querySelectorAll(".date-cell");
  allCells.forEach((cell) => cell.classList.remove("selected"));

  if (selectedCell) {
    selectedCell.classList.add("selected");
  } else {
    
    const today = new Date();
    const todayDate = today.getDate();
    allCells.forEach((cell) => {
      if (
        cell.textContent == todayDate &&
        !cell.classList.contains("empty")
      ) {
        cell.classList.add("selected");
      }
    });
  }
}

function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText !== "" && selectedDate) {
    if (!tasksByDate[selectedDate]) {
      tasksByDate[selectedDate] = [];
    }
    const task = { text: taskText, completed: false };
    tasksByDate[selectedDate].push(task);
    taskInput.value = "";
    saveTasks();
    renderTasks();
  
  }
}

function toggleTask(date, index) {
  tasksByDate[date][index].completed =
    !tasksByDate[date][index].completed;
  saveTasks();
  renderTasks();
}

function deleteTask(date, index) {
  tasksByDate[date].splice(index, 1);
  saveTasks();
  renderTasks();
}

function saveTasks() {
  localStorage.setItem("tasksByDate", JSON.stringify(tasksByDate));
  generateCalendar(); 
}

function loadTasks() {
  const storedTasks = localStorage.getItem("tasksByDate");
  if (storedTasks) {
    try {
      const parsedTasks = JSON.parse(storedTasks);
      if (typeof parsedTasks === "object" && parsedTasks !== null) {
        tasksByDate = parsedTasks;
      } else {
        tasksByDate = {};
      }
    } catch (error) {
      tasksByDate = {};
    }
  }
}

function renderTasks() {
  taskList.innerHTML = "";
  if (selectedDate && tasksByDate[selectedDate]) {
    tasksByDate[selectedDate].forEach((task, index) => {
      const li = document.createElement("li");

      const taskText = document.createElement("span");
      taskText.textContent = task.text;
      if (task.completed) {
        taskText.classList.add("completed");
      }
      taskText.addEventListener("click", () =>
        toggleTask(selectedDate, index)
      );

      const deleteBtn = document.createElement("button");
      deleteBtn.innerHTML = "🗑️";
      deleteBtn.classList.add("delete-btn");
      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteTask(selectedDate, index);
      });

      li.appendChild(taskText);
      li.appendChild(deleteBtn);
      taskList.appendChild(li);
    });
  }
}



taskInput.addEventListener("keydown", function(event) {
if (event.key === "Enter") {
event.preventDefault(); 
addTask();
}
});


// Start
loadTasks();
const today = new Date();
currentYear = today.getFullYear();
currentMonth = today.getMonth();
generateCalendar(true); 
renderTasks();
