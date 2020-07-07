(() => {
    'use strict';

    let createForm  = document.querySelector('#createForm'),
        createInput = document.querySelector('#createInput'),
        createBtn   = document.querySelector('#createBtn'),
        todoList    = document.querySelector('#todoList'),
        doneList    = document.querySelector('#doneList');

    let tasks = getData();
    tasks.forEach(task => {
        createTask(todoList, task);
    })

    createForm.addEventListener('submit', (e) => {
        e.preventDefault()

        createTask(todoList,  {
            id   : null,
            text : createInput.value
        })
    
        createInput.value = '';
        createBtn.setAttribute('disabled', true)
    })

    createInput.addEventListener('input', () => {
        if (createInput.value.length > 3) {
            createBtn.removeAttribute('disabled')
        } else {
            createBtn.setAttribute('disabled', true)
        }
    })

    function createTask(target, task) {
        let li = document.createElement('li')
        li.classList.add('list-group-item')

        if (target.id == `todoList`) {

            if (!task.id) {
                task.id = Date.now();

                let tasks = getData();
                tasks.push(task);
                setData(tasks);
            }

            li.innerHTML = `
            <div class="input-group mb-3">
                <div class="input-group-prepend">
                    <div class="input-group-text">
                        <input type="checkbox" class="checkbox">
                    </div>
                </div>
                <input type="text" 
                        class="form-control editInput" 
                        disabled 
                        value="${task.text}" 
                        data-default="${task.text}"
                        data-id="${task.id}">
                <div class="input-group-append">
                    <button type="button" class="btn btn-primary editBtn">Edit</button>
                    <button type="button" class="btn btn-success saveBtn" hidden>Save</button>
                    <button type="button" class="btn btn-secondary cancelBtn" hidden>Cancel</button>
                    <button type="button" class="btn btn-danger deleteBtn">Delete</button>
                </div>
            </div>`
        } else {
            li.innerHTML = `${task.text}`
        }

        target.append(li);

        if (target.id == `todoList`) {
            li.querySelector('.checkbox').addEventListener('change', (e) => {
                let parent = e.target.closest('li');
    
                createTask(doneList, {
                    id : null,
                    text : parent.querySelector('.editInput').value
                })
                removeTask(parent)
            })

            li.querySelector('.editBtn')
              .addEventListener('click', editTask)

            li.querySelector('.saveBtn')
              .addEventListener('click', saveTask)

            li.querySelector('.cancelBtn')
              .addEventListener('click', cancelTask)

            li.querySelector('.deleteBtn')
              .addEventListener('click', e => {
                  let parent = e.target.closest('li');
                  removeTask(parent);
              })
        }
    }

    function removeTask(parent) {
        let id    = parent.querySelector('.editInput').getAttribute('data-id'),
            tasks = getData()
            
        tasks.forEach((task, index) => {
            if (task.id == id) {
                tasks.splice(index, 1)
            }
        })

        setData(tasks)

        parent.remove()
    }

    function editTask(e) {
        let parent = e.target.closest('li');
        toggleVisibility(parent)
        parent.querySelector('.editInput').removeAttribute('disabled');
        parent.querySelector('.checkbox').setAttribute('disabled', true);
    }

    function saveTask(e) {
        let parent = e.target.closest('li'),
            input  = parent.querySelector('.editInput'),
            id     = input.getAttribute('data-id');

        if (!input.value.length) {
            removeTask(parent);
            return;
        }

        let tasks = getData();
        tasks = tasks.map(task => {
            if (task.id == id) {
                task.text = input.value
            }
            return task;
        })
        setData(tasks);

        toggleVisibility(parent);
        input.setAttribute('data-default', input.value);
        input.setAttribute('disabled', true);
        parent.querySelector('.checkbox').removeAttribute('disabled');
    }

    function cancelTask(e) {
        let parent = e.target.closest('li'),
            input  = parent.querySelector('.editInput')

        toggleVisibility(parent);

        input.value = input.getAttribute('data-default');
        input.setAttribute('disabled', true);
        parent.querySelector('.checkbox').removeAttribute('disabled');
    }

    function toggleVisibility(parent) {
        let selectors = [
                '.editBtn',
                '.deleteBtn',
                '.saveBtn',
                '.cancelBtn']
        
        selectors.forEach(selector => {
            let elem = parent.querySelector(selector)
            elem.hidden = !elem.hidden;
        })
    }

    function getData() {
        let data = localStorage.getItem('tasks');
        return data ? JSON.parse(data) : [];
    }

    function setData(data) {
        data = JSON.stringify(data);
        localStorage.setItem('tasks', data);
    }

})();