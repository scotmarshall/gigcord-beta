const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages')
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getGigUsers
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'GigCord Bot';

// Run when client connects
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, gig }) => {
        const user = userJoin(socket.id, username, gig);

        socket.join(user.gig);

        // Welcome current user
        socket.emit('message', formatMessage(botName, 'Welcome to GigCord!'));

        // Broadcast when a user connects
        socket.broadcast
            .to(user.gig)
            .emit('message', formatMessage(botName, `${user.username} has joined the chat`));

        // Send user list and gig title
        io.to(user.gig).emit('gigUsers', {
            gig: user.gig,
            users: getGigUsers(user.gig)
        });
    });

    // Listen for chatMessage
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);

        io.to(user.gig).emit('message', formatMessage(user.username, msg));
    });

    // Runs when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if(user) {
            io.to(user.gig).emit(
                'message',
                formatMessage(botName, `${user.username} has left the chat`));
            
            // Update user list
            io.to(user.gig).emit('gigUsers', {
                gig: user.gig,
                users: getGigUsers(user.gig)
            });
        }
    });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));