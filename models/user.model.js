const mongoose=require("mongoose");
let userSchema=mongoose.Schema({
    name:String,
    email:String,
    password:String,
    role:String
})
const Usermodel=mongoose.model("users",userSchema);
module.exports={
    Usermodel,
}