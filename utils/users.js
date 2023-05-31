const users = [];

// Join user to chat
function userJoin(id, username, gig) {
    const user = { id, username, gig };

    users.push(user);

    return user;
}

// Get current user
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

// User leaves chat
function userLeave(id){
    const index = users.findIndex(user => user.id === id);

    if(index !== -1) {
        return users.splice(index, 1)[0];
    }
}

// Get gig users
function getGigUsers(gig) {
    return users.filter(user => user.gig === gig);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getGigUsers
}