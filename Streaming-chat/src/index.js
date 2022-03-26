const http = require('http');
const fs = require('fs');
const path = require('path');
const hls = require('hls-server');
const express = require('express');

//Initailiting web server
const port = 2610;
var app = express();
const server = http.createServer(app);

//Sending static files (web archives)
app.use(express.static(path.join(__dirname, 'public')));

//Starting server
server.listen(port, () => {
    console.log(`WebApp running on port ${port}`)
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