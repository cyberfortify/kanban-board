let taskData = {}
const todo = document.querySelector('#todo');
const progress = document.querySelector('#progress');
const done = document.querySelector('#done');
const columns = [todo, progress, done];
let dragElement = null;


function addTask(title, desc, column) {
    const div = document.createElement('div');
    div.classList.add('task');
    div.setAttribute('draggable', 'true');
    div.innerHTML = `
    <h2>${title}</h2>
    <p>${desc}</p>
    <button >Delete</button>
`;
    column.appendChild(div);
    div.addEventListener('drag', (e) => {
        dragElement = div;
    });

    const deleteButton = div.querySelector('button');
    deleteButton.addEventListener('click', () => {  
        div.remove();
        updateTaskCount();
    });
    return div;
}

function updateTaskCount() {
    columns.forEach(col => {
        const task = col.querySelectorAll('.task');
        const count = col.querySelector('.right');

        taskData[col.id] = Array.from(task).map(t => {
            return {
                title: t.querySelector('h2').innerText,
                desc: t.querySelector('p').innerText
            }
        });
        localStorage.setItem('taskData', JSON.stringify(taskData));

        count.innerText = task.length;
    });
}



if (localStorage.getItem('taskData')) {
    const data = JSON.parse(localStorage.getItem('taskData'));

    for (const col in data) {
        const column = document.querySelector(`#${col}`);
        data[col].forEach(task => {
            addTask(task.title, task.desc, column);
        })

    }
    updateTaskCount();
}

const tasks = document.querySelectorAll('.task');
tasks.forEach(task => {
    task.addEventListener('drag', (e) => {
        dragElement = task;
    });
});

function addDragEventsOnColumn(column) {
    column.addEventListener('dragenter', (e) => {
        e.preventDefault();
        column.classList.add('hover-over');
    });
    column.addEventListener('dragleave', (e) => {
        e.preventDefault();
        column.classList.remove('hover-over');
    });
    column.addEventListener('dragover', (e) => {
        e.preventDefault();
    });
    column.addEventListener('drop', (e) => {
        e.preventDefault();

        column.appendChild(dragElement);
        column.classList.remove('hover-over');

        updateTaskCount();

    });

}

addDragEventsOnColumn(todo);
addDragEventsOnColumn(progress);
addDragEventsOnColumn(done);

const toggleModalButton = document.querySelector('#toggle-modal');
const bgModal = document.querySelector('.bg');
const modal = document.querySelector('.modal');
const addTaskButton = document.querySelector('#add-new-task');

toggleModalButton.addEventListener('click', () => {
    modal.classList.toggle('active');
});

bgModal.addEventListener('click', () => {
    modal.classList.remove('active');
});

addTaskButton.addEventListener('click', () => {

    const taskTitle = document.querySelector('#task-title-input').value;
    const taskDesc = document.querySelector('#task-desc-input').value;

    addTask(taskTitle, taskDesc, todo);
    updateTaskCount();
    modal.classList.remove('active');

    document.querySelector('#task-title-input').value="";
    document.querySelector('#task-desc-input').value="";
});


