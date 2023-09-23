const jwt = require("jsonwebtoken");
const Register = require("../models/registration");

const auth = async(req,res,next) =>{
    try{

        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token,process.env.SECRET_KEY_JWT);
        const user = await Register.findOne({_id:verifyUser._id});
        // console.log(user);

        req.token=token;
        req.user=user;

        next();

    }catch(error){
        res.status(401).json("First Login!");
    }    
}

module.exports = auth;