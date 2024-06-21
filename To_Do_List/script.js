document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const completedList = document.getElementById('completedList');

    addTaskBtn.addEventListener('click', addTask);

    function addTask() {
        const taskText = taskInput.value;
        if (taskText === '') return;

        const listItem = document.createElement('li');
        listItem.innerHTML = `<div class="task-heading">${taskText}</div>
                              <div class="task-details">Added on ${new Date().toLocaleString()}</div>
                              <button class="edit-btn">Edit</button>
                              <button class="complete-btn">Complete</button>
                              <button class="delete-btn">Delete</button>`;
        
        listItem.querySelector('.edit-btn').addEventListener('click', () => editTask(listItem, taskText));
        listItem.querySelector('.complete-btn').addEventListener('click', () => completeTask(listItem));
        listItem.querySelector('.delete-btn').addEventListener('click', () => deleteTask(listItem));

        taskList.appendChild(listItem);
        taskInput.value = '';

        animateListItem(listItem);
    }

    function editTask(listItem, oldText) {
        const newText = prompt('Edit your task:', oldText);
        if (newText !== null && newText.trim() !== '') {
            listItem.querySelector('.task-heading').textContent = newText;
            listItem.querySelector('.task-details').textContent = `Edited on ${new Date().toLocaleString()}`;
        }
    }

    function completeTask(listItem) {
        const completedItem = listItem.cloneNode(true);
        completedItem.querySelector('.complete-btn').remove(); // Remove the Complete button
        completedItem.querySelector('.edit-btn').remove(); // Remove the Edit button
        completedItem.querySelector('.task-details').textContent += ` - Completed on ${new Date().toLocaleString()}`;
        
        completedItem.querySelector('.delete-btn').addEventListener('click', () => deleteTask(completedItem));

        completedList.appendChild(completedItem);
        taskList.removeChild(listItem);

        animateListItem(completedItem);
    }

    function deleteTask(listItem) {
        listItem.classList.add('removing');
        setTimeout(() => {
            listItem.parentNode.removeChild(listItem);
        }, 300);
    }

    function animateListItem(listItem) {
        listItem.style.transform = 'scale(0.5)';
        listItem.style.opacity = '0';
        setTimeout(() => {
            listItem.style.transform = 'scale(1)';
            listItem.style.opacity = '1';
        }, 0);
    }
});
