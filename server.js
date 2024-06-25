const express  = require('express');

const morgan = require('morgan');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const app = express();  

app.use(morgan('dev'));
app.use(express.json({}));
app.use(express.json({
    extended:true
}));

dotenv.config({
    path:'./config/config.env'
});






connectDB();
// https://localhost:3000/api/todo/auth/register
app.use('/api/todo/auth',require('./Routes/Routes_user'));

// http://localhost:3000/api/todo/
app.use('/api/todo',require('./Routes/Routes_Todo'));



const PORT = process.env.PORT || 3000;


app.listen(PORT,console.log("running"));

// app.listen(PORT);

