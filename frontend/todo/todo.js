const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

const showToast = (message, type='error') => {
    Toastify({
        text: message,
        duration: 3500,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "center", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: type === "success" ? "#208B59" : "#E74034",
        },
        onClick: function(){} // Callback after click
      }).showToast();
}

const token = localStorage.getItem('todo-token')

if(!token){
    window.location.href = "https://login-system-bipen.netlify.app/login/"
}

// fetching all todo lists from backend

const BASE_URL = 'https://login-system-backend-et8k.onrender.com/api/v1/'
let url = `${BASE_URL}todo/`

async function fetchAllTodos (url) {
    try{
        const response = await fetch( url , {
            headers: {Authorization: `bearer ${token}`}
        })
        if(response.status === 401){
            window.location.href ='https://login-system-bipen.netlify.app/login/'
        }
        const data = await response.json()

        localStorage.setItem('todos', JSON.stringify(data.result))
        // todo: store all result array as todos in local storage

        updateUi(data.result)

    }catch(error){
        console.log(error)
    }
}
fetchAllTodos(url)

function formatTodoStatus(status) {
    let formatedStatus = {}

    switch (status){
        case "in_progress" :
            formatedStatus.name = 'In Progress'
            formatedStatus.bgColor = "orange"
            break;
        case "in_review" : 
            formatedStatus.name = "In Review"
            formatedStatus.bgColor = "blue"
            break;
        case "complete" : 
            formatedStatus.name = 'Completed'
            formatedStatus.bgColor = 'green'
            break;
        default : 
            formatedStatus.name = 'Pending'
            formatedStatus.bgColor = 'grey'
    }

    return formatedStatus
}
const todoDiv = document.querySelector('.todo-lists')
// for updating 
function updateUi (todos) {
    const uiTodos = todos.map((todo, index)=>{
        return  `<div class="accordion-item">
        <h2 class="accordion-header" id="panelsStayOpen-headingTwo">
          <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-${todo._id}" aria-expanded="true" aria-controls="panelsStayOpen-collapseTwo">
            <div class="todo__details w-100">
                <span class="sn">${index + 1}</span>
                <span>${todo.title}</span>
                <span>
                    <span style="background-color: ${formatTodoStatus(todo.status).bgColor}; color: white; padding: 4px; border-radius: 4px; font-size: 14px" >
                        ${formatTodoStatus(todo.status).name}
                    </span> 
                </span>
            </div>
          </button>
        </h2>
        <div id="panelsStayOpen-${todo._id}" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
          <div class="accordion-body">
            <div>
              ${todo.description}
            </div>
            <div class="accordion-btn__wrap">
                <button type="submit" data-id="${todo._id}" data-mdb-button-init data-mdb-ripple-init class="btn btn-danger delete-btn">Delete
                    <div class="spinner-border spinner-border-sm " role="status">
                        <span class="visually-hidden"></span>
                    </div>
                </button>
                <button data-id="${todo._id}" class="btn btn-success edit-btn" data-bs-target="#editTodoModelToggle" data-bs-toggle="modal">
                    Edit
                </button>
            </div>
          </div>
        </div>
      </div>`
    })
    todoDiv.innerHTML = uiTodos.join(' ')
    deleteTodo()
    populateEditForm()
}

const todoForm = document.querySelector('.add-todo')
const addMessage = document.querySelector('.message.add-message')

function message (message ,messageDiv) {
    messageDiv.innerHTML = `<h6 class="fs-5 p-3">${message}</h6>`
    setTimeout(function () {
        messageDiv.innerHTML = ''
    },3000)
}

// add new Todo
todoForm.addEventListener('submit' , async function (e) {
    e.preventDefault()
    const todoTitle = todoForm.querySelector('.title')
    const todoDesc = todoForm.querySelector('.desc')
    const sendBtn = todoForm.querySelector('.send-btn')

    const todoItem = {
        title : todoTitle.value,
        description : todoDesc.value,
    }
    if(!todoItem.title){
        message("Required Title", addMessage)
        return
    }
    if(todoItem.title.length < 2 || todoItem.title.length > 50 ){
        message('Title must be between 2-50 character', addMessage)
        return
    }
    if(todoItem.description && todoItem.description.length > 150 ){
        message('Description must be less than 150 characters' , addMessage)
        return
    }
    try{
        sendBtn.disabled = true
        const response = await fetch(`${BASE_URL}todo/`,{
            headers : {
                "Content-Type" : "application/json",
                Authorization: `bearer ${token}`
            }, 
            method: "POST",
            body: JSON.stringify(todoItem)
        })
        const data = await response.json()
        if(!response.ok){
            throw new Error(data.message) 
        }
        // pushing the new object in array[0] index
        const newArray = []
        newArray.push(data.result)
        let storageTodo = localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : [];
        storageTodo.map((listItem) => {
            newArray.push(listItem)
        })
        updateUi(newArray)
        localStorage.setItem('todos' , JSON.stringify(newArray))

        sendBtn.disabled = false
        showToast(data.message , 'success')
        // clearinf the input field after addition
        todoDesc.value = ''
        todoTitle.value = ''
    }catch(error){
        sendBtn.disabled = false 
        showToast(error)
    }

})

// delete todos 
function deleteTodo () {
    const deleteBtns = document.querySelectorAll('.delete-btn')
    deleteBtns.forEach((btn) => {
        btn.addEventListener('click' , async function (e) {
            const id = btn.getAttribute("data-id")
            try{
                btn.disabled = true
                const response = await fetch(`${BASE_URL}todo/`, {
                    method : "DELETE",
                    body : JSON.stringify({
                        id : id
                    }), 
                    headers : {
                        Authorization: `bearer ${token}`,
                        "Content-Type" : "application/json"
                    }
                })
                const data = await response.json()
                if(!response.ok){
                    throw new Error(data.message)
                }

                let todos = localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : []
                const filteredTodos = todos.filter((todo) => {
                    if(todo._id !== id){
                        return todo
                    }
                })
                localStorage.setItem('todos',JSON.stringify(filteredTodos))
                updateUi(filteredTodos)
                btn.disabled = false
                showToast('Sucessfully Deleted', "success")
                // show toast
                // update ui
                    // ---> get all todos from loalstorage
                    // ---> find or filter to delete from todos and delete and update ui and update localstorage
            }catch(error){
                btn.disabled = false
                showToast(error)
            }
        })
    })
}

// populate Todo form
function populateEditForm () {
    const editBtn = document.querySelectorAll('.edit-btn')
    editBtn.forEach((btn)=> {
        btn.addEventListener('click',function(e) {
            const id = btn.getAttribute('data-id')
            let todos = localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : []
            const todo = todos.find((todo) => {
                if(todo._id === id){
                    return todo
                }
            })
            const title = document.querySelector('.edit-form .title')
            const description = document.querySelector('.edit-form .desc') 
            const option = document.querySelector('.edit-form .option-selection') 
            const editForm = document.querySelector('.edit-form')
            editForm.setAttribute('data-id', id)

            title.value = todo.title
            description.value = todo.description
            option.value = todo.status
        })
    })
}

// edit Todo 
const editMessageDiv = document.querySelector('.message.edit-message')
const editForm = document.querySelector('.edit-form')
editForm.addEventListener('submit' , async function(e) {
    e.preventDefault()
    const title = editForm.querySelector('.title') 
    const description = editForm.querySelector('.desc') 
    const option = editForm.querySelector('.option-selection')
    const id = editForm.getAttribute('data-id')
    const sendBtn = editForm.querySelector('.send-btn')
    const formValue = {
        title : title.value, 
        description : description.value,
        status : option.value,
        id : id
    }
    if(!formValue.title){
        message("Required Title" , editMessageDiv)
        return
    }
    if(formValue.title.length < 2 || formValue.title.length > 50 ){
        message('Title must be between 2-50 character', editMessageDiv)
        return
    }
    if(formValue.description && formValue.description.length > 150 ){
        message('Description must be less than 150 characters', editMessageDiv)
        return
    }
    try {
        sendBtn.disabled = true
        const response = await fetch(`${BASE_URL}todo/`,{
            headers: {
                "Content-Type" : "application/json",
                Authorization: `bearer ${token}`,
            },
            method : "PUT",
            body : JSON.stringify(formValue)
        })
        if(response.status === 401){
            window.location.href ='https://login-system-bipen.netlify.app/login/'
        }
        const data = await response.json()
        if(!response.ok){
            throw new Error(data.message)
        }
        sendBtn.disabled = false
        showToast('Succesfully Edited', "success")
        let todos = localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : []

        const editedTodo = todos.map((todo) => {
            if(todo._id === data.result._id){
                return data.result
            }else{
                return todo
            }
        })
        localStorage.setItem('todos', JSON.stringify(editedTodo))
        updateUi(editedTodo)

    } catch (error) {
        sendBtn.disabled = false 
        showToast(error)
    }

})


