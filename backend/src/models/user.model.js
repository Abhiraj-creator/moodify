const mongoose= require('mongoose');

const UserSchema=new mongoose.Schema({
    username:{
        type:String,
        required:[true,'usernme is required'],
        unqiue:[true,'username must be unique']
    },
    email:{
        type:String,
        required:[true,'email is required'],
        unqiue:[true,'email must be unique']
    },
    password:{
        type:String,
        required:[true,'password is required'],
        select:false
    }
});

const UserModel= mongoose.model("users",UserSchema)

module.exports=UserModel;