"use client";

import ChatRoom from "@/components/chatrooms";
import {
  ChatRoomsContext,
  createSocketConnection,
  socket,
} from "@/context/MessageContext";
import { ChatRoomModel } from "@/utils/types";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { use, useContext, useEffect, useState } from "react";

export default function Home() {
  const { chatRooms, _setChatRooms } = useContext(ChatRoomsContext);
  const [currentChatRoomOpen, setCurrentChatRoomOpen] =
    useState<ChatRoomModel>();

  const [searchOpen, setSearchOpen] = useState<boolean>(false);

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
        userName: data?.user?.name,
      },
      type: "message",
    };
    if (socket) {
      socket.send(JSON.stringify(_msg));
      (document.getElementById("message") as HTMLInputElement).value = "";
    } else {
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
    if (socket) {
      socket.send(JSON.stringify(_msg));
    } else {
      createSocketConnection(data, _setChatRooms);
    }
  }

  return (
    <div>
      <div className="grid grid-cols-12">
        {searchOpen && <Search data={data} setSearchOpen={setSearchOpen} />}
        {!searchOpen && (
          <ChatRoomsList
            chatRooms={chatRooms}
            setCurrentChatRoomOpen={setCurrentChatRoomOpen}
            data={data}
            setSearchOpen={setSearchOpen}
          />
        )}

        <ChatRoom
          currentChatRoomOpen={currentChatRoomOpen as ChatRoomModel}
          sendMessage={sendMessage}
          setTyping={setTyping}
          data={data}
        />
      </div>
      <button
        className="btn"
        onClick={() =>
          status === "authenticated" ? signOut() : router.push("/login")
        }
      >
        {status === "authenticated" ? "Sign Out" : "Sign In"}
      </button>
    </div>
  );
}

function ChatRoomsList({
  chatRooms,
  setCurrentChatRoomOpen,
  data,
  setSearchOpen,
}: {
  chatRooms: ChatRoomModel[];
  setCurrentChatRoomOpen: Function;
  data: any;
  setSearchOpen: Function;
}) {
  return (
    <div className="col-span-4  m-4  bg-indigo-800 rounded-lg">
      <div className="bg-white p-4 rounded-t-lg flex gap-2">
        <input
          className="w-full p-2 rounded-sm"
          type="text"
          placeholder="Search"
        />
        <button
          className="text-black font-extrabold text-4xl"
          onClick={() => {
            setSearchOpen(true);
          }}
        >
          +
        </button>
      </div>
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
              {(chatRoom.name === "oneToOne" && chatRoom.users.length !== 1) ||
              (chatRoom.name === null && chatRoom.users.length !== 1)
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
  );
}

function Search({
  data,
  setSearchOpen,
}: {
  data: any;
  setSearchOpen: Function;
}) {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  //   });
  useEffect(() => {
    fetch("http://localhost:3000/api/users")
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setSearchResults(res.users);
      });
  }, []);

  function search() {
    fetch(`http://localhost:3000/api/users/?contains=${searchInput}`)
      .then((res) => res.json())
      .then((res) => {
        setSearchResults(res.users);
      });
  }
  return (
    <div className="col-span-4  m-4  bg-indigo-800 rounded-lg">
      <div className="bg-white p-4 rounded-t-lg flex gap-2">
        <button
          className="text-black font-extrabold text-4xl"
          onClick={() => setSearchOpen(false)}
        >
          {" "}
          X
        </button>
        <input
          className="w-full p-2 rounded-sm"
          type="text"
          placeholder="Search"
          onChange={(e) => {
            setSearchInput(e.target.value);
            search();
          }}
        />
      </div>
      {searchResults?.map((user) => {
        return (
          <div
            key={user.email}
            className="bg-white text-black  p-2 border-4
               rounded-sm m-1"
          >
            <div className="font-bold">{user.name}</div>
            <div className="text-xs text-slate-600">{user.email}</div>
            <button
              className="btn"
              onClick={() => {
                fetch(`http://localhost:3000/api/chatroom/`, {
                  method: "POST",
                  body: JSON.stringify({
                    userEmails: [user.email, data?.user?.email],
                  }),
                })
                  .then((res) => res.json())
                  .then((res) => {
                    console.log(res);
                  });
              }}
            >
              Add
            </button>
          </div>
        );
      })}
    </div>
  );
}
