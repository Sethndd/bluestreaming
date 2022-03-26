const path = require('path');
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose'), Admin = mongoose.mongo.Admin;
const ChatMessage = require(path.join(__dirname, 'models/chat.js'))


//Editable data
const port = 1623;
const dbserver = '192.168.1.154';

var dbList = [];
const dbExcluded = ['admin', 'config', 'local'];

var connection = mongoose.createConnection(`mongodb://${dbserver}`)
connection.on('open', () => {
    new Admin(connection.db).listDatabases((err, result) => {
        result.databases.forEach(db =>{
            if(!dbExcluded.includes(db.name)){
                dbList.push(db.name)
            }
        })
    });
});

const app = express();

//Middleware
app.use(express.json());
app.use(cors());


app.get('/chatlog/:dbName', async (req, res) => {
    var databaseName = req.params.dbName
    var chatlog = []

    if(dbList.includes(databaseName)){
        var dbAux = connection.useDb(databaseName)
        var messages = dbAux.model('Message', ChatMessage);
        var chatlog = await messages.find({});
    }

    res.send(chatlog)
  })

app.listen(port, () => {
    console.log(`App running on port ${port}`)
});