"use client";

import { ChatRoomWithMessagesAndUsers } from "@/utils/types";
import { useSession } from "next-auth/react";
import { createContext, useEffect, useState } from "react";

export const ChatRoomsContext = createContext({
  chatRooms: [] as ChatRoomWithMessagesAndUsers[],
 
});



export let socket: WebSocket;
var _chatRooms: ChatRoomWithMessagesAndUsers[] = [];

export const ChatRoomsContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data, status } = useSession();
  const [chatRooms, setChatRooms] = useState<ChatRoomWithMessagesAndUsers[]>(
    []
  );

  useEffect(() => {
    if (data?.user?.email) {
      socket = new WebSocket(
        "ws://localhost:3001/?userEmail=" + data?.user?.email
      );
      socket.onopen = () => {
        console.log("connected");
      };

      socket.onmessage = (event: any) => {
        const data = JSON.parse(event.data);
        if (data.type === "chatrooms") {
          setChatRooms([...data.data]);
          _chatRooms = data.data;
        }
        if (data.type === "message") {
          console.log(data.data.message);

          _chatRooms.forEach((chatRoom) => {
            console.log(chatRoom.messages.length);
            if (chatRoom.id === data.data.chatRoomId) {
              chatRoom.messages.push({
                id: Math.random().toString(36).substring(7),
                chatRoomId: data.data.chatRoomId,
                content: data.data.message,
                createdAt: new Date(),
                userEmail: data.data.userEmail,
              });
              console.log(chatRoom.messages.length);
            }
          });
          console.log(_chatRooms);

          setChatRooms([..._chatRooms]);
        }
      };
    }

    return () => {
      if (socket) socket.close();
      console.log("disconnected");
    };
  }, [data?.user?.email]);

 

  return (
    <ChatRoomsContext.Provider value={{ chatRooms }}>
      {children}
    </ChatRoomsContext.Provider>
  );
};
