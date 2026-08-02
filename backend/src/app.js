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

// API routes (must be before static files)
app.use('/api/auth',AuthRouter);
app.use('/api/song',SongRouter);

// Serve frontend static build (backend/public)
const frontendBuildPath = path.join(__dirname, '..', 'public');

// --- Diagnostics (visible in Render logs) ---
console.log('[static] frontendBuildPath:', frontendBuildPath);
console.log('[static] directory exists:', fs.existsSync(frontendBuildPath));
if (fs.existsSync(frontendBuildPath)) {
    console.log('[static] contents:', fs.readdirSync(frontendBuildPath));
    const assetsPath = path.join(frontendBuildPath, 'assets');
    if (fs.existsSync(assetsPath)) {
        console.log('[static] assets/:', fs.readdirSync(assetsPath));
    } else {
        console.log('[static] assets/ folder is MISSING');
    }
}
// -------------------------------------------

// Always register static middleware (even if directory is empty)
app.use(express.static(frontendBuildPath));

// SPA fallback — only serve index.html for non-asset, non-API GET requests
// Asset extensions must 404 (not return HTML) to avoid MIME type errors
app.get('/{*splat}', (req, res, next) => {
    // Skip files with extensions (assets, fonts, images, etc.)
    if (/\.\w+$/.test(req.path)) {
        return next();
    }
    const indexPath = path.join(frontendBuildPath, 'index.html');
    if (!fs.existsSync(indexPath)) {
        return res.status(404).send('Frontend not built. Run: npm run build in frontend/');
    }
    res.sendFile(indexPath);
});



module.exports=app;
