console.log(window.location.search)
const token = window.location.search.split('?token=')[1]

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

// /localhost:5000/api/v1/auth/activation/kanjdsfkjnaskndflkaskd

const BASE_URL = 'http://localhost:5000/api/v1/'
async function fetchApi() {
    try{
        const response = await fetch(`${BASE_URL}auth/activation/${token}`)
        const data = await response.json()
        if(!response.ok){
            throw new Error(data.message)
        }
        // Success 
    }catch(error){
        if(error.message.includes("jwt")){
            showToast("Token is Invalid")
        }else{
            showToast(error)
        }
    }
}
fetchApi()



// todo 
// dom load ---> your account is being activated, please wait....
// if success ---> show toast message and a button to redirect to log in page
// if fail ---> dom message "faild to verify your account " and a button to resend the activation link 
// on button clicked ----> a pop up with a form caontaining the email field and a submit button 
// on submit button clicked an api call must be done to resend the activation link Base url + auth/resend-activation-link Put request with a body containing the email

