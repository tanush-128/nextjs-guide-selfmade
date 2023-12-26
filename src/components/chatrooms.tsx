import { ChatRoomModel } from "@/utils/types";
import { ReactNode } from "react";
import MessageElement from "./message";
import { socket } from "@/app/page";
import { useChatRoomsStore } from "@/store";

export default function ChatRoom({
  i,
  data,
}: {
 i: number;
  data: any;
  }): ReactNode {
  if(useChatRoomsStore.getState().chatRooms.length === 0) return <div></div>
  const chatRoom = useChatRoomsStore.getState().chatRooms[i].useChatRoomStore((state) => state);

  function sendMessage() {
    const message = (document.getElementById("message") as HTMLInputElement)
      .value;
    const _msg = {
      data: {
        message: message,
        chatRoomId: chatRoom?.id,
        userEmail: data?.user?.email,
        userName: data?.user?.name,
      },
      type: "message",
    };
    if (socket) {
      socket.send(JSON.stringify(_msg));
      (document.getElementById("message") as HTMLInputElement).value = "";
    }
  }
  function setTyping() {
    const messages_list = document.getElementById("messages_list");
    messages_list?.scrollTo(0, messages_list.scrollHeight);
    const _msg = {
      data: {
        chatRoomId: chatRoom?.id,
        userEmail: data?.user?.email,
        userName: data?.user?.name,
      },
      type: "typing",
    };
    if (socket) {
      socket.send(JSON.stringify(_msg));
    }
  }

  return (
    <div className="col-span-8 h-screen p-12 ">
      <div className="col-span-9 h-full  box-border flex flex-col  bg-indigo-800 rounded-lg relative ">
        <div className="bg-white rounded-t-lg p-4">
          <div>
            <div className="font-bold text-black text-xl">
              {(chatRoom?.name === "oneToOne" &&
                chatRoom?.users.length !== 1) ||
              (chatRoom?.name === null && chatRoom?.users.length !== 1)
                ? chatRoom?.users.filter(
                    (chatRoomOnUser) =>
                      chatRoomOnUser.user.email !== data?.user?.email
                  )[0].user.name
                : chatRoom?.name}
            </div>
            <div className="text-xs text-slate-600">
              {chatRoom?.users.map((chatRoomOnUser) => {
                return (
                  <span key={chatRoomOnUser.user.email}>
                    {chatRoomOnUser.user.name}
                    {" ,"}
                  </span>
                );
              })}
            </div>
          </div>
          <div className="text-black">{chatRoom?.online.length}</div>
        </div>
        <div className="flex flex-col p-6  overflow-y-auto" id="messages_list">
          {chatRoom?.messages.map((message, index) => (
            <MessageElement message={message} key={index} data={data} />
          ))}
          {chatRoom?.typing.length > 0 && (
            <div>
              {chatRoom?.typing.map((user) => {
                return (
                  <MessageElement
                    message={{
                      content: "...typing",
                      userEmail: user.userEmail,
                      userName: user.userName,
                    }}
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
