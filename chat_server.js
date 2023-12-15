const ws = new require("ws");
const { PrismaClient } = require('@prisma/client')


const chatrooms = [];

const wss = new ws.Server({ port: 3001 });


const prisma = new PrismaClient();

async function getChatRoomMessages(chatRoomId) {
    const messages = await prisma.message.findMany({
        where: {
        chatRoomId: chatRoomId,
        },
    });
    return messages;
}

async function setChatRoomUsers(_chatRoomId, userId, content) {
  const messages =await prisma?.message.create({
    data: {
      
      chatRoomId: _chatRoomId,
      userId: userId,
      content: content,
    },
  });
  
}

 

wss.on("connection", function (ws, incomingMessage) {

  const searchParams = new URL(incomingMessage.url, "http://localhost:3001");
  const roomId = searchParams.searchParams.get("roomId");
  getChatRoomMessages(roomId).then((messages) => {
    for(let message of messages){
    ws.send(JSON.stringify(message));}
  });

  const in_chat_room = chatrooms.find((chatroom) => chatroom.roomId === roomId);
  if (in_chat_room) {
    if (!in_chat_room.users_ws.includes(ws)) {
      in_chat_room.users_ws.push(ws);
    }
  } else {
    chatrooms.push({
      roomId: roomId,
      users_ws: [ws],
    });
  }

  ws.on("close", function () {
    console.log("onclose");
    for (let chatroom of chatrooms) {
      const clients = chatroom.users_ws;
      const index = clients.indexOf(ws);
      if (index > -1) {
        clients.splice(index, 1);
        console.log(chatrooms);
      }
    }
  });
  ws.on("message", function (data) {
    const message = JSON.parse(data);
    const _roomId = message.chatRoomId;
    console.log(message);
   setChatRoomUsers(message.chatRoomId, message.userId, message.content);
    const chatroom = chatrooms.find((chatroom) => chatroom.roomId === _roomId);
    const clients = chatroom.users_ws;
    clients.forEach((client) => {
      client.send(JSON.stringify(message));
    });
  });


});

