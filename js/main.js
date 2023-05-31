const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const gigTitle = document.getElementById('gig-title');
const userList = document.getElementById('users');

// Get username and gig from URL
const { username, gig } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, gig });

// Get gig info
socket.on('gigUsers', ({ gig, users }) => {
    outputGigTitle(gig);
    outputUsers(users);
});

// Message from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get message text
    const msg = e.target.elements.msg.value;

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
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

// Add gig title to DOM
function outputGigTitle(gig) {
    gigTitle.innerText = gig;
}

// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}