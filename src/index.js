const http = require('http');
// const https = require('https');
const path = require('path');
const mongoose = require('mongoose');
const hls = require('hls-server');
const fs = require('fs');

//Editable data
const port = 2610;
const dbserver = '192.168.1.154';
//const dbname = 'lsdpm30012022_megan&kyle';
const dbname = 'pruebachat';

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

new hls(server, {
    provider: {
        exists: (req, cb) => {
            const ext = req.url.split('.').pop();

            if (ext !== 'm3u8' && ext !== 'ts') {
                return cb(null, true);
            }

            fs.access(__dirname + req.url, fs.constants.F_OK, function(err){
                if (err) {
                    console.log('File not exists');
                    console.log(err.message);
                    return cb(null, false);
                }
                cb(null, true);
            });

        },
        getManifestStream: (req, cb) => {
            const stream = fs.createReadStream(__dirname + req.url);
            //console.log(stream);
            cb(null, stream);
        },
        getSegmentStream: (req, cb) => {
            const stream = fs.createReadStream(__dirname + req.url);
            //console.log(stream);
            cb(null, stream);
        }
    }
});