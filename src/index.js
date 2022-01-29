const http = require('http');
const https = require('https');
const path = require('path');
const fs = require('fs');
const port = 2610;



const express = require('express');
const {Server} = require('socket.io');
const exp = require('constants');

var app = express();


const server = http.createServer(app);
/*const sslServer = https.createServer({
    key: fs.readFileSync(path.join(__dirname, '../cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '../cert', 'cert.pem')),
}, app);*/


const io = new Server(server);

require(path.join(__dirname, 'sockets.js'))(io)

//Sending static files (web archives)
app.use(express.static(path.join(__dirname, 'public')));


//Starting server
server.listen(port, () => {
    console.log(`App running on port ${port}`)
});

