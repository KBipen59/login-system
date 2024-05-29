const BASE_URL = 'http://localhost:5000/api/v1/'
const loginForm = document.querySelector('.logIn-form')
const email = loginForm.querySelector('#email')
const password = loginForm.querySelector('#password')
const passwordToggler = document.querySelector('.password-toggle')
const eyeIcon = document.querySelector('.bi-eye-fill')
const eyeSlash = document.querySelector('.bi-eye-slash')

passwordToggler.addEventListener('click', function() {
    if(password.getAttribute("type") === "password"){
        password.setAttribute("type" ,"text")
        eyeIcon.style.visibility = 'visible'
        eyeIcon.style.opacity = 1
        eyeSlash.style.visibility = 'hidden'
        eyeSlash.style.opacity = 0
    }else{
        password.setAttribute("type" ,"password")
        eyeIcon.style.visibility = 'hidden'
        eyeIcon.style.opacity = 0
        eyeSlash.style.visibility = 'visible'
        eyeSlash.style.opacity = 1
    }
})

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

loginForm.addEventListener('submit', function (e) {
    e.preventDefault()
    
    const userLogin = {
        email: email.value,
        password: password.value
    }
    loginApi(userLogin)
})

async function loginApi (loginInfo) {
    try {
        const response = await fetch(`${BASE_URL}auth/login`, {
        method: "POST",
        body: JSON.stringify(loginInfo),
        headers: {
            "Content-Type": "application/json"
        }
        
    }) 
    console.log(response)
    const data = await response.json()
    if(!response.ok){
        throw new Error(data.message)
    }
    showToast('sucessfull')
    // console.log(data)
    const token = data.result.accessToken
    window.location.href = `http://127.0.0.1:5500/frontend/todo/?=${token}`
    // showToast(`${data.message}` , "success")
    }catch (error){
        console.log("Error:",error)
        showToast(`${error}`)
    }
}