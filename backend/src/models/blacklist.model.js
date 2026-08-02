const mongoose=require('mongoose');

const BlacklistSchema=new mongoose.Schema({
    token:{
        type:String,
        required:[true,'token is required to blacklist ']
    }
},{
    timestamps:true
});


const BlacklistModel= mongoose.model('blacklist',BlacklistSchema);


module.exports=BlacklistModel;