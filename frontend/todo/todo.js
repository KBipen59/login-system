const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

const todoForm = document.querySelector('.add-todo')
const messageDiv = document.querySelector('.message')

function message (message) {
    messageDiv.innerHTML = `<h6 class="fs-5 p-3">${message} </h6>`
    setTimeout(function () {
        messageDiv.innerHTML = ''
    },3000)
}

todoForm.addEventListener('submit' , function (e) {
    e.preventDefault()
    const todoTitle = todoForm.querySelector('.title')
    const todoDesc = todoForm.querySelector('.desc')

    const todoItem = {
        title : todoTitle.value,
        description : todoDesc.value,
    }
    if(!todoItem.title){
        message("Required Title")
        return
    }
    if(todoItem.title.length < 2 || todoItem.title.length > 50 ){
        message('Title must be between 2-50 character')
        return
    }
    if(todoItem.description && todoItem.description.length > 150 ){
        message('Description must be less than 150 characters')
        return
    }
    
})