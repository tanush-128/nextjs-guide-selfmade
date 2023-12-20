import { _chatRooms } from "@/context/MessageContext";
import { ChatRoom, ChatRoomOnUser, Message, User } from "@prisma/client";

interface ChatRoomOnUserWithUser extends ChatRoomOnUser {
  user: User;
}

export interface ChatRoomType extends ChatRoom {
  messages: Message[];
  users: ChatRoomOnUserWithUser[];
}

interface Typing {
  userEmail: string;
  userName: string;
}

export class ChatRoomModel {
  typing: Typing[];
  messages;
  users;
  id;
  name;
  setChatRooms: any;
  online :string[] = [];
  constructor(chatRoom: ChatRoomType, setChatRooms: any) {
    this.messages = chatRoom.messages;
    this.users = chatRoom.users;
    this.id = chatRoom.id;
    this.name = chatRoom.name;
    this.setChatRooms = setChatRooms;
    this.typing = [];
      
    setInterval(() => {
      this.typing = [];
      this.setChatRooms([..._chatRooms]);
    }, 5000);
  }
  onSocketMessage(data: any) {
    console.log(data);
    if (data.type === "message") {
      this.onMessage(data);
    }  if (data.type === "typing") {
      this.onTyping(data);
    } if (data.type === "online") {
      console.log(data.data);
      if(!this.online.includes(data.data.userEmail)){

        this.online.push(data.data.userEmail);
      }
      console.log(this.online);
      this.setChatRooms([..._chatRooms]);
    }
    //handle message with type "offline"
    if (data.type === "offline") {
      console.log(data.data);
      this.online = this.online.filter((userEmail) => userEmail !== data.data.userEmail);
      console.log(this.online);
      this.setChatRooms([..._chatRooms]);
    }
  }
  onMessage(data: any) {
    this.messages.push({
      id: Math.random().toString(36).substring(7),
      chatRoomId: data.data.chatRoomId,
      content: data.data.message,
      userEmail: data.data.userEmail,
      userName: data.data.userName,
      createdAt: new Date(),
    });

    this.setChatRooms([..._chatRooms]);
  }
  onTyping(data: any) {
   
  
    if (!this.typing.find((user) => user.userEmail === data.data.userEmail)) {
      this.typing.push({
        userEmail: data.data.userEmail,
        userName: data.data.userName,
      });
    }

    this.setChatRooms([..._chatRooms]);
  }
}
