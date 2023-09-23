const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    email: {
        type:String,
        required:true,
        unique:true
    },
    username: {
        type:String,
        required:true,
        unique:true
    },
    password: {
        type:String,
        required:true
    },
    confirmpassword: {
        type:String,
        required:true
    }
})

userSchema.pre("save",async function(next) {

    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10);
        this.confirmpassword = undefined;
    }
    next();
});

const Register = new mongoose.model("Register", userSchema);

module.exports=Register;