module.exports = (app, corsOptions) => {
const io = require("socket.io")(app, {
    cors: corsOptions,
});
const { MessageId } = require("./message_id");

// there are only 1 message -- "roomMessage"
const ROOM_MESSAGE = "roomMessage";

// Used to get username by socket.id
// Note that, the different socket.id can map to the same username. We won't handle this for now.
const socketIdUsernameMap = {};

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

    socket.on(ROOM_MESSAGE, (message) => {
        // const message = JSON.parse(message);
        handleMessage(socket, message);
    });
});

const handleMessage = (socket, message) => {
    const roomName = message.roomName || "";
    console.log(`[Room] Room '${roomName}', message: ${JSON.stringify(message)}`);
    const msgId = message.id;
    const msgBody = message.body;
    const senderSocketId = msgBody?.senderSocketId || "";
    const senderUsername = msgBody?.senderUsername || "";
    const senderDisplayName = msgBody?.senderDisplayName || "";
    // when broadcast, if broadcast to the sender as well
    let broadcastToSender = false;

    if (msgId === MessageId.JoinRoom) {
        socket.join(roomName);
        socketIdUsernameMap[senderSocketId] = {
            socketId: senderSocketId,
            username: senderUsername,
            displayName: senderDisplayName,
        };
        console.log(`[Room] User (socket.id=${senderSocketId}) joined room '${roomName}'`);
        msgBody.participants = getRoomParticipants(roomName);
        broadcastToSender = true;
        return;
    } else if (msgId === MessageId.LeaveRoom) {
        socket.leave(roomName);
        // if a user is not in any of the room, then delete it from socketIdUsernameMap
        if (!isParticipantInAnyRoom(senderSocketId)) {
            delete socketIdUsernameMap[senderSocketId];
        }
        console.log(`[Room] User (socket.id=${senderSocketId}) left room '${roomName}'`);
        msgBody.participants = getRoomParticipants(roomName);
        broadcastToSender = true;
        return;
    } else if (msgId === MessageId.GetRoomParticipants) {
        msgBody.participants = getRoomParticipants(roomName);
        broadcastToSender = true;
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
        roomName, // a user can be in more than one room, he need to know which room a message come from
        token: message.token,
        body: msgBody,
    };

    if (broadcastToSender) {
        io.to(roomName).emit(ROOM_MESSAGE, broadCastMsg);
    } else {
        // Broadcast to all users in the room except the sender
        socket.broadcast.to(roomName).emit(ROOM_MESSAGE, broadCastMsg);
    }
}

const getRoomParticipants = (roomName) => {
    // `room` is a list of socketIds
    const room = io.of("/").adapter.rooms.get(roomName);
    if (room) {
        const participants = Array.from(room).map(socketId => socketIdUsernameMap[socketId]);
        return participants;
    }
    return [];
};

const isParticipantInAnyRoom = (participantSocketId) => {
    const rooms = io.of("/").adapter.rooms;
    if (rooms) {
        for (const [roomName, socketIds] of rooms) {
            if (socketIds.has(participantSocketId)) {
                return true;
            }
        }
    }
    return false;
};

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
