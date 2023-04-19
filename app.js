require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose');
const logger=require('morgan');
const expressLayouts=require('express-ejs-layouts');
const path=require('path');
const session =require('express-session');
const cookieParser=require('cookie-parser');
const nocache=require('nocache')

const connectDb=require('./config/db')


const userRoute=require('./routes/userRoute');
const adminRoute=require('./routes/adminRoute');

const app=express();
const PORT=process.env.PORT || 8080;

// view engine setup
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))
app.set('layout','layouts/userLayout') // set default layout for user pages
app.use(expressLayouts) //middleware that helps to create reusable layouts for your views


app.use(logger('dev'))
app.use(express.urlencoded({extended:false}))  //for parsing form data
app.use(express.json());  //for parsing json

app.use(express.static(path.join(__dirname,'public')));


// // db connection 
connectDb();

app.use(cookieParser());
app.use(nocache())



app.use(session({
    secret:"Gadgets",
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:6000000
    }
}))

app.use('/',userRoute);
app.use('/admin',adminRoute);


app.listen(PORT,()=>{
    console.log(`Server startes on http://localhost:${PORT}`);
})