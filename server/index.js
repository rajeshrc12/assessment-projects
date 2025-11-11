import express from "express";
import dotenv from "dotenv";

dotenv.config()

const app = express()
const port = process.env.PORT
app.get("/",(req,res)=>{
    res.json({message:"hello"})
})

app.listen(port,()=>{
    console.log(`server is listening on ${port}`)
})