const mongoose = require('mongoose');
const express = require('express')
const router = require('./routers/index.js')
const cors = require('cors')
const fileUpload = require('express-fileupload')


//mongoose.connect('mongodb://127.0.0.1:27017/online-shop')

mongoose.connect('mongodb+srv://skmykolai:Qwe*1337@online-shop.9eld8ja.mongodb.net/')
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('Error connecting to MongoDB', error));

const app = express()

app.use(express.static('public'));
app.use(fileUpload({}))
app.use(cors())
app.use('/api', router)

let port = process.env.PORT || 5000

app.listen(port, ()=>{
    console.log(`app is running on port${port}`)
})