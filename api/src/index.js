const express = require('express');
const path = require('path');
const mongoose = require('mongoose'), Admin = mongoose.mongo.Admin;
const ChatMessage = require(path.join(__dirname, 'models/chat.js'))


//Editable data
const port = 1623;
const dbserver = '192.168.1.154';

var connection = mongoose.createConnection(`mongodb://${dbserver}`)
var dbList = [];
const dbExcluded = ['admin', 'config', 'local'];
connection.on('open', function() {
    new Admin(connection.db).listDatabases(function(err, result) {
        result.databases.forEach(db =>{
            // console.log(db.name);
            dbList.push(db.name)
        })
    });
});


const app = express();

app.get('/chatlog/:dbName', async (req, res) => {
    var databaseName = req.params.dbName
    var chatlog = []

    if(!dbExcluded.includes(databaseName) && dbList.includes(databaseName)){
        var dbAux = connection.useDb(databaseName)
        var messages = dbAux.model('Message', ChatMessage);
        var chatlog = await messages.find({});
    }

    res.send(chatlog)
  })

app.listen(port, () => {
    console.log(`App running on port ${port}`)
});