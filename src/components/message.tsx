const style1 = "flex flex-col items-end";
const style2 = "flex flex-col items-start";
export default function MessageElement({message, data} : {message: any, data: any}){

return(
  <div >
    <div className={ message.userEmail === data?.user?.email ?"chat chat-end": "chat-start"}>
  <div className="chat-header">
    {message.userEmail === data?.user?.email ? "You" : message.userName}
    <time className="text-xs opacity-50">2 hours ago</time>
  </div>
  <div className="chat-bubble">{message.content}</div>
  <div className="chat-footer opacity-50">
    Seen
  </div>
</div>

  </div>
)
}