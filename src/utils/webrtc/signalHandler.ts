"use client";
import { socket } from "@/context/MessageContext";
import { connections, joinCall } from "./mainHandler";

export const ReadWebRTCSignal = async (data: any) => {
  if (
    data.offer.type === "call" &&
    data.data.userEmails !== null &&
    data.data.userEmails.length > 0
  ) {
    await joinCall(data.data.userEmails, data.data.selfEmail);
  } else if (data.offer?.type === "offer") {
    console.log("received offer: ", data.offer);
    console.log(connections);
    connections.forEach((connection) => {
      if (connection.to === data.data.from) {
        connection.createAnswer(data.offer as RTCSessionDescriptionInit);
        console.log("sending answer");
      }
    });
  } else if (data.offer?.type === "answer") {
    console.log("received offer: ", data.offer);
    connections.forEach((connection) => {
      if (connection.to === data.data.from) {
        connection.handleAnswer(data.offer as RTCSessionDescriptionInit);
      }
    });
  } else {
   
    connections.forEach((connection) => {
      if (connection.to === data.data.from) {
        connection.handleNewIceCandidateMsg(data.offer as RTCIceCandidate);
      }
    });
  }
};

export const sendWebRTCOffer = (
  offer: RTCSessionDescriptionInit,
  from: string,
  to: string
) => {
  socket.send(
    JSON.stringify({
      type: "webrtc",
      offer: offer,
      data: {
        to: to,
        from: from,
      },
    })
  );
};

export const sendIceCandidate = (
  candidate: RTCIceCandidate,
  to: string,
  from: string
) => {
  socket.send(
    JSON.stringify({
      type: "webrtc",
      offer: candidate,
      data: {
        to: to,
        from: from,
      },
    })
  );
};

export const sendWebRTCCall = (userEmails: string[]) => {
  socket.send(
    JSON.stringify({
      type: "webrtc",
      offer: { type: "call" },
      data: {
        userEmails: userEmails,
      },
    })
  );
};
