const express=require("express");
const mongoose=require("mongoose");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const { connection } = require("./config/db");
const { Usermodel } = require("./models/user.model");
const { authenticate } = require("./middlewares/auth.middleware");
const fs=require('fs')

// const { evalRouter } = require("./routes/eval.router");
require("dotenv").config();

const app=express();
// app.use("/",evalRouter);
app.use(express.json());
app.post("/signup",async(req,res)=>{
    
    try {
        const {name,email,password,role}=req.body;
        bcrypt.hash(password,7,async(err,hash)=>{
            const user=new Usermodel({name,email,password:hash,role})
            await user.save();
            res.send("signup successfully");
        });
        
        
        
    //    console.log(obj)
       
    } catch (error) {
        res.send({error:error})
    }
    
})
app.post("/login",async(req,res)=>{
    const {email,password}=req.body;
    const user=await Usermodel.find({email});

    if(!user){
        res.send("please sign in first");
    }
    const hashed_pass=user[0]?.password;
    bcrypt.compare(password,hashed_pass,(err,result)=>{
        if(result){
            const token=jwt.sign({userID:user._id,role:user[0].role},"Normal_SECRET",{expiresIn:60});
            const refresh_token=jwt.sign({userID:user.id},"REFRESH_TOKEN",{expiresIn:300});
            res.send({msg:"login succesfully",token,refresh_token});
        }else{
            res.send("login failed")
        }
    })
    
})
app.get("/logout",async(req,res)=>{
    const token=req.headers.authorization?.split(" ")[1];
    const blackListedData=JSON.parse(fs.readFileSync("./blacklist.json","utf-8"));
    blackListedData.push(token);
    fs.writeFileSync("./blacklist.json",JSON.stringify(blackListedData));
    res.send("logout successfully")
})
app.get("/getnewtoken",async(req,res)=>{
    const refresh_token=req.headers.authorization?.split(" ")[1];
    if(!refresh_token){
        res.send({message:"login again"})
    }
    jwt.verify(refresh_token,"REFRESH_TOKEN",(err,decoded)=>{
        if(err){
            res.send({"message":"plz login first","err":err.message});
        }else{
            let user=decoded;
            const token=jwt.sign({userID:user._id},"Normal_SECRET",{expiresIn:20});
            res.send({msg:"login successfully",token});
        }
    })
})
app.get("/goldrate",authenticate,async(req,res)=>{
    
    res.send("goldrate page")
})
app.get("/userstats",authenticate,async(req,res)=>{
    try {
        let role=req.body.userrole;
        if(role=="manager"||role=="Manager"){
            res.send("user stats page")
        }else{
            res.send("not access")
        }
    } catch (error) {
        res.send({error:error.message})
    }
    
})

app.listen(process.env.port,async()=>{
    try {
        await  connection;
        console.log("db connected to server")
    } catch (error) {
        console.log(error.message)
    }
    console.log("server is running")
})