const path = require('path');

module.exports = function (io, collectionName) {
    const Message = require(path.join(__dirname, 'models/chat.js'))(collectionName)
    users = {};
    viewers = 0;

    io.on('connection', async socket =>{
        //Viewer counter
        io.sockets.emit('user count', ++viewers)

        console.log(`[${new Date(Date.now()).toISOString()}]: New user connected`)

        //Load messages
        var messageLog = await Message.find({})
        socket.emit('messsagelog', messageLog)

        socket.on('user connected', (username, callback) => {
            // if(users.indexOf(username.toLowerCase()) > -1 || username.length > 15){
            if(username in users){
                callback({status:false})
            }
            else{
                callback({status:true})
                socket.user = username
                // users.push(socket.user.toLowerCase())
                users[socket.user] = socket
                io.sockets.emit('user connected', username)
                console.log(`[${new Date(Date.now()).toISOString()}]: ${socket.user} is now online`)
            }
        })

        socket.on('client message', async text =>{
            if(socket.user){
                var newMsg = new Message({
                    name: socket.user,
                    text
                })

                await newMsg.save()

                io.sockets.emit('server message', {
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
                // users.splice(users.indexOf(socket.user.toLowerCase()), 1)
                delete users[socket.user]
                console.log(`[${new Date(Date.now()).toISOString()}]: ${socket.user}: is offline`)
            }
            //refreshing viewers count
            io.sockets.emit('user count', --viewers)
        })
        //object.keys(users)
    });
}