//Editables
const eventName = 'Vannesa & Shawahl';
const eventDescription = ['Cancun Time - 16:00']
const eventCode = 'lsspm02252022_vanessa&shawahl';
const apiUrl = 'localhost';
const apiPort = '1623';

//Obtaining DOM elements from interface
const chatBox = document.getElementById('chatBox')


// Auxiliar functions
function getTime(storagedTime){
    var time = typeof storagedTime === 'undefined' ? new Date(Date.now()) : new Date(storagedTime)

    var month = time.getMonth() > 9 ? `${time.getMonth()}` : `0${time.getMonth()}`
    var day = time.getDay() > 9 ? `${time.getDay()}` : `0${time.getDay()}`
    var hour = time.getHours() > 9 ? `${time.getHours()}` : `0${time.getHours()}`
    var minute = time.getMinutes() > 9 ? `${time.getMinutes()}` : `0${time.getMinutes()}`
    
    return `${month}/${day} ${hour}:${minute}`
}

function showNewMessage(message){
    const span = document.createElement('span')
    const article = document.createElement('article')
    const div = document.createElement('div')
    const p = document.createElement('p')
    
    span.className = 'tag is-dark'
    article.className = 'message is-dark mr-1'
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

window.onload = () => {
    const eventTit = document.getElementById('eventName')
    const eventDesc = document.getElementById('eventDetails')

    eventTit.innerHTML = eventName
    eventDescription.forEach((element) =>{
        dt = document.createElement('dt')
        dt.innerHTML = element
        eventDesc.appendChild(dt)
    })

    fetch(`http://${apiUrl}:${apiPort}/chatlog/${eventCode}`)
        .then(response => response.json())
        .then(messages => messages.forEach(message =>{
            showNewMessage(message)
        }));
}