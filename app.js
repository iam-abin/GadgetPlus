require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose');
const logger=require('morgan');
const expressLayouts=require('express-ejs-layouts')
const path=require('path')


const userRoute=require('./routes/userRoute');
const adminRoute=require('./routes/adminRoute');

const app=express();
const PORT=process.env.PORT || 8080;

// view engine setup
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))
app.set('layout','layouts/userLayout') // set default layout for admin pages
app.use(expressLayouts) //middleware that helps to create reusable layouts for your views


app.use(logger('dev'))
app.use(express.json());  //for parsing json
app.use(express.urlencoded({extended:false}))  //for parsing form data

app.use(express.static(path.join(__dirname,'public')));


// db connection start
mongoose.connect(process.env.MONGODB_URI,{useNewUrlParser:true});
const db=mongoose.connection;

db.on('error',(error)=>{
    console.log(error)
})
db.once('open',()=>{
    console.log("connected to database");
})
// db connection end 

app.use('/',userRoute);
app.use('/admin',adminRoute);


app.listen(PORT,()=>{
    console.log(`Server startes on http://localhost:${PORT}`);
})