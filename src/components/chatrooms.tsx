import { ChatRoomWithMessagesAndUsers } from "@/utils/types";
import { ReactNode } from "react";


import MessageElement from "./message";


export default function ChatRoom({currentChatRoomOpen, sendMessage, data}: {currentChatRoomOpen: ChatRoomWithMessagesAndUsers, sendMessage: any, data: any}):ReactNode {
    return(
    <div className="col-span-8 h-screen p-12">

    <div className="col-span-9 h-full  box-border   bg-indigo-800 rounded-lg relative ">
    <div className="bg-white rounded-t-lg p-4">
        <div className="font-bold text-black text-xl">
            {currentChatRoomOpen?.name === "oneToOne" &&
            currentChatRoomOpen?.users.length !== 1
            ? currentChatRoomOpen?.users.filter(
                (chatRoomOnUser) =>
                    chatRoomOnUser.user.email !== data?.user?.email
                )[0].user.name
            : currentChatRoomOpen?.name}
        </div>
        <div className="text-xs text-slate-600">
            {currentChatRoomOpen?.users.map((chatRoomOnUser) => {
            return (
                <span key={chatRoomOnUser.user.email}>
                {chatRoomOnUser.user.name},{" "}
                </span>
            );
            })}
        </div>
    </div>
    <div className="flex flex-col p-6">
      {currentChatRoomOpen?.messages.map((message, index) => (
       <MessageElement message={message} index={index} data={data} />
      ))}
    </div>

<div className="w-full flex justify-end right-0 bottom-0 absolute p-4 ">

    <input type="text" placeholder="Enter your message..." id="message" />

    <button onClick={sendMessage}>Send</button>
</div>
  </div>
      </div>
    )
}