const socket = io('http://localhost:1624');
var username = ''

//variables for naming
var eventCode = 'messages'
var eventName = 'Megan Rotter & Kyle Mccuen';
var eventDescription = ['Cancun Time - 16:00']

//Obtaining DOM elements from interface
const chatBox = document.getElementById('chatBox')
const btnJoinChat = document.getElementById('btnJoinChat')
const txtMessage = document.getElementById('txtMessage')
const btnSend = document.getElementById('btnSend')

const viewerCount = document.getElementById('viewerCount')

// Auxiliar functions
function getTime(storagedTime){
    var time = typeof storagedTime === 'undefined' ? new Date(Date.now()) : new Date(storagedTime)

    var hour = time.getHours() > 9 ? `${time.getHours()}` : `0${time.getHours()}`
    var minute = time.getMinutes() > 9 ? `${time.getMinutes()}` : `0${time.getMinutes()}`
    
    return `${hour}:${minute}`
}

function allowMessaging(status){
    if(status){
        txtMessage.style.display = 'block'
        btnSend.style.display = 'block'
        btnJoinChat.style.display = 'none'
    }
    else{
        txtMessage.style.display = 'none'
        btnSend.style.display = 'none'
        btnJoinChat.style.display = 'block'
    }
}

function showNewMessage(message){
    const span = document.createElement('span')
    const article = document.createElement('article')
    const div = document.createElement('div')
    const p = document.createElement('p')
    
    span.className = 'tag is-dark'
    article.className = 'message is-dark mr-6'
    div.className = 'message-body'
    p.className = 'subtitle is-6'

    span.innerHTML = `[${getTime(message.time)}] ${message.name}:`
    p.innerHTML = message.text
    
    div.appendChild(p)
    article.appendChild(div)
    chatBox.appendChild(span)
    chatBox.appendChild(article)

    chatBox.scrollTop = chatBox.scrollHeight;
}

function showUserMessage(message){
    const span = document.createElement('span')
    const article = document.createElement('article')
    const div = document.createElement('div')
    const p = document.createElement('p')
    
    span.className = 'tag is-light ml-6'
    article.className = 'message ml-6 mr-1'
    div.className = 'message-body'
    p.className = 'subtitle is-6'

    span.innerHTML = `[${getTime()}] You:`
    p.innerHTML = message.text
    
    div.appendChild(p)
    article.appendChild(div)
    chatBox.appendChild(span)
    chatBox.appendChild(article)

    chatBox.scrollTop = chatBox.scrollHeight;
}

function showNewUserConnected(user){
    const div = document.createElement('div')
    const span = document.createElement('span')
    const p = document.createElement('p')

    div.className = 'tags is-centered'
    span.className = 'tag is-primary is-medium'

    p.innerHTML = `<b>${user}</b> has joined`
    span.appendChild(p)
    div.appendChild(span)
    chatBox.appendChild(div)

    chatBox.scrollTop = chatBox.scrollHeight;
}

function alertSweet(alertText){
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: alertText,
        confirmButtonColor: '#F14668'
      })
}

function disconnectFromChat(){
    alertSweet('Lost connection, insert name again.')
    allowMessaging(false)
}

// Client events
btnJoinChat.addEventListener('click', newUser);

btnSend.addEventListener('click', sendMessage);
txtMessage.addEventListener('keyup', (key) =>{
    if (key.key === 'Enter') sendMessage()
});

//Sending messages to the server
function sendMessage(){
    if(username){
        if(txtMessage.value.trim()){
            socket.emit('client message', txtMessage.value);  
            txtMessage.value = '';
        }
    }
    else{
        disconnectFromChat()
    }
}

function userConeccted(username){
    return new Promise((resolve, reject) => {
        socket.emit('user connected', username, (res) => {
            if(res.status){
                resolve(true)
            }
            else{
                resolve(false)
            }
        })
    })
}


function newUser() {
    Swal.fire({
        title: 'Share your name with us:',
        input: 'text',
        inputAttributes: {
            autocapitalize: 'on'
        },
        showCancelButton: true,
        confirmButtonText: 'Accept',
        confirmButtonColor: '#F14668',
        showLoaderOnConfirm: true,
        inputValidator: (value) => {
            if (!value) {
              return 'Namespace cannot be empty.'
            }
            if (value.length > 20){
                return 'Name too long.'
            }
        },
        preConfirm: async (value) => {
           var nameAvailable = await userConeccted(value)
           return {
                value,
                nameAvailable
           }
        }
    }).then(result => {
        if (result.isConfirmed) {
            if(result.value.nameAvailable){
                username = result.value.value
                allowMessaging(true)
            }
            else{
                Swal.fire('The name is already taken. Please try again.')
            }
        }
    })
}

//Listening to the server
socket.on('messsagelog', (messageLog) =>{
    for(var i = 0; i < messageLog.length; i++){
        showNewMessage(messageLog[i])
    }
})

socket.on('server message', (message) => {
    if(username === message.name){
        showUserMessage(message)
    }
    else{
        showNewMessage(message)
    }
});

socket.on('user connected', (newUser) => {
    showNewUserConnected(newUser)
});

socket.on('user count', (viewers) => {
    viewerCount.innerHTML = viewers
});

socket.on('invalid connection', (message) => {
    disconnectFromChat()
})

window.onload = () => {
    const eventTit = document.getElementById('eventName')
    const eventDesc = document.getElementById('eventDetails')

    eventTit.innerHTML = eventName
    eventDescription.forEach((element) =>{
        dt = document.createElement('dt')
        dt.innerHTML = element
        eventDesc.appendChild(dt)
    })

    socket.emit('event loading', eventCode);  
}