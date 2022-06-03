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

