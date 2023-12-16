const ws = new require("ws");
const { PrismaClient } = require("@prisma/client");

const users = [];

class UserConnection {
  chatrooms;
  constructor(userEmail, ws) {
    this.userEmail = userEmail;
    this.ws = ws;
    getChatRoomMessages(userEmail).then((chatrooms) => {
      this.chatrooms = chatrooms;
      this.ws.send(
        JSON.stringify({
          type: "chatrooms",
          data: chatrooms,
        })
      );
    });
    this.ws.on("message", (message) => {
      
      this.onMessage(message.toString());
    });
  }
  onMessage(_message) {
    const message = JSON.parse(_message);
    if (message.type === "message") {
     
      users.forEach((user) => {
        user.chatrooms.forEach((chatroom) => {
          if (chatroom.id === message.data.chatRoomId) {
            user.sendMessage(message);
          }
        });
      });
      setChatRoomUsers(
        message.data.chatRoomId,
        this.userEmail,
        message.data.message
      );
    }
  }

  sendMessage(message) {
    this.ws.send(JSON.stringify(message));
  }
}

const wss = new ws.Server({ port: 3001 });

const prisma = new PrismaClient();

async function getChatRoomMessages(userEmail) {
  const chatrooms = await prisma.chatRoom.findMany({
    where: {
      users: {
        some: {
          user: {
            email: userEmail,
          },
        },
      },
    },
    include: {
      messages: true,
      users: {
        include: {
          user: true,
        },
      },
    },
  });

  return chatrooms;
}

async function setChatRoomUsers(_chatRoomId, userEmail, content) {
  const messages = await prisma?.message.create({
    data: {
      chatRoomId: _chatRoomId,
      userEmail: userEmail,
      content: content,
    },
  });
}

wss.on("connection", function (ws, incomingMessage) {
  const searchParams = new URL(incomingMessage.url, "ws://localhost:3001");
  const userEmail = searchParams.searchParams.get("userEmail");
  const user = new UserConnection(userEmail, ws);
  users.push(user);

});
