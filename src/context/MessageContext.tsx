"use client";

import { ChatRoomModel, ChatRoomType } from "@/utils/types";
import { useSession } from "next-auth/react";
import { createContext, useEffect, useState } from "react";

export const ChatRoomsContext = createContext({
  chatRooms: [] as ChatRoomModel[],
  _setChatRooms: (chatRooms: ChatRoomModel[]) => {
g
  },
});

export let socket: WebSocket;
export var _chatRooms: ChatRoomModel[] = [];

export function createSocketConnection(data: any, setChatRooms: any){
  socket = new WebSocket(
    "ws://localhost:3001/?userEmail=" + data?.user?.email
  );
  socket.onopen = () => {
    console.log("connected");
  };

  socket.onmessage = (event: any) => {

    const data = JSON.parse(event.data);
    console.log(data);
    if (data.type === "chatrooms") {
      _chatRooms = [
        ...data.data.map((c: any) => new ChatRoomModel(c, setChatRooms)),
      ];
      setChatRooms(_chatRooms);
    } else {
      _chatRooms
        .find((chatRoom) => chatRoom.id === data.data.chatRoomId)
        ?.onSocketMessage(data);
    }
  };
}

export const ChatRoomsContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data, status } = useSession();
  const [chatRooms, setChatRooms] = useState<ChatRoomModel[]>([]);
   function _setChatRooms (chatRooms: ChatRoomModel[]) {
    setChatRooms(chatRooms);
   };

  useEffect(() => {
    if (data?.user?.email) {
      createSocketConnection(data, setChatRooms);
    }

    return () => {
      if (socket) socket.close();
      console.log("disconnected");
    };
  }, [data?.user?.email]);

  return (
    <ChatRoomsContext.Provider value={{ chatRooms,_setChatRooms }}>
      {children}
    </ChatRoomsContext.Provider>
  );
};