// filtering todo with the select option

const selectOptionStatus = document.querySelector('.status-select')
const selectOptionSort = document.querySelector('.sort-select')

selectOptionStatus.addEventListener('change', function () {
    if(url.includes('?')){
        if(url.includes('&status')){
            let splitedUrl = url.split('&')
            if(selectOptionStatus.value === 'all'){
                fetchAllTodos(splitedUrl[0])
            }else {
                url = splitedUrl[0]+`&status=${selectOptionStatus.value}`
                fetchAllTodos(url)
            }
        }else {
            url = url+`&status=${selectOptionStatus.value}`
            fetchAllTodos(url)
        }
    }else {
        if(selectOptionStatus.value === "all"){
            fetchAllTodos(url)
        }else {
            url = url+`?status=${selectOptionStatus.value}`
            fetchAllTodos(url)
        }
    }

})



selectOptionSort.addEventListener('change', function (e) {
    const key = selectOptionSort.value.split('-')[1]
    const value = selectOptionSort.value.split('-')[0]
    
    if(url.includes('?')){
        if(url.includes('?createdAt') || url.includes('?title')){
            fetchAllTodos(`${BASE_URL}todo/?${key}=${value}`)
            return
        }
        if(url.includes('&')){
            const splitedUrl = url.split('&')
            url = splitedUrl[0]+`&${key}=${value}`
            fetchAllTodos(url)
        }else {
            url = url+`&${key}=${value}`
            fetchAllTodos(url)
        }
    }else {
        url = url+`?${key}=${value}`
        fetchAllTodos(url)
    }
})



// Here's a more modular and clearer way to achieve this functionality by using URLSearchParams to manage query parameters:

// const BASE_URL = 'http://localhost:5000/api/v1/todo/';
// let params = new URLSearchParams();

// async function fetchAllTodos(url, params) {
//     try {
//         const fullUrl = `${url}?${params.toString()}`;
//         const response = await fetch(fullUrl, {
//             headers: { Authorization: `bearer ${token}` }
//         });

//         if (response.status === 401) {
//             window.location.href = 'https://login-system-bipen.netlify.app/login/';
//             return;
//         }

//         const data = await response.json();
//         console.log(data);
//         localStorage.setItem('todos', JSON.stringify(data.result));
//         updateUi(data.result);
//     } catch (error) {
//         console.log(error);
//     }
// }

// fetchAllTodos(BASE_URL, params);

// const selectOptionStatus = document.querySelector('.status-select');
// const selectOptionSort = document.querySelector('.sort-select');

// selectOptionStatus.addEventListener('change', function () {
//     const status = selectOptionStatus.value;

//     if (status === 'all') {
//         params.delete('status');
//     } else {
//         params.set('status', status);
//     }

//     fetchAllTodos(BASE_URL, params);
// });

// selectOptionSort.addEventListener('change', function () {
//     const [value, key] = selectOptionSort.value.split('-');

//     params.set(key, value);

//     fetchAllTodos(BASE_URL, params);
// });


// for log-in page 
// save userdata to the localstorage without token 





// log out 
// log-out btn onclicked ---> localstorage.remove token
//  localstorage todo remove garne 
//  redirect user to home page
//  remove user data from local storage

// for user profile 
function headerUi () {
    const userProfile = document.querySelector('.user-email')
    const userData = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : []
    const userEmail = userData.email
    console.log(userData)
    userProfile.innerHTML = `<h5 class="fw-bold fst-italic">${userEmail} </h5>`
}
headerUi()

// for logging out
const logOutBtn = document.querySelector('.log-out')

logOutBtn.addEventListener('click' , function() {
    localStorage.removeItem('todo-token')
    localStorage.removeItem('todos')
    localStorage.removeItem('userData')
    window.location.href = `https://login-system-bipen.netlify.app/`
    showToast('Logged Out' , "success")
})

