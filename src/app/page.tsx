"use client";

import ChatRoom from "@/components/chatrooms";
import { ChatRoomsContext, createSocketConnection, socket } from "@/context/MessageContext";
import { ChatRoomModel} from "@/utils/types";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { use, useContext, useState } from "react";

export default function Home() {
  const { chatRooms, _setChatRooms } = useContext(ChatRoomsContext);
  const [currentChatRoomOpen, setCurrentChatRoomOpen] =
    useState<ChatRoomModel>();

  const router = useRouter();
  const { data, status } = useSession();
  if (status === "unauthenticated") {
    router.push("/login");
  }
  const debounce = <T extends (...args: any[]) => void>(func: T, delay: number) => {
    let timeoutId: NodeJS.Timeout;
  
    return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };
  
  

  
  function sendMessage() {
    const message = (document.getElementById("message") as HTMLInputElement)
      .value;
    const _msg = {
      data: {
        message: message,
        chatRoomId: currentChatRoomOpen?.id,
        userEmail: data?.user?.email,
        userName: data?.user?.name,
      },
      type: "message",
    };
    if(socket){
      socket.send(JSON.stringify(_msg));
      (document.getElementById("message") as HTMLInputElement).value = "";

    }
    else{
      createSocketConnection(data, _setChatRooms);
    }
   
  
  }
  function setTyping() {
     const messages_list = document.getElementById("messages_list");
      messages_list?.scrollTo(0, messages_list.scrollHeight);
    const _msg = {
      data: {
        chatRoomId: currentChatRoomOpen?.id,
        userEmail: data?.user?.email,
      },
      type: "typing",
    };
    if(socket){
      socket.send(JSON.stringify(_msg));
    }
    else{
      createSocketConnection(data, _setChatRooms);
    }
  }
   

  return (
    <div>
      <div className="grid grid-cols-12">
        <div className="col-span-4 p-6 m-12  bg-indigo-800 rounded-lg">
          {chatRooms?.map((chatRoom) => {
            return (
              <div
                onClick={() => {
                  setCurrentChatRoomOpen(chatRoom);
                }}
                key={chatRoom.id}
                className="bg-white text-black  p-2 border-4
               rounded-sm m-1"
              >
                <div className="font-bold">
                  {chatRoom.name === "oneToOne" && chatRoom.users.length !== 1
                    ? chatRoom.users.filter(
                        (chatRoomOnUser) =>
                          chatRoomOnUser.user.email !== data?.user?.email
                      )[0].user.name
                    : chatRoom.name}
                </div>
                <div className="text-xs text-slate-600">
                  {chatRoom.users.map((chatRoomOnUser) => {
                    return (
                      <span key={chatRoomOnUser.user.email}>
                        {chatRoomOnUser.user.name},{" "}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <ChatRoom currentChatRoomOpen={currentChatRoomOpen as ChatRoomModel} sendMessage={sendMessage} setTyping={setTyping}  data={data}/>
      </div>
      <button className="btn"
        onClick={() =>
          status === "authenticated" ? signOut() : router.push("/login")
        }
      >
        {status === "authenticated" ? "Sign Out" : "Sign In"}
      </button>
    </div>
  );
}
