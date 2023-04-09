require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose')

const userRoute=require('./routes/userRoute');
const adminRoute=require('./routes/adminRoute');

const app=express();
const PORT=process.env.PORT || 8080;

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