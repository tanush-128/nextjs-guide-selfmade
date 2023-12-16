"use client";

import ChatRoom from "@/components/chatrooms";
import { ChatRoomsContext, socket } from "@/context/MessageContext";
import { ChatRoomWithMessagesAndUsers } from "@/utils/types";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";

export default function Home() {
  const { chatRooms } = useContext(ChatRoomsContext);
  const [currentChatRoomOpen, setCurrentChatRoomOpen] =
    useState<ChatRoomWithMessagesAndUsers>();

  const router = useRouter();
  const { data, status } = useSession();
  if (status === "unauthenticated") {
    router.push("/login");
  }
  function sendMessage() {
    const message = (document.getElementById("message") as HTMLInputElement)
      .value;
    const _msg = {
      data: {
        message: message,
        chatRoomId: currentChatRoomOpen?.id,
        userEmail: data?.user?.email,
      },
      type: "message",
    };
    socket.send(JSON.stringify(_msg));
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
        <ChatRoom currentChatRoomOpen={currentChatRoomOpen as ChatRoomWithMessagesAndUsers} sendMessage={sendMessage} data={data}/>
      </div>
      <button
        onClick={() =>
          status === "authenticated" ? signOut() : router.push("/login")
        }
      >
        {status === "authenticated" ? "Sign Out" : "Sign In"}
      </button>
    </div>
  );
}
