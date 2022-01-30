const http = require('http');
// const https = require('https');
const path = require('path');
const mongoose = require('mongoose');

//Editable data
const port = 2610;
const dbserver = 'maisonbleue2020.ddns.net'
const dbname = 'pruebachat'

const express = require('express');
const {Server} = require('socket.io');
const exp = require('constants');

//Initailiting web server
var app = express();
const server = http.createServer(app);
const io = new Server(server);

//Db connection
mongoose.connect(`mongodb://${dbserver}/${dbname}`)
.then(db =>{
    console.log('db is coneccted')
})
.catch(err =>{
    console.log(err)
})

/*const sslServer = https.createServer({
    key: fs.readFileSync(path.join(__dirname, '../cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '../cert', 'cert.pem')),
}, app);*/


require(path.join(__dirname, 'sockets.js'))(io)

//Sending static files (web archives)
app.use(express.static(path.join(__dirname, 'public')));


//Starting server
server.listen(port, () => {
    console.log(`App running on port ${port}`)
});

