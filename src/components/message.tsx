const style1 = "flex flex-col items-end";
const style2 = "flex flex-col items-start";
export default function MessageElement({message, index, data} : {message: any, index: number, data: any}){
    return(
        <div
    className={
        message.userEmail === data?.user?.email ? style1 : style2
      }
      key={index}
      >
    {/* <span
      className="bg-white text-black m-2 max-w-fit py-1 px-2 rounded-md font-semibold"
      key={index}
      >
      {message.content}
    </span> */}
<div className="bg-white  m-2 max-w-fit  rounded-md " >
    <div className="bg-slate-500 rounded-t-md p-1 text-sm">
{message.userEmail === data?.user?.email ? "You" : message.userEmail}
    </div>
    <div className="font-semibold text-black p-2">
        {message.content}
    </div>
</div>

  </div>
    )
}