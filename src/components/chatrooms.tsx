// import { User } from "next-auth";
// interface findChatRoomOnUser {
//     chatRoomName: string | null;
//     chatRoomId: string;
//     users: User[];
//   }

// export default  function  ChatRooms({email}: {email: string}) {
//     const data =  fetch(
//         "http://localhost:3000/api/chatroom?userEmail=" + email
//         ).then((res) => res.json());
//   const chatRooms: findChatRoomOnUser[] = data;
      
      
//     return(
//         <div>
//         {chatRooms?.map((chatRoom) => {
//           return (
//             <div>
//               <p>{chatRoom.chatRoomName}</p>
//               <p>{chatRoom.chatRoomId}</p>
//             </div>
//           );
//         })}
//       </div>
//     )
// }