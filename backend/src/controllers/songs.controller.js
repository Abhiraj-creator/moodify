
const ID3 = require('node-id3');
const storageService = require('../services/storage.service')
const SongModel= require('../models/songs.model')

const UploadSongController = async (req, res) => {
    const SongBuffer = req.file.buffer;
    const tags = ID3.read(SongBuffer);
    const {mood}=req.body;
    
    const [Songfile,PosterFIle] = await Promise.all([
     storageService.upload({
            buffer: SongBuffer,
            filename: tags.title+'.mp3',
            folder: '/moodify/songs'
        }),
     await storageService.upload({
        buffer: tags.image.imageBuffer,
        filename: tags.title+'.jpeg',
        folder: '/moodify/posters'
    })]);

    const song= await SongModel.create({
        title:tags.title,
        SongUrl:Songfile.url,
        PosterUrl:PosterFIle.url,
        mood
    })
    res.status(201).json({ 
        message: "Song uploaded successfully",

        song
     })
}

const GetSongsController =async (req,res)=>{
    const {mood}= req.query;

    const song= await SongModel.findOne({
        mood
    })

    res.status(200).json({
        message:"song fetched successfully",
        song
    })
}

module.exports = { UploadSongController,
    GetSongsController
 }
