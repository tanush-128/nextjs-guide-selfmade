import { ChatRoomModel } from "@/utils/types";
import { ReactNode, use, useEffect } from "react";

import MessageElement from "./message";

export default function ChatRoom({

  currentChatRoomOpen,
  sendMessage,
  setTyping,
  data,
}: {
  currentChatRoomOpen: ChatRoomModel;
  sendMessage: any;
  setTyping: any;
  data: any;
}): ReactNode {

   
  return (
    <div className="col-span-8 h-screen p-12 ">
      <div className="col-span-9 h-full  box-border flex flex-col  bg-indigo-800 rounded-lg relative ">
        <div className="bg-white rounded-t-lg p-4">
            <div>

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
                  {chatRoomOnUser.user.name}{" ,"}
                </span>
              );
            })}
          </div>
            </div>
            <div className="text-black">
                {currentChatRoomOpen?.online.length}
            </div>
        </div>
        <div className="flex flex-col p-6  overflow-y-auto" id="messages_list">
          {currentChatRoomOpen?.messages.map((message, index) => (
            <MessageElement message={message} key={index} data={data} />
          ))}
          {currentChatRoomOpen?.typing.length > 0 && (
            <div>
              {currentChatRoomOpen?.typing.map((user) => {
                return (
                  <MessageElement
                    message={{ content: "...typing", userEmail: user.userEmail, userName: user.userName }}
                    key={user.userEmail}
                    data={data}
                  />
                );
              })}
            </div>
          )}
        </div>

        <div className="w-full flex justify-end ">
          <input
            type="text"
            placeholder="Enter your message..."
            id="message"
            onChange={() => {
              setTyping();
            }}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                sendMessage();
                // console.log("enter");
              }
            }}
          />

          <button className="btn btn-primary" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
