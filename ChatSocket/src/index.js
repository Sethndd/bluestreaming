const http = require('http');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');

const { Server } = require('socket.io');

//Editable data
const port = 1624;
const dbserver = '192.168.1.154';
const dbname = 'pruebachat';

//Initailiting web server
var app = express();
const server = http.createServer(app);

//Db connection
mongoose.connect(`mongodb://${dbserver}/${dbname}`)
.then(db =>{
    console.log('db is coneccted')
})
.catch(err =>{
    console.log(err)
})


//Chat socket
const io = new Server(server, {cors: { origin: "*",}});
require(path.join(__dirname, 'chatSockets.js'))(io)

//Starting server
server.listen(port, () => {
    console.log(`Chat Socket Manager running on port ${port}`)
});
