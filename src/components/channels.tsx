import { ChatRoomModel } from "@/utils/types";

export const ChatRoomsList = ({
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
    <div className="col-span-2 bg-bg_1 b">
      <div className="bg-white p-1  flex gap-2">
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
      <div className="b p-2">Channels</div>
      {chatRooms?.map((chatRoom, index) => {
        return (
          <div
            onClick={() => {
              setCurrentChatRoomOpenIndex(index);
            }}
            key={chatRoom.id}
            className=""
          >
            <div className="font-bold py-1 px-4">
              {"# "}
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
