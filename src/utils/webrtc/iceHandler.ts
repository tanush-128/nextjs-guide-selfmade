// import { socket } from "@/context/MessageContext";
// import { sendIceCandidate } from "./signalHandler";
// import { peerConnection, startCall } from "./mainHandler";

// export const handleNewIceCandidateMsg = async (candidate: RTCIceCandidate) => {
//   if (candidate) {
//     console.log("remote icecandidate: ", candidate);
//     if (peerConnection.currentRemoteDescription !== null) {
//       await peerConnection.addIceCandidate(candidate);
//     }
//   }
// };

// export const handleICECandidateEvent = async (
//   event: RTCPeerConnectionIceEvent,
//   userEmail: string
// ) => {
//   if (event.candidate) {
//     console.log("sending icecandidate: ", event.candidate);

//     sendIceCandidate(event.candidate, userEmail);
//   }

//   console.log("sending icecandidate: complete");
// };
