const style1 = "flex flex-col items-end";
const style2 = "flex flex-col items-start";
export default function MessageElement({
  message,
  data,
}: {
  message: any;
  data: any;
}) {
  return (
    <div className="flex  hover:bg-message_bg p-1 py-2">
      <div className="w-12 h-12   bg-pink-300 rounded-md mx-2 ">
        <img className="rounded-md" src={data.user.image} alt="" />
      </div>
      <div className="">
        <div className="font-bold text-lg">
          {message.userEmail === data?.user?.email ? "You" : message.userName}
        </div>
        <div className="text-base">{message.content}</div>
      </div>
    </div>
  );
}
