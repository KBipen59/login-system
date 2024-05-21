const http = require('http')
const app = require('./src/config/express.config')
require('dotenv').config()


const server = http.createServer(app)
const PORT = process.env.PORT


server.listen(PORT, (err) => {
    if(!err){
        console.log(`Server is running on port ${PORT}`);
        console.log('Press CTRL+C to stop the server')
    }
})







 


