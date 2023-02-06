const express=require("express");
const { Usermodel } = require("../models/user.model");
const mongoose=require("mongoose");
const evalRouter=express.Router();
const app=express();

app.use(express.json());



module.exports={
    evalRouter,
}