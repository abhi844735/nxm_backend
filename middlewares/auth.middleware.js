const { JsonWebTokenError } = require("jsonwebtoken");
const jwt=require("jsonwebtoken");
const fs=require("fs");
const authenticate=(req,res,next)=>{
    const token=req.headers.authorization?.split(" ")[1];
    if(!token){
        res.send("not authorized");
    }
    const blackListedData=JSON.parse(fs.readFileSync("./blacklist.json","utf-8"));
    if(blackListedData.includes(token)){
       return res.send("login again");
    }
    jwt.verify(token,"Normal_SECRET",(err,decoded)=>{
        if(err){
          res.send({message:"login again",err:err.message})
        }
        else{
            // console.log(decoded)
            let role=decoded.role;
            req.body.userrole=role;
            next();
        }
    })
}
module.exports={
    authenticate,
}