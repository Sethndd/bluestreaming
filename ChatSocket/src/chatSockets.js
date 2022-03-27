const path = require('path');
const Message = require(path.join(__dirname, 'models/chat.js'))

module.exports = function (io) {
    var users = {}; //These are the global users, not per room
    var attendants = {};

    io.on('connection', async socket =>{

        socket.on('event loading', async eventCode => {
            socket.join(eventCode)
            socket.room = eventCode

            //viewer counter by room
            if (attendants[eventCode] == undefined) {
                attendants[eventCode] = 1
            } else {
                attendants[eventCode]++
            }

            io.in(socket.room).emit('user count', attendants[eventCode])
            console.log(`[${new Date(Date.now()).toISOString()}]: New user connected in room ${eventCode}`)

            //Load messages (verify existing collection)
            var messageLog = await Message(eventCode).find({})
            socket.emit('messsagelog', messageLog)

        })

        socket.on('user connected', (username, callback) => {
            if(username in users){
                callback({status:false})
            }
            else{
                callback({status:true})

                socket.user = username
                users[socket.user] = socket
                
                console.log(`[${new Date(Date.now()).toISOString()}]: ${socket.user} is now online in room ${socket.room}`)
                io.in(socket.room).emit('user connected', username)
            }
        })

        socket.on('client message', async text =>{
            if(socket.user){
                var newMsg = new Message(socket.room)({
                    name: socket.user,
                    text
                })
                await newMsg.save()

                io.in(socket.room).emit('server message', {
                    name: socket.user,
                    text
                })
            }
            else{
                socket.emit('invalid connection', 'client no recognized')
            }
        })

        socket.on('disconnect', () => {
            if(socket.user){
                delete users[socket.user]
                console.log(`[${new Date(Date.now()).toISOString()}]: ${socket.user}(${socket.room}) is offline`)
            }
            io.in(socket.room).emit('user count', --attendants[socket.room])
        })
    });
}