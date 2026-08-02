const express = require('express');
const SongController= require('../controllers/songs.controller')
const Router= express.Router();
const UploadMiddleware=require('../middlewares/upload.middleware')

// /api/songs/
Router.post('/',UploadMiddleware.single('song'),SongController.UploadSongController);
Router.get('/',SongController.GetSongsController);

module.exports=Router;