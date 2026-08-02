require('dotenv').config()
/*
server.js starts the server and connects to db
*/

//requires
const app = require('./src/app');
const ConnectTODb = require('./src/config/database');

const PORT = process.env.PORT || 3000;

ConnectTODb().then(() => {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`server started at port ${PORT}`);
    });
}).catch((error) => {
    console.error('Database connection failed:', error);
    process.exit(1);
});