module.exports = (app, corsOptions) => {
const io = require("socket.io")(app, {
    cors: corsOptions,
});
const { MessageId } = require("./message_id");

// there are only 1 message -- "roomMessage"
const ROOM_MESSAGE = "roomMessage";

io.on("connection", (socket) => {
    console.log("[Room] A user connected, socket.id:", socket.id);
    const rooms = io.of("/").adapter.rooms;
    for (const [roomName, socketIds] of rooms) {
        console.log(`[Room] Room: ${roomName}, Sockets: ${Array.from(socketIds)}`);
    }

    socket.on('disconnecting', () => {
        console.log("[Room] disconnecting, room count:", socket.rooms.size);
    });

    socket.on("disconnect", () => {
        console.log("[Room] disconnected, room count:", socket.rooms.size);
    });

    socket.on(ROOM_MESSAGE, (roomName, message) => {
        // const message = JSON.parse(message);
        handleMessage(socket, roomName, message);
    });
});

const handleMessage = (socket, roomName, message) => {
    console.log(`[Room] Room '${roomName}', message: ${JSON.stringify(message)}`);
    const msgId = message.id;
    const msgBody = message.body;

    if (msgId === MessageId.JoinRoom) {
        socket.join(roomName);
        console.log(`[Room] User (socket.id=${socket.id}) joined room '${roomName}'`);
        return;
    } else if (msgId === MessageId.LeaveRoom) {
        socket.leave(roomName);
        console.log(`[Room] User (socket.id=${socket.id}) left room '${roomName}'`);
        return;
    } else if (msgId === MessageId.ChatMessage) {
        // do nothing, this message will be broadcasted to all users in the room except the sender
        // socket.broadcast.to(roomName).emit(ROOM_MESSAGE, broadCastMsg);
    } else if (msgId === MessageId.AddMarkup) {
        addMarkup(msgBody);
    } else if (msgId === MessageId.UpdateMarkup) {
        updateMarkup(msgBody);
    } else if (msgId === MessageId.DeleteMarkup) {
        deleteMarkup(msgBody);
    }

    // broadcast
    // we may need to change the broadcast message, but for most case, may broad cast directly
    const broadCastMsg = {
        id: msgId,
        token: message.token,
        body: msgBody,
    };
    // io.to(roomName).emit(ROOM_MESSAGE, broadCastMsg);
    // Broadcast to all users in the room except the sender
    socket.broadcast.to(roomName).emit(ROOM_MESSAGE, broadCastMsg);
}

const addMarkup = (messageBody) => {
    // TODO: add to db
};

const updateMarkup = (messageBody) => {
    // TODO: add to db
};

const deleteMarkup = (messageBody) => {
    // TODO: add to db
};
}
