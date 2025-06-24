const MessageId = {
    JoinRoom: "JoinRoom",
    LeaveRoom: "LeaveRoom",
    CreateRoom: "CreateRoom",
    DeleteRoom: "DeleteRoom",
    GetAllRooms: "GetAllRooms",
    GetRoomsByDocId: "GetRoomsByDocId",
    GetRoomParticipants: "GetRoomParticipants",
    ChatMessage: "ChatMessage",
    HasMarkupForRoom: "HasMarkupForRoom",
    DeleteMarkupsForRoom: "DeleteMarkupsForRoom",
    AddMarkup: "AddMarkup",
    UpdateMarkup: "UpdateMarkup",
    DeleteMarkup: "DeleteMarkup",
    NotifyAddingMarkup: "NotifyAddingMarkup",
};

const MESSAGE_ID = "id";
const MESSAGE_BODY = "body";
const MESSAGE_TOKEN = "token";

module.exports = { MessageId, MESSAGE_ID, MESSAGE_BODY, MESSAGE_TOKEN };
