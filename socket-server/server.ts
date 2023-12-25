import { WebSocketServer } from "ws";
import { PrismaClient } from "@prisma/client";
import { ChatRoomModel, ChatRoomType } from "@/utils/types";

// const ws =require("ws")



const users: UserConnection[] = [];

class UserConnection {
  chatrooms: ChatRoomType[] = [];
  userEmail: string;
  ws: WebSocket;

  constructor(userEmail: string, ws: WebSocket) {
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
      this.NotifyOnlineUsers();
    });

    this.ws.onmessage = (message) => {
      const _message = JSON.parse(message.data);
      if (_message.type === "message") {
      
        this.onMessage(_message);
      }
      if (_message.type === "typing") {
       
        this.onTyping(_message);
      }
      if(_message.type ==="offer" || _message.type ==="answer" || _message.type ==="icecandidate" || _message.type ==="leave"){
        console.log(message)
        users.forEach((user) => {
          if (user.userEmail === _message.data.userEmail && user.userEmail !== this.userEmail) {
            user.sendMessage(_message);
          }
        });
      }
    
    };

    this.ws.onclose = () => {
      // when user closes the connection notify the other users which have a chatroom common with this user
        users.forEach((user) => {
            if (user.userEmail !== this.userEmail) {
            user.chatrooms.forEach((chatroom) => {
                this.chatrooms.forEach((_chatroom) => {
                if (chatroom.id === _chatroom.id) {
                    user.sendMessage({
                    type: "offline",
                    data: {
                        chatRoomId: chatroom.id,
                        userEmail: this.userEmail,
                    },
                    });
                }
                });
            });
            }
        });  
      users.splice(users.indexOf(this), 1);
    };
  }

  NotifyOnlineUsers = () => {
    console.log("open");
//check if user is online then notify other users which have a chatroom common with this user and also notify this user about other online users
    users.forEach((user) => {
      if (user.userEmail !== this.userEmail) {
        user.chatrooms.forEach((chatroom) => {
          this.chatrooms.forEach((_chatroom) => {
            if (chatroom.id === _chatroom.id) {
              user.sendMessage({
                type: "online",
                data: {
                  chatRoomId: chatroom.id,
                  userEmail: this.userEmail,
                },
              });
              this.sendMessage({
                type: "online",
                data: {
                  chatRoomId: chatroom.id,
                  userEmail: user.userEmail,
                },
              });
            }
          });
        });
      }
    });
   


    
  };

  onTyping(message: {
    data: { chatRoomId: string; userEmail: string };
    type: "typing";
  }) {
    users.forEach((user) => {
      user.chatrooms.forEach((chatroom) => {
        if (chatroom.id === message.data.chatRoomId) {
          user.sendMessage(message);
        }
      });
    });
  }

  onMessage(message: {
    data: {
      chatRoomId: string;
      message: string;
      userName: string;
      userEmail: string;
    };
    type: "message";
  }) {
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
      message.data.message,
      message.data.userName
    );
  }

  sendMessage(message: { data: any; type: string }) {
  
    this.ws.send(JSON.stringify(message));
  }
}
// upgrade socketserver to  ws:// to wss://


const wss = new WebSocketServer({ port: 3001 });


const prisma = new PrismaClient();

async function getChatRoomMessages(userEmail: string) {
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

async function setChatRoomUsers(
  _chatRoomId: string,
  userEmail: string,
  content: string,
  userName: string
) {
  const messages = await prisma?.message.create({
    data: {
      chatRoomId: _chatRoomId,
      userEmail: userEmail,
      content: content,
      userName: userName,
    },
  });
}

wss.on("connection", function (ws: WebSocket, incomingMessage) {
  const searchParams = new URL(
    incomingMessage.url as string,
    "ws://localhost:3001"
  );
  const userEmail: string = searchParams.searchParams.get(
    "userEmail"
  ) as string;
  const user = new UserConnection(userEmail, ws);
  users.push(user);
});

