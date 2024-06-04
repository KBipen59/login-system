console.log(window.location.search)
const token = window.location.search.split('?token=')[1]

const messageDiv = document.querySelector('#activation-message')

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

const updateLoadingMsg = () => {
    messageDiv.innerHTML = '<p>Loading...</p>'
}

const updateSuccessMsg = (msg) => {
    messageDiv.innerHTML = `
    <div class="message text-center">
        <h1 class="display-2">${msg}</h1>
    </div> 
    <a type="button" class="btn btn-primary btn-lg" href="http://127.0.0.1:5500/frontend/login/">Login</a>
    `
}

const updateErrorMsg = () => {
    messageDiv.innerHTML = `
    <div class="message text-center">
        <h1 class="display-2">Failed to verify your account</h1>
    </div>
    <div class="text-center">
        <p>Resend Activation Link </p>
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
            Send
        </button>
    </div>
    `
}


// /localhost:5000/api/v1/auth/activation/kanjdsfkjnaskndflkaskd

const BASE_URL = 'http://localhost:5000/api/v1/'

async function fetchApi() {
    try{
        updateLoadingMsg()
        const response = await fetch(`${BASE_URL}auth/activation/${token}`)
        const data = await response.json()

        if(!response.ok){
            throw new Error(data.message)
        }

        updateSuccessMsg(data.message)
        // Success 
    }catch(error){
        updateErrorMsg()
        if(error.message.includes("jwt")){
            showToast("Token is Invalid or Token might be expired")
            // messageUpdate()
        }else{
            showToast(error)
        }
    }
}
fetchApi()

const form = document.querySelector('.email-form')


form.addEventListener('submit', function (e) {
    e.preventDefault()
    
    const emailField = form.querySelector('.form-control')
    const email = form.querySelector('.form-control').value
    const sendBtn = form.querySelector('.send-btn')
    const emailReg = /^[\w+.-]+@([\w-]+\.)+[\w-]{2,4}$/

    if(!email){
        showToast('Please fill the email field')
        return
    }
    if (!email.match(emailReg)) {
        showToast("Please enter a valid Email address");
        return;
    }
    sendEmail(email , emailField , sendBtn)
})

async function sendEmail(email , emailField , sendBtn) {
    try{ 
        sendBtn.disabled = true
        const response = await fetch(`${BASE_URL}auth/resend-activation-link` , {
            method: 'PUT',
            body: JSON.stringify({
                email: email
            }),
            headers : {
                "Content-Type" : "application/json"
            }
        })
        const data = await response.json()
        if(!response.ok) {
            throw new Error(data.message)
        }
        sendBtn.disabled = false
        emailField.value = ''
        showToast('Activation Link has been sent to your email', 'success')
    }catch(error){
        console.log(error)
        showToast(error)
        sendBtn.disabled = false
    }
}



