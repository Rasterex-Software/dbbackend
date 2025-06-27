// https://socket.io/docs/v4/tutorial/api-overview

module.exports = (app, corsOptions, db, dbType) => {
const io = require("socket.io")(app, {
    cors: corsOptions,
});
const { MessageId } = require("./message_id");

// there are only 1 message -- "roomMessage"
const ROOM_MESSAGE = "roomMessage";
const ROOM_MESSAGE_ACK = "roomMessageWithAck";

class Room {
    /**
     * @param {*} createdBy userId
     */
    constructor(roomId, createdBy) {
        this.roomId = roomId;
        this.createdAt = new Date();
        this.createdBy = createdBy;
    }
}

// Used to get username by socket.id
// Note that, the different socket.id can map to the same username. We won't handle this for now.
const socketIdUsernameMap = {};

// Used to store rooms
// participants are stored in io.of("/").adapter.rooms.get(roomId)
const globalRooms = {};

io.on("connection", (socket) => {
    console.log("[Room] User connected, socket.id:", socket.id);
    // console.log(`[Room] io.of("/").adapter.rooms.size: ${io.of("/").adapter.rooms.size}`);
    // console.log(`[Room] globalRooms count: ${Object.entries(globalRooms).length}`);

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

    socket.on(ROOM_MESSAGE_ACK, (message, callback) => {
        // const message = JSON.parse(message);
        handleMessage(socket, message, callback);
    });
});

const handleMessage = (socket, message, callback) => {
    let roomId = message.roomId || "";
    // some messages like GetRoomsByDocId do not have a roomId, it has a docId instead
    const docId = message.docId || "";
    console.log(`[Room] Room '${roomId}', message: ${JSON.stringify(message)}`);
    const msgId = message.id;
    const msgBody = message.body;
    const senderSocketId = msgBody?.senderSocketId || "";
    const senderUsername = msgBody?.senderUsername || "";
    const senderDisplayName = msgBody?.senderDisplayName || "";
    // Some messages should be broadcasted to all users in current room.
    // Some messages should be broadcasted to all users in document rooms. Like CreateRoom, DeleteRoom, etc.
    let broadcastToDocumentRooms = false;
    // when broadcast, if broadcast to the sender as well
    let broadcastToSender = false;

    if (msgId === MessageId.JoinRoom) {
        if (!globalRooms[roomId]) {
            // We need to add the room to globalRooms.
            globalRooms[roomId] = new Room(roomId, senderUsername || senderSocketId);
        }
        socket.join(roomId);
        socketIdUsernameMap[senderSocketId] = {
            socketId: senderSocketId,
            username: senderUsername,
            displayName: senderDisplayName,
        };
        console.log(`[Room] User (socket.id=${senderSocketId}) joined room '${roomId}'`);
        msgBody.participants = getRoomParticipants(roomId);
        broadcastToSender = true;
        // return;
    } else if (msgId === MessageId.LeaveRoom) {
        socket.leave(roomId);
        // if a user is not in any of the room, then delete it from socketIdUsernameMap
        if (!isParticipantInAnyRoom(senderSocketId)) {
            delete socketIdUsernameMap[senderSocketId];
        }
        console.log(`[Room] User (socket.id=${senderSocketId}) left room '${roomId}'`);
        msgBody.participants = getRoomParticipants(roomId);

        // Check if there is nobody in the room, and delete it if it is not the default room
        checkToDeleteRoom(roomId);

        broadcastToSender = true;
        // return;
    } else if (msgId === MessageId.CreateRoom) {
        // fill in new roomId to the message
        roomId = createRoom(docId, senderUsername);
        console.log(`[Room] Created new room '${roomId}'`);
        broadcastToDocumentRooms = true;
        broadcastToSender = true;
    } else if (msgId === MessageId.DeleteRoom) {
        console.log(`[Room] Deleted room '${roomId}'`);
        deleteRoom(roomId);
        broadcastToDocumentRooms = true;
    } else if (msgId === MessageId.GetAllRooms) {
        // get all rooms for all documents
        msgBody.rooms = getAllRooms();
        // Only need to send to the sender
        // socket.emit(ROOM_MESSAGE, {
        //     id: msgId,
        //     token: message.token,
        //     body: msgBody,
        // });
        // return;
    } else if (msgId === MessageId.GetRoomsByDocId) {
        // get all rooms of the document
        msgBody.rooms = getAllRooms(docId);
        // Only need to send to the sender
        // socket.emit(ROOM_MESSAGE, {
        //     id: msgId,
        //     docId,
        //     token: message.token,
        //     body: msgBody,
        // });
        // return;
    } else if (msgId === MessageId.GetRoomParticipants) {
        msgBody.participants = getRoomParticipants(roomId);
        broadcastToSender = true;
    } else if (msgId === MessageId.ChatMessage) {
        // do nothing, this message will be broadcasted to all users in the room except the sender
        // socket.broadcast.to(roomId).emit(ROOM_MESSAGE, broadCastMsg);
    } else if (msgId === MessageId.HasMarkupForRoom) {
        msgBody.result = hasMarkupForRoom(roomId);
    } else if (msgId === MessageId.DeleteMarkupsForRoom) {
        msgBody.result = deleteMarkupsForRoom(roomId);
    } else if (msgId === MessageId.AddMarkup) {
        // do nothing, this message will be broadcasted to all users in the room except the sender
    } else if (msgId === MessageId.UpdateMarkup) {
        // do nothing, this message will be broadcasted to all users in the room except the sender
    } else if (msgId === MessageId.DeleteMarkup) {
        // do nothing, this message will be broadcasted to all users in the room except the sender
    }

    // broadcast
    // we may need to change the broadcast message, but for most case, may broad cast directly
    const broadCastMsg = {
        id: msgId,
        docId,
        roomId, // a user can be in more than one room, he need to know which room a message come from
        token: message.token,
        body: msgBody,
    };

    if (callback) {
        callback(message);
    } else {
        if (broadcastToDocumentRooms && docId) {
            broadcastToParticipantsByDocId(docId, broadCastMsg);
        } else {
            if (broadcastToSender) {
                io.to(roomId).emit(ROOM_MESSAGE, message);
            } else {
                // Broadcast to all users in the room except the sender
                socket.broadcast.to(roomId).emit(ROOM_MESSAGE, message);
            }
        }
    }
}

// TODO: should not send message to other document's rooms
const broadcastToParticipantsByDocId = (docId, message) => {
    // sockets is a Map object, where the key is the socket id and the value is the socket object
    const sockets = io.of('/').sockets;
    const socketsArray = Array.from(sockets.values());
    // socket object:
    //  - id: The unique identifier for the socket.
    //  - rooms: A Set containing the rooms the socket is joined to.
    //  - emit: Method to send events to the client.
    //  - join: Method to join a room.
    //  - leave: Method to leave a room.
    //  - disconnect: Method to disconnect the client.
    socketsArray.forEach((socket) => {
        // TODO: get docId from the socket and roomId
        // const roomDocId = getDocIdByRoomId(roomId);
        // if (roomDocId === docId) {
            socket.emit(ROOM_MESSAGE, message);
        // }
    });
};

/**
 * Gets all rooms for all documents, or for a specific document if docId is provided.
 */
const getAllRooms = (docId) => {
    const roomList = [];
    for (const [roomId, room] of Object.entries(globalRooms)) {
        // console.log(`[Room] getAllRooms: roomId=${roomId}, docId=${docId}`);
        // if docId is provided, we only return the rooms of the document
        if (docId) {
            const roomDocId = getDocIdByRoomId(roomId);
            if (roomDocId !== docId) {
                continue;
            }
        }
        const participants = getRoomParticipants(roomId);
        const createdAt = room.createdAt;
        const createdBy = room.createdBy;
        roomList.push({ roomId, participants, createdAt, createdBy });
    }

    return roomList;
};

const getRoomParticipants = (roomId) => {
    // `room` is a list of socketIds
    const room = io.of("/").adapter.rooms.get(roomId);
    if (room) {
        const participants = Array.from(room).map(socketId => socketIdUsernameMap[socketId]);
        return participants;
    }
    return [];
};

const isParticipantInAnyRoom = (participantSocketId) => {
    const rooms = io.of("/").adapter.rooms;
    if (rooms) {
        for (const [roomId, socketIds] of rooms) {
            if (socketIds.has(participantSocketId)) {
                return true;
            }
        }
    }
    return false;
};

/**
 * When there is nobody in the room, we can delete the room.
 * We also need to delete the annotations related to this room.
 * But we should not delete the default room of each document.
 */
const checkToDeleteRoom = (roomId) => {
    if (isDefaultRoom(roomId)) {
        // do not delete the default room
        return;
    }
    // a list of socketIds
    const socketIds = io.of("/").adapter.rooms.get(roomId);
    const hasParticipant = socketIds && socketIds.size > 0;
    if (hasParticipant) {
        // there are still participants in the room, do not delete it
        return;
    }

    if (!isDocumentCollaborationRoom(roomId)) {
        // if the room is created in 24 hours, do not delete it
        const room = globalRooms[roomId];
        if (room && room.createdAt && (new Date() - room.createdAt < 24 * 60 * 60 * 1000)) {
            return;
        }
    }

    deleteRoom(roomId);
};

/**
 * Creates a new room for the document, in format of "<docId>_room_<n>".
 */
const createRoom = (docId, createdBy) => {
    let i = 1;
    let roomId = `${docId}_room_${i}`;
    while (io.of('/').adapter.rooms[roomId] || globalRooms[roomId]) {
        i++;
        roomId = `${docId}_room_${i}`;
    }
    // io.of('/').adapter.rooms[roomId] = new Set();
    globalRooms[roomId] = new Room(roomId, createdBy);
    return roomId;
};

/**
 * Admin can delete a room.
 * This will delete all participants in the room and remove the room from the server.
 */
const deleteRoom = (roomId) => {
    if (!roomId || typeof roomId !== 'string') {
        return;
    }
    if (isDefaultRoom(roomId)) {
        // do not delete the default room
        return;
    }
    // delete all participants then delete the room
    console.log(`Deleting room '${roomId}'`);
    // io.of("/").adapter.rooms.delete(roomId); // not recommended to use this
    io.in(roomId).socketsLeave(roomId);
    if (globalRooms[roomId]) {
        delete globalRooms[roomId];
    }
    // delete the annotations related to this room
    deleteMarkupsForRoom(roomId);
};

const hasMarkupForRoom = (roomId) => {
    // TODO: read from db to check if there is markup for this room
    return true;
};

const deleteMarkupsForRoom = (roomId) => {
    // delete the annotations related to this room
    db.annotation.destroy({
        where: { roomId: roomId },
    }).then((deleteCount) => {
        console.log(`[Room] Deleted ${deleteCount} annotations for room '${roomId}'`);
    });
    return true;
};

/**
 * Get the document ID from the room id.
 * The room id is in the format of "<docId>_default_room" or "<docId>_room_1"
 */
const getDocIdByRoomId = (roomId) => {
    // roomId is in the format of "docId_default_room" or "docId_room_1"
    if (!roomId || typeof roomId !== 'string') {
        return "";
    }
    const parts = roomId.split("_");
    const len = parts.length;
    if (len > 2) {
        // remove the last two parts, which are "default_room" or "room_n"
        parts.splice(len - 2, 2);
        // join the remaining parts to get the docId
        return parts.join("_");
    }
    return "";
};

/**
 * If a room is the default room of a document, it will end with "default_room".
 */
const isDefaultRoom = (roomId) => {
    return roomId.endsWith("default_room");
};

/**
 * Room id created by page https://<site>/document-collaboration.html is in format of
 * document_collaboration_room_<random string>
 */
const isDocumentCollaborationRoom = (roomId) => {
    return roomId.startsWith("document_collaboration_room_");
}

// TODO: postgres notification
// const { Client } = require('pg');
// async function listenToDbNotifications() {
//     const sequelize = db.sequelize;
//     const config = sequelize.config;
//     const client = new Client({
//         user: config.username,
//         host: config.host,
//         database: config.database,
//         password: config.password,
//         port: config.port,
//     });

//     try {
//         await client.connect();
//         console.log('notification client connected.');
//         await client.query('LISTEN frontend_add_annotation_channel');

//         client.on('notification', (msg) => {
//             console.log('Received DB notification:', msg.channel, msg.payload);
//             try {
//                 const rowData = JSON.parse(msg.payload);
//                 //console.log('Parsed row data:', rowData);
//                 const rooms = getAllRooms(rowData.doc_id).map(room => room.roomId);
//                 if (rooms.length === 0) {
//                     return; // No rooms to broadcast to
//                 }
//                 const broadCastMsg = {
//                     id: MessageId.NotifyAddingMarkup,
//                     body: { data: rowData }
//                 };

//                 io.to(rooms).emit(ROOM_MESSAGE, broadCastMsg);

//             } catch (error) {
//                 console.error('Error parsing notification payload or emitting socket event:', error);
//             }
//         });

//         client.on('error', (err) => {
//             console.error('PG client error (for notifications):', err);
//             client.end();
//             setTimeout(listenToDbNotifications, 5000);
//         });

//     } catch (err) {
//         console.error('Failed to connect PG notification client:', err);
//         setTimeout(listenToDbNotifications, 5000);
//     }
// }

// listenToDbNotifications();

// --- Polling for New Events ---
const POLLING_INTERVAL = 2000; // Poll every 2 seconds (adjust based on real-time needs vs. load)

async function pollForNewEvents() {
    try {
        // Find all unprocessed events of a specific type
        const newEvents = await db.annotation_event_log.findAll({
            where: {
                processedAt: null, // Only fetch events that haven't been processed
                eventType: 'add_annotation' // Filter by your event type
            },
            order: [['created_at', 'ASC']], // Process older events first
            limit: 50 // Limit the number of events processed per poll to avoid overwhelming
        });

        if (newEvents.length > 0) {
            console.log(`Found ${newEvents.length} new 'add_annotation' events.`);
            for (const event of newEvents) {
                const rowData = event.eventData; // This is the full JSON object
                // Emit the event data to all connected frontend clients via Socket.IO
                //console.log(`Processing event ${event.id} with data:`, rowData);
                //const rooms = getAllRooms().map(room => room.roomId);
                const rooms = getAllRooms(rowData.doc_id).map(room => room.roomId);
                if (rooms.length > 0) {
                    console.log(`Broadcasting to rooms: ${rooms.join(', ')}`);
                    const broadCastMsg = {
                        id: MessageId.NotifyAddingMarkup,
                        body: { data: rowData }
                    };
                    
                    io.to(rooms).emit(ROOM_MESSAGE, broadCastMsg);     
                }
                // Mark the event as processed to avoid re-sending it
                // event.processed_at = new Date();
                // await event.save(); // Update the processed_at timestamp
                await event.destroy();
                // console.log(`Event ${event.id} processed and deleted.`);
            }
        }
    } catch (error) {
        console.error('Error during event polling:', error);
    } finally {
        // Schedule the next poll
        setTimeout(pollForNewEvents, POLLING_INTERVAL);
    }
}

// Start the polling process
pollForNewEvents();

}

console.log("Websocket/room Initialized");