"use client";
import {
  createChatRoom,
  getChatRoomMessages,
  getUsers,
} from "@/actions/actions";
import ChatRoom from "@/components/chatrooms";
import { useChatRoomsStore } from "@/store";
import { ChatRoomModel } from "@/utils/types";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export let socket: WebSocket;

const init = async (userEmail: string) => {
  const _chatRooms = await getChatRoomMessages(userEmail);
  _chatRooms.forEach((chatRoom) => {
    // chatRooms.push(new ChatRoomModel(chatRoom));
    useChatRoomsStore.getState().addChatRoom(new ChatRoomModel(chatRoom));
  });

  socket = new WebSocket("ws://localhost:3001/?userEmail=" + userEmail);
  socket.onopen = () => {
    console.log("connected");
  };
  socket.onmessage = (event) => {
    const json = JSON.parse(event.data);

    useChatRoomsStore.getState().chatRooms.forEach((chatRoom) => {
      if (chatRoom.id === json.data.chatRoomId) {
        chatRoom.onSocketMessage(json);
      }
    });
  };
};

export default function Home() {
  const { data, status } = useSession();
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const chatRooms = useChatRoomsStore((state) => state.chatRooms);
  const [currentChatRoomOpenIndex, setCurrentChatRoomOpenIndex] =
    useState<number>(0);
  if (status === "unauthenticated") {
    redirect("/login");
  }
  useEffect(() => {
    console.log(data);
    if (data?.user?.email) init(data?.user?.email as string);

    return () => {
      if (socket) socket.close();
      console.log("closed");
    };
  }, [data?.user?.email]);
  return (
    <div>
      <div className="grid grid-cols-12">
        {searchOpen && <Search data={data} setSearchOpen={setSearchOpen} />}
        {!searchOpen && (
          <ChatRoomsList
            chatRooms={chatRooms}
            setCurrentChatRoomOpenIndex={setCurrentChatRoomOpenIndex}
            data={data}
            setSearchOpen={setSearchOpen}
          />
        )}
        {chatRooms && <ChatRoom i={currentChatRoomOpenIndex} data={data} />}
      </div>
      <button
        className="btn"
        onClick={() =>
          status === "authenticated" ? signOut() : redirect("/login")
        }
      >
        {status === "authenticated" ? "Sign Out" : "Sign In"}
      </button>
    </div>
  );
}

const ChatRoomsList = ({
  chatRooms,
  setCurrentChatRoomOpenIndex,
  data,
  setSearchOpen,
}: {
  chatRooms: ChatRoomModel[];
  setCurrentChatRoomOpenIndex: Function;
  data: any;
  setSearchOpen: Function;
}) => {
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
      {chatRooms?.map((chatRoom, index) => {
        return (
          <div
            onClick={() => {
              setCurrentChatRoomOpenIndex(index);
            }}
            key={chatRoom.id}
            className="bg-white text-black  p-2 border-4
               rounded-sm m-1"
          >
            <div className="font-bold">
              {" "}
              {(chatRoom?.name === "oneToOne" &&
                chatRoom?.users.length !== 1) ||
              (chatRoom?.name === null && chatRoom?.users.length !== 1)
                ? chatRoom?.users.filter(
                    (chatRoomOnUser) =>
                      chatRoomOnUser.user.email !== data?.user?.email
                  )[0].user.name
                : chatRoom?.name}
            </div>
          </div>
        );
      })}
    </div>
  );
};

function Search({
  data,
  setSearchOpen,
}: {
  data: any;
  setSearchOpen: Function;
}) {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const nameRef = useRef<HTMLInputElement>(null);
  //   });
  useEffect(() => {
    search();
  }, []);

  function search() {
    getUsers(searchInput).then((res) => {
      setSearchResults(res as any);
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
      {
        <div
          className="bg-white text-black  p-2 border-4
               rounded-sm m-1"
        >
          <div className="font-bold">Selected</div>
          <div className="text-xs text-slate-600">
            {selectedUsers.map((user) => {
              return (
                <span key={user.email}>
                  {user.name}
                  {" ,"}
                </span>
              );
            })}
          </div>
        </div>
      }
      {searchResults
        ?.filter((user) => user.email !== data?.user?.email)
        .map((user) => {
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
                  selectedUsers.filter((u) => u.email === user.email).length > 0
                    ? setSelectedUsers([
                        ...selectedUsers.filter((u) => u.email !== user.email),
                      ])
                    : setSelectedUsers([...selectedUsers, user]);
                  // setSelectedUsers([...selectedUsers, user]);
                  // createChatRoom("oneToOne", [user.email, data?.user?.email]);
                }}
              >
                {selectedUsers.filter((u) => u.email === user.email).length > 0
                  ? "Added"
                  : "Add"}
              </button>
            </div>
          );
        })}

      <div className="absolute">
        <input
          type="text"
          placeholder="Enter chat room name"
          id="name"
          ref={nameRef}
        />
        <button
          className="btn"
          onClick={() => {
            createChatRoom(nameRef.current?.value || "", [
              ...selectedUsers.map((u) => u.email),
              data?.user?.email,
            ]);
          }}
        >
          Create
        </button>
      </div>
    </div>
  );
}
