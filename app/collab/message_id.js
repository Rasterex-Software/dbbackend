const MessageId = {
    JoinRoom: "JoinRoom",
    LeaveRoom: "LeaveRoom",
    CreateRoom: "CreateRoom",
    DeleteRoom: "DeleteRoom",
    GetAllRooms: "GetAllRooms",
    GetRoomsByDocId: "GetRoomsByDocId",
    GetRoomParticipants: "GetRoomParticipants",
    SetRoomPresenter: "SetRoomPresenter",
    RemoveRoomPresenter: "RemoveRoomPresenter",
    ChatMessage: "ChatMessage",
    HasMarkupForRoom: "HasMarkupForRoom",
    DeleteMarkupsForRoom: "DeleteMarkupsForRoom",
    AddMarkup: "AddMarkup",
    UpdateMarkup: "UpdateMarkup",
    DeleteMarkup: "DeleteMarkup",
    NotifyAddingMarkup: "NotifyAddingMarkup",
    GuiModeChange: "GuiModeChange", // view, annotation, measure, etc.
    PanChange: "PanChange",
    PageRectChange: "PageRectChange",
    ZoomChange: "ZoomChange",
    RotationChange: "RotationChange",
    BackgroundColorChange: "BackgroundColorChange",
    PageChange: "PageChange",
    MonoChromeChange: "MonoChromeChange",
    VectorLayersVisibilityChange: "VectorLayersVisibilityChange",
    VectorBlocksVisibilityChange: "VectorBlocksVisibilityChange",
    VectorBlockSelectChange: "VectorBlockSelectChange",
    UnselectAllVectorBlocks: "UnselectAllVectorBlocks"
};

const MESSAGE_ID = "id";
const MESSAGE_BODY = "body";
const MESSAGE_TOKEN = "token";

module.exports = { MessageId, MESSAGE_ID, MESSAGE_BODY, MESSAGE_TOKEN };
