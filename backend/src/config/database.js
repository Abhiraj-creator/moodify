const mongoose= require('mongoose');

const ConnectTODb=async ()=>{
    await mongoose.connect(process.env.MONGO_URI);
    console.log('connected to db');
}

module.exports=ConnectTODb