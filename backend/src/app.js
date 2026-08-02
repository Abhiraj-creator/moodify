/*
app.js creates the server and configure it 
*/

// requires 

const fs = require('fs');
const path = require('path');
const express=require('express');
const cookieParser=require('cookie-parser');
const AuthRouter=require('./routes/auth.routes');
const SongRouter= require('./routes/song.routes');
const app=express()
const cors=require('cors');

//middlewares
const allowedOrigins = [process.env.CLIENT_URL, 'http://localhost:5173'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }

        callback(new Error('Not allowed by CORS'));
    },
    credentials:true
}))
app.use(express.json());
app.use(cookieParser())
app.use('/api/auth',AuthRouter);
app.use('/api/song',SongRouter);

const frontendBuildPath = path.join(__dirname, '..', 'public');

if (fs.existsSync(frontendBuildPath)) {
    app.use(express.static(frontendBuildPath));

    app.get(/(.*)/, (req, res) => {
        if (req.path.startsWith('/api')) {
            return res.status(404).json({ message: 'API route not found' });
        }

        return res.sendFile(path.join(frontendBuildPath, 'index.html'));
    });
}



module.exports=app;