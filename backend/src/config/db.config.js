require('dotenv').config()
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_DB_URL, {
    dbName: process.env.MONGO_DB_NAME 
}).then(() => {
    console.log("Mongo db connected successfully...")
}).catch(() => {
    console.log("error while connecting mongodb...")
    process.exit(1)
})