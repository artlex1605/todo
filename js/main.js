// Находим элементы на странице
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

if (localStorage.getItem('tasks')) {
  tasks = JSON.parse(localStorage.getItem('tasks'));
  tasks.forEach((task) => renderTask(task));
}

checkEmptyList();

form.addEventListener('submit', addTask);
tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', doneTask);

function addTask(event) {
  // Отменяем отправку формы
  event.preventDefault();

  // Достаём текст задачи из input
  const taskText = taskInput.value;

  // Описываем задачу в виде объекта
  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };

  // Добавляем объект в массив с задачами
  tasks.push(newTask);

  // Сохраняем список задач в хранилище браузера localStorage
  saveToLocalStorage();

  renderTask(newTask);

  // Очищаем поле ввода и возвращаем на него фокус
  taskInput.value = '';
  taskInput.focus();

  checkEmptyList();
}

function deleteTask(event) {
  // Проверяем если клик был НЕ по кнопке "удалить задачу (крестик)"
  if (event.target.dataset.action !== 'delete') return;

  const parentNode = event.target.closest('.list-group-item');

  // Определяем ID задачи
  const id = +parentNode.id;

  // Находим индекс задачи в массиве
  const index = tasks.findIndex((task) => task.id === id);

  // Удаляем задачу из массива с задачами
  tasks.splice(index, 1);

  // Сохраняем список задач в хранилище браузера localStorage
  saveToLocalStorage();

  // Удаляем задачу из разметки
  parentNode.remove();

  checkEmptyList();
}

function doneTask(event) {
  // Проверяем если клик был НЕ по кнопке "задача выполнена (галочка)"
  if (event.target.dataset.action !== 'done') return;

  const parentNode = event.target.closest('.list-group-item');

  // Находим id задачи в массиве задачами и меняем у него статус на выполнено
  const id = +parentNode.id;
  const task = tasks.find((task) => task.id === id);
  task.done = !task.done;

  // Сохраняем список задач в хранилище браузера localStorage
  saveToLocalStorage();

  parentNode.querySelector('.task-title').classList.toggle('task-title--done');
}

function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyListElement = `
        <li id="emptyList" class="list-group-item empty-list">
					<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
					<div class="empty-list__title">Список дел пуст</div>
				</li>`;
    tasksList.insertAdjacentHTML('afterbegin', emptyListElement);
  }

  if (tasks.length > 0) {
    const emptyListEl = document.querySelector('#emptyList');
    emptyListEl ? emptyListEl.remove() : null;
  }
}

function saveToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task) {
  // Формируем CSS класс
  const cssClass = task.done ? 'task-title task-title--done' : 'task-title';

  // Формируем разметку для новой задачи
  const taskHTML = `
       <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
         <span class="${cssClass}">${task.text}</span>
         <div class="task-item__buttons">
           <button type="button" data-action="done" class="btn-action">
             <img src="./img/tick.svg" alt="Done" width="18" height="18">
           </button>
           <button type="button" data-action="delete" class="btn-action">
             <img src="./img/cross.svg" alt="Done" width="18" height="18">
           </button>
         </div>
       </li>
 `;

  // Добавляем разметку задачи
  tasksList.insertAdjacentHTML('beforeend', taskHTML);
}
