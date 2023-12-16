import { ChatRoom, ChatRoomOnUser, Message, User } from "@prisma/client";

export interface ChatRoomOnUserWithUser extends ChatRoomOnUser {
    user: User;
  }
  
export interface ChatRoomWithMessagesAndUsers extends ChatRoom {
    messages: Message[];
    users: ChatRoomOnUserWithUser[];
  }