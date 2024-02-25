const io = require("socket.io")(8900, {
    cors: {
        origin: "*"
    }
})

let users = [];

const addUser = (userId, socketId) => {
    !users.some(user => user.userId === userId) && users.push({ userId, socketId })
}

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId)
}

const getUser = (userId) => {
    return users.find(user => user.userId === userId)
}

io.on("connection", (socket) => {
    socket.on("addUser", userId => {
        addUser(userId, socket.id)
        io.emit('getUsers', users)
    })


    socket.on("sendMessage", ({ userId, receiverId, content, userName }) => {
        const user = getUser(receiverId)
        io.to(user?.socketId).emit("getMessage", {
            sender: {
                _id: userId,
                name: userName
            },
            content: content,
            timestamp: Date.now(),
        })
    })

    socket.on("disconnect", () => {
        removeUser(socket.id);
        io.emit('getUsers', users)
    })
})