## Installation guide
1. In your terminal, navigate to the /backend directory.
2. Run 'npm install' to install all the packages and dependencies.
3. Create a file named '.env'.
4. Copy all the env variables from from '.env.example' and paste them in '.env' file.
5. Setup your '.env' file with all the env variables.
6. Run 'npm run dev' to start the server.

## Folder Structure
- node_modules
- src 
    - config
        - express.config.js 
        - db.config.js 
        - router.config.js 
    - modules
        - auth 
            - auth.controller.js 
            - auth.router.js 
            - auth.service.js 
            - auth.dto.js 
            - auth.model.js 
        - todo 
            - todo.controller.js 
            - todo.router.js 
            - todo.service.js 
            - todo.dto.js 
            - todo.model.js 
    - middleware 
      - errorHandler.middleware.js 
      - validator.middleware.js
    - services 
      - mail.service.js 
    - utilities 
- .env 
- .env.example 
- .gitignore 
- index.js 
- package-lock.json 
- package.json 
- readme.md 


## User Login Flow 
1. User fill registration form 
2. Activation Link will be sent to user mail (link contains activation token)
3. User clicks the link and user will be navigated to activation page in frontend 
4. As soon as activation page loads, user activation api will be called automatically (api call with activation token)
5. If activation api responds with status code 200 (200 means account has been activated and now user can login to his/her account), user need to be redirected to login page. If api doesnot respond with status code 200, user need to be able to click "resend activation link" button.
6. After clicking this button, user should be able to fill a form with field email only and after submitting form, new activation link will be sent to user's mail.
7. Again repeat the process and after user account has been activated with status code 200, user need to be redirected to login page.
8. Finally user logs, and user will be redirected to home page i.e todo page.

## Registration Form Fields 
1. First name (backend will only accept variable named "firstName")
2. Last name (backend will only accept variable named "lastName")
3. Email (backend will only accept variable named "email")
4. Password (backend will only accept variable named "password")
5. Confirm Password (this needs to be equal to password (only for frontend). Backend doesnot require confirm passowrd for now.)
6. Phone number (backend will only accept variable named "phone", this field is optional)

## Login Form Fields 
1. Email (backend will only accept variable named "email")
2. Password (backend will only accept variable named "password")

## Resend Activation Link Form Field 
1. Email (backend will only accept variable named "email")

# API
***BASE_URL: http://localhost:5000/api/v1***

Resgister: BASE_URL/auth/register
Activation: BASE_URL/auth/activation/__token__
Login: BASE_URL/auth/login