const socket = io();
let name;
var typing=false;
var timeout=undefined;
var user;
let textarea = document.querySelector('#textarea')
let messageArea = document.querySelector('.message__area')
do {
    name = prompt('Please enter your name: ')
} while(!name)

textarea.addEventListener('keyup', (e) => {
    if(e.key === 'Enter') {
        sendMessage(e.target.value)
    }
})

function sendMessage(message) {
    let msg = {
        user: name,
        message: message.trim()
    }
    // Append 
    appendMessage(msg, 'outgoing')
    textarea.value = ''
    scrollToBottom()

    // Send to server 
    socket.emit('message', msg)

}

function appendMessage(msg, type) {
    let mainDiv = document.createElement('div')
    let className = type
    mainDiv.classList.add(className, 'message')

    let markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
    `
    mainDiv.innerHTML = markup
    messageArea.appendChild(mainDiv)
}

// Recieve messages 
socket.on('message', (msg) => {
    appendMessage(msg, 'incoming')
    scrollToBottom()
})

function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight
}

$(document).ready(function(){
    $('.typing-message').keypress((e)=>{
        //console.log('...')
        // if($("#unit").attr("placeholder")!="Username"){
            if(e.which!=13){
                typing=true
                socket.emit('typing', {user:name, typing:true})
                clearTimeout(timeout)
                timeout=setTimeout(typingTimeout, 1500)
            }else{
                clearTimeout(timeout)
                typingTimeout()
                sendMessage()
            }
        // }
    })
    socket.on('display', (data)=>{
        if(data.typing==true)
            $('.typing').text(`${data.user} is typing...`)
        else
            $('.typing').text("")
    })
});

function typingTimeout(){
    typing=false
    socket.emit('typing', {user:user, typing:false})
}

