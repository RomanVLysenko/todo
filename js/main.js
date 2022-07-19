// Находим элементы на странице

// Находим форму
const form = document.querySelector('#form');

// Находим инпут
const taskInput = document.querySelector('#taskInput');

// Находим список задач
const tasksList = document.querySelector('#tasksList');

// Находим список дел пуст
const emptyList = document.querySelector('#emptyList');

// отслеживание события отправки формы через кнопку и энтер
form.addEventListener('submit', addTask);

// удаление задачи
tasksList.addEventListener('click', deleteTask);

// отмечаем задачу завершенной
tasksList.addEventListener('click', doneTask);

// создаём массив для хранения данных
let tasks = [];

// если данные уже сохранялись в локал сторедж, формируем массив данных
if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    // отображаем задачи
    tasks.forEach((task) => renderTask(task));
}

checkEmptyList();

// // востанавливаем локал сторедж если данные были ранее сохранены
// if (localStorage.getItem('taskHTML')) {
//     tasksList.innerHTML = localStorage.getItem('taskHTML');
// }

function deleteTask(event) {
   // слушаем клик на строке, если он непопадает на delete, то выходим, иначе удаляе задачу
   if (event.target.dataset.action !== 'delete') return;
    // closest - ищит внешний селектор 
    const parenNode = event.target.closest('.list-group-item');

    // определяем id задачи
    const id = Number(parenNode.id);

    // находим индекс задачи в массиве (!условие преобразовано в стрелочную функцию)
    const index = tasks.findIndex((task) => task.id === id);

    // удаляем задачу (способ 1) из массива с задачами 
    // tasks.splice(index, 1);

    // удаляем задачу (способ 2) из массива через фильтрацию массива 
    tasks = tasks.filter((task) => task.id !== id);

    // удаляем задачу из разметки
    parenNode.remove();  

    saveToLocalStorage();
  
    // // показываем блок пустых дел если удалены все задачи (удаляем у блока класс инвизибл из таблицы стилей)
    // if(tasksList.children.length === 1) {
    // emptyList.classList.remove('none');
    // }
    //    saveHTMLtoLS();
    checkEmptyList()
}

function addTask (event) {
    // Отменяем отправку формы (чтобы не перегружалась страница по дефолту)
    event.preventDefault();

    // Достаём текст задачи из поля ввода
    const taskText = taskInput.value;

    // Описываем задачу в виде объекта date.now - текущее время в мс
    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false,
    };

    // добавляем задачу в массив с задачами push - добавляет в конец массива
    tasks.push(newTask);

    // сохраняем задачу в локальное хранилище браузера
    saveToLocalStorage();

    // отображаем задачу на странице
    renderTask(newTask);

    // Очищаем поле ввода и возвращаем на него фокус
    taskInput.value = "";
    taskInput.focus();

    // // скрываем блок пустых дел если добавлена задача (присваеваем блок класс инвизибл из таблицы стилей)
    // if(tasksList.children.length > 1) {
    //     emptyList.classList.add('none');
    // }
    // saveHTMLtoLS();
    checkEmptyList()
}

function doneTask(event) {
    // проверяем что клик был не по кнопке выполнено (имеет атрибут датасет done) выходи иначе добавляем
    if (event.target.dataset.action !== "done") return;

    // находим родительскую ноду
    const parentNode = event.target.closest('.list-group-item');

    // определяем ID задачи
    const id = Number(parentNode.id);

    // const task = tasks.find(function (task) {
    //     if (task.id === id) {
    //         return true
    //     }
    // })

    // то же что выше, но в виде стрелочной функции
    const task = tasks.find( (task) => task.id === id);

    // меняем статус задачи
    task.done = !task.done;

    saveToLocalStorage();

    // ищём вложенный элемент с селектором таск титиле
    const taskTitle = parentNode.querySelector('.task-title');
    // добавляем выполненной задаче класс с подчерк.. toggle - добавляет и убирает add - просто добавляет
    taskTitle.classList.toggle('task-title--done');
    // saveHTMLtoLS();
}

function checkEmptyList() {
    if (tasks.length === 0) {
        const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
        <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
        <div class="empty-list__title">Список дел пуст</div>
    </li>`;
    tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
    }

    if (tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task){
        // формируем css класс выполнения задачи
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
</li>`;

   // Размещаем задачу на странице
   tasksList.insertAdjacentHTML('beforeend', taskHTML);
}

// сохранение разметки в локалсторедж
// function saveHTMLtoLS(){
//     localStorage.setItem('taskHTML', tasksList.innerHTML);
// }



