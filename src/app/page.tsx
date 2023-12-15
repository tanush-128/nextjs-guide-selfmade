"use client";

import { User } from "@prisma/client";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface findChatRoomOnUser {
  chatRoomName: string | null;
  chatRoomId: string;
  users: User[];
}

export default function Home() {
  const router = useRouter();
  const { data, status } = useSession();
  if (status === "unauthenticated") {
    router.push("/login");
  }
  const [chatRooms, setChatRooms] = useState<findChatRoomOnUser[]>([]);

  useEffect(() => {
    const chatRoomIdsPromise = fetch(
      "http://localhost:3000/api/chatroom?userEmail=" + data?.user?.email
    );
    chatRoomIdsPromise.then((res) => {
      res.json().then((data) => {
        console.log(data);
        data.forEach((chatRoom: findChatRoomOnUser) => {
          if (chatRoom.users.length > 1) {
            setChatRooms((prev) => [...prev, chatRoom]);
          }
        });
        //  setChatRooms(data);
      });
    });
  }, [data?.user?.email]);

  return (
    <div>
      <div>
        {chatRooms?.map((chatRoom) => {
          return (
            <div
              onClick={() => {
                router.push( "/chat?chatRoomId=" + chatRoom.chatRoomId);
              }}
              key={chatRoom.chatRoomId}
              className="bg-white max-w-xs text-black  p-2 border-4
               rounded-sm m-1"
            >
              <div className="font-bold">
                {chatRoom.chatRoomName === "oneToOne"
                  ? chatRoom.users.filter(
                      (user) => user.email !== data?.user?.email
                    )[0].name
                  : chatRoom.chatRoomName}
              </div>
              <div className="text-xs text-slate-600">
                {chatRoom.users.map((user) => {
                  return <span key={user.email}>{user.name}, </span>;
                })}
              </div>
            </div>
          );
        })}
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
