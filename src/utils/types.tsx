import { ChatRoom, ChatRoomOnUser, Message, User } from "@prisma/client";
import { StoreApi, UseBoundStore, create } from "zustand";

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

interface Store {
  typing: Typing[];
  messages: Message[];
  users: ChatRoomOnUserWithUser[];
  id: string;
  name: string;
  online: string[];
  setTyping: (typing: Typing[]) => void;
  addMessage: (messages: Message[]) => void;
  setUsers: (users: ChatRoomOnUserWithUser[]) => void;
  setId: (id: string) => void;
  setName: (name: string) => void;
  addOnlineUser: (online: string) => void;
  setOffline: (offline: string) => void;
}

export class ChatRoomModel {
  id;
  name;
  users;
  useChatRoomStore: UseBoundStore<StoreApi<Store>>;
  constructor(chatRoom: ChatRoomType) {
    this.id = chatRoom.id;
    this.name = chatRoom.name;
    this.users = chatRoom.users;

    this.useChatRoomStore = create<Store>((set) => ({
      typing: [],
      messages: [],
      users: [],
      id: "",
      name: "",
      online: [],
      setTyping: (typing) => set({ typing }),
      addMessage: (messages) =>
        set((state) => ({ messages: [...state.messages, ...messages] })),
      setUsers: (users) => set({ users }),
      setId: (id) => set({ id }),
      setName: (name) => set({ name }),
      addOnlineUser: (online) =>
        set({ online: [...this.useChatRoomStore.getState().online, online] }),
      setOffline: (offline) =>
        set((state) => ({ online: state.online.filter((o) => o !== offline) })),
    }));
    this.storeInit(chatRoom);
  }
  storeInit(chatRoom: ChatRoomType) {
    chatRoom.messages.forEach((message) => {
      this.useChatRoomStore.getState().addMessage([message]);
    });
    this.useChatRoomStore.getState().setUsers(chatRoom.users);
    this.useChatRoomStore.getState().setId(chatRoom.id);
    this.useChatRoomStore.getState().setName(chatRoom.name!);
  }

  onSocketMessage(data: any) {
    console.log(data);
    switch (data.type) {
      case "message":
        this.onMessage(data);
        break;
      case "typing":
        this.onTyping(data);
        break;
      case "online":
        this.onOnline(data);
        break;
      case "offline":
        this.onOffline(data);
        break;
      default:
        break;
    }
  }
  onOnline(data: any) {
    this.useChatRoomStore.getState().addOnlineUser(data.data.userEmail);
  }
  onOffline(data: any) {}

  onMessage(data: any) {
    const newMessage = {
      id: Math.random().toString(36).substring(7),
      chatRoomId: data.data.chatRoomId,
      content: data.data.message,
      userEmail: data.data.userEmail,
      userName: data.data.userName,
      createdAt: new Date(),
    };
    this.useChatRoomStore.getState().addMessage([newMessage]);
  }
  onTyping(data: any) {
    this.useChatRoomStore.getState().setTyping([
      {
        userEmail: data.data.userEmail,
        userName: data.data.userName,
      },
    ]);
  }
}
