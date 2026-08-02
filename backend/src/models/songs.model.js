const mongoose= require('mongoose')

const SongSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
   SongUrl:{
        type:String,
        required:true
    },
    PosterUrl:{
        type:String,
        required:true
    },
    mood:{
        type:String,
        required:true,
        enum:{
            values:['SAD','HAPPY','SURPRISED','ANGRY']
        }
    }
})

const SongModel= mongoose.model('Songs', SongSchema)

module.exports= SongModel;