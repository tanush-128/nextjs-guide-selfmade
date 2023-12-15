"use client";
import { Message } from "@prisma/client";
import { randomUUID } from "crypto";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";



let socket: WebSocket;
let _messages: Message[] = [];
let id = "clq595cnu00007kdovmuwfwki";
export default function Chat() {
  const searchParams = useSearchParams();
  // const searchParams = new URL(req.url);
  const roomId =  searchParams.get("chatRoomId");
  // const roomId = searchParams.searchParams.get("chatRoomId");
  const { status, data,update } = useSession();
  console.log(data);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect( () => {
    socket = new WebSocket("ws://localhost:3001/?roomId=" + roomId);
    // socket = new WebSocket("wss://8kdvhcgk-3001.inc1.devtunnels.ms/");
    
  
    socket.onopen = () => {
      console.log("connected");

    
    };

    socket.onmessage = (event: any) => {
      const message: Message = JSON.parse(event.data);
      console.log(message);

      _messages.push(message);
      setMessages([..._messages]);
    };

    return () => {
      socket.close();
      console.log("disconnected");
    };
  }, []);

  const sendMessage = () => {
    const currentMessageText = (
      document.getElementById("message") as HTMLInputElement
    ).value;
    console.log(currentMessageText);
    console.log(messages);
    const currentMessage : Message = {
      chatRoomId: roomId as string,
      content: currentMessageText,
      createdAt: new Date(),
      userId: "clq68ywmc0005tmdzc6zx2qjz",
      id: "kjfsdlfjldsf2344",
    }

    socket.send(
      JSON.stringify(currentMessage)
    );

    (document.getElementById("message") as HTMLInputElement).value = "";
  };
  const style1 = "flex flex-col items-end";
  const style2 = "flex flex-col items-start";
  return (
    <div>
      <div className="flex flex-col">
        {messages.map((message, index) => (
          <div className={message.userId === id ? style1 : style2} key={index}>
            <span
              className="bg-white text-black m-2 max-w-fit py-1 px-2 rounded-md font-semibold"
              key={index}
            >
              {message.content}
            </span>
          </div>
        ))}
      </div>

      <input type="text" placeholder="Enter your message..." id="message" />

      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
