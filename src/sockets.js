module.exports = function (io) {
    users = [];
    viewers = 0;

    io.on('connection', socket =>{
        console.log(`[${new Date(Date.now()).toISOString()}]: New user connected`)
        //Viewer counter
        io.sockets.emit('user count', ++viewers)

        socket.on('user connected', (username, callback) => {
            if(users.indexOf(username.toLowerCase()) > -1 || username.length > 15){
                callback({status:false})
            }
            else{
                callback({status:true})
                socket.user = username
                users.push(socket.user.toLowerCase())
                io.sockets.emit('user connected', username)

                console.log(`[${new Date(Date.now()).toISOString()}]: ${socket.user} is now online`)
            }
        })

        socket.on('client message', message =>{
            if(socket.user){
                io.sockets.emit('server message', {
                    user: socket.user,
                    msg: message
                })
            }
            else{
                socket.emit('invalid connection', 'client no recognized')
            }
        })

        socket.on('disconnect', () => {
            if(socket.user){
                users.splice(users.indexOf(socket.user.toLowerCase()), 1)
                console.log(`[${new Date(Date.now()).toISOString()}]: ${socket.user}: is offline`)
            }
            //refreshing viewers count
            io.sockets.emit('user count', --viewers)
        })
    });
}