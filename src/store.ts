import { create } from "zustand";
import { ChatRoomModel } from "./utils/types";
import { ChatRoomOnUser, Message, User } from "@prisma/client";

interface Typing {
  userEmail: string;
  userName: string;
}
interface ChatRoomOnUserWithUser extends ChatRoomOnUser {
  user: User;
}

interface Store {
  typing: Typing[];
  messages: Message[];
  users: ChatRoomOnUserWithUser[];
  id: string;
  name: string;
  online: string[];
  setTyping: (typing: Typing[]) => void;
  setMessages: (messages: Message[]) => void;
  setUsers: (users: ChatRoomOnUserWithUser[]) => void;
  setId: (id: string) => void;
  setName: (name: string) => void;
  setOnline: (online: string[]) => void;
}

const useChatRoomStore = create<Store>((set) => ({
  typing: [],
  messages: [],
  users: [],
  id: "",
  name: "",
  online: [],
  setTyping: (typing) => set({ typing }),
  setMessages: (messages) => set({ messages }),
  setUsers: (users) => set({ users }),
  setId: (id) => set({ id }),
  setName: (name) => set({ name }),
  setOnline: (online) => set({ online }),
}));


interface ChatRoomsStore {
    chatRooms: ChatRoomModel[];
    addChatRoom: (chatRooms: ChatRoomModel) => void;
 }

export const useChatRoomsStore = create<ChatRoomsStore>((set) => ({
    chatRooms: [],
    addChatRoom: (chatRoom) => set((state) => ({ chatRooms: [...state.chatRooms, chatRoom] })),
    }));    
