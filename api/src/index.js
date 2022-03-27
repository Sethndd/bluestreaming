const path = require('path');
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const Message = require(path.join(__dirname, 'models/chat.js'))
const Event = require(path.join(__dirname, 'models/event.js'))

//Editable data
const port = 1623;
const dbserver = '192.168.1.154';
const dbname = 'pruebachat';

//Db connection
mongoose.connect(`mongodb://${dbserver}/${dbname}`,
    () => {
        console.log('db is coneccted')
    }, err => {
        console.log(err)
    })

const app = express();

//Middleware
app.use(express.json());
app.use(cors());


app.get('/chatlog/:eventName', async (req, res) => {
    var collectionName = req.params.eventName
    var chatlog = []

    if((await mongoose.connection.db.listCollections({name: collectionName}).toArray()).length > 0 && collectionName !== 'events'){
        chatlog = await Message(collectionName).find({})
    }
    res.status(201).send(chatlog)
})

app.get('/event/:eventCode', async (req, res) => {
    var eventCode = req.params.eventCode
    var eventDetails = await Event.find({code: eventCode})
    res.status(200).send(eventDetails[0])
})

app.post('/admin/event', async (req, res)  =>{
    if(req.body.auth === '#laUVesk4k4'){
        var event = new Event(req.body)

        await event.save()
        res.status(201).send(req.body)
    }
    else{
        res.status(404).send({xd: 'xd'})
    }
})

app.listen(port, () => {
    console.log(`App running on port ${port}`)
});