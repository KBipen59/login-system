const form = document.querySelector('.form')
const passwordToggler = document.querySelectorAll('.password-toggle')
const pwds = document.querySelectorAll('.pwd')

passwordToggler.forEach((toggler)=> {
    toggler.addEventListener('click', function() {

        pwds.forEach((pwd) => {
            if(pwd.getAttribute("type") === "password"){
                pwd.setAttribute("type" ,"text")
                passwordToggler.forEach((tog)=>{
                    tog.innerText = "hide"
                })
            }else{
                pwd.setAttribute("type" ,"password")
                passwordToggler.forEach((tog)=>{
                    tog.innerText = "show"
                })
            }                
        })
    })
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

form.addEventListener('submit',function (e) {
    e.preventDefault()
    const firstName = form.querySelector('#first-name')
    const lastName = form.querySelector('#last-name')
    const email = form.querySelector('#email')
    const password = form.querySelector('#password')
    const confirmPassword = form.querySelector('#confirm-password')
    const phone = form.querySelector('#phone')

    const user = {
        firstName : firstName.value , 
        lastName : lastName.value , 
        email : email.value ,   
        password : password.value ,
        confirmPassword : confirmPassword.value, 
        phone : phone.value
    }

    if(!user.firstName || !user.lastName || !user.email || !user.password || !user.confirmPassword ){
        showToast("All fields required")
        return
    }

    if(user.firstName.length < 2 || user.firstName.length > 50 ){
        showToast('First name must be between 2 to 50 characters')
        return 
    }
    if(user.lastName.length < 2 || user.lastName.length > 10 ){
        showToast('Last name must be between 2 to 50 characters')
        return 
    }

    const emailReg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    if (!user.email.match(emailReg)) {
        showToast("Please enter a valid Email address");
        return;
    }
    if(user.password.length < 8 || user.password.length > 15 ){
        showToast('password must be between 8 to 15 characters')
        return 
    }

    if(!user.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/)){
        showToast('Password must contain a-z, A-Z, 0-9 and special character like: @, #, $, etc. ')
        return
    }
    if(user.password != user.confirmPassword ){
        showToast("Password doesn't match")
        return
    }
    if(user.phone){
        if(user.phone.length < 10 || user.phone.length > 10){
            showToast('Phone number must be exactly og 10 digits')
        return
        }
    }
    console.log(user)
    showToast('Registration Sucessfull', 'success')

    // POST request to api
} )
