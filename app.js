const express=require('express');
const app=express();


app.get('/',(req,res)=>{
    res.send("Home Page")
})

app.listen(4000,()=>{
    console.log(`Server startes on http://localhost:4000`);
})