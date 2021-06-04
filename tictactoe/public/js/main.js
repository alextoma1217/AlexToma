const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const game_select = document.getElementById('game_select');
const userList = document.getElementById('users');
const tictactoegame_overlay = document.getElementById('tictactoegame_overlay');
const game_field = document.getElementById('game_field');
const lobby_field = document.getElementById('lobby_field');
const user_id = document.getElementById('user_id').innerText.trim();
const socket = io();




let username =  document.getElementById('user_name').innerText;
username =username.trim();
let room = 'walk_room';

// Join chatroom
socket.emit('joinRoom', { username, room, user_id });
// Get room and users
socket.on('roomUsers', ({ room, users, messages }) => {
  outputUsers(users);
  
  if(messages.length>0){
     outputSentMessages(messages);
  } 

});

// Message from server
socket.on('message', (message) => { 
  outputMessage(message);
  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // Get message text
  let msg = e.target.elements.msg.value;

  msg = msg.trim();
  if (!msg) {   
    return false;
  }
  // Emit message to server
  socket.emit('chatMessage', msg);
  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerHTML += `${message.username} ` + `: ` +  `${message.text}`;

  div.appendChild(p);
  document.querySelector('.chat-messages').prepend(div);
}


// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li); 
  });
}


// Add users to DOM
function outputSentMessages(messages) {
  const div = document.createElement('div');
  div.classList.add('message');
  for(let i=0; i<messages.length; i++){
    const p = document.createElement('p');
    p.classList.add('meta');
    p.innerHTML +=  messages[i];
     div.appendChild(p);
    document.querySelector('.chat-messages').appendChild(div);
  }
}





