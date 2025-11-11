import express from "express";

const app = express()

app.get("/",(req,res)=>{
    res.json({message:"hello"})
})

app.listen(3001,()=>{
    console.log("server is listening on 3001")
})