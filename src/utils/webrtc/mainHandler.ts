import { setUpLocalStream, updateRemoteVideo } from "./uiHandler";
import {
  sendIceCandidate,
  sendWebRTCCall,
  sendWebRTCOffer,
} from "./signalHandler";

let localStream: MediaStream;
let remoteStreams: MediaStream[];

var pcConfig = {
  iceServers: [
    // { urls: "stun:stun01.sipphone.com" },
    // { urls: "stun:stun.ekiga.net" },
    // { urls: "stun:stun.fwdnet.net" },
    // { urls: "stun:stun.ideasip.com" },
    // { urls: "stun:stun.iptel.org" },
    // { urls: "stun:stun.rixtelecom.se" },
    // { urls: "stun:stun.schlund.de" },
    // { urls: "stun:stun.l.google.com:19302" },
    // { urls: "stun:stun1.l.google.com:19302" },
    // { urls: "stun:stun2.l.google.com:19302" },
    // { urls: "stun:stun3.l.google.com:19302" },
    // { urls: "stun:stun4.l.google.com:19302" },
    // { urls: "stun:stunserver.org" },
    // { urls: "stun:stun.softjoys.com" },
    // { urls: "stun:stun.voiparound.com" },
    // { urls: "stun:stun.voipbuster.com" },
    // { urls: "stun:stun.voipstunt.com" },
    // { urls: "stun:stun.voxgratia.org" },
    // { urls: "stun:stun.xten.com" },
    // {
    //   urls: "turn:numb.viagenie.ca",
    //   credential: "muazkh",
    //   username: "webrtc@live.com",
    // },
    // {
    //   urls: "turn:192.158.29.39:3478?transport=udp",
    //   credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
    //   username: "28224511:1379330808",
    // },
    // {
    //   urls: "turn:192.158.29.39:3478?transport=tcp",
    //   credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
    //   username: "28224511:1379330808",
    // },
    {
      urls: "stun:stun.l.google.com:19302",
    },
    {
      urls: "turn:192.158.29.39:3478?transport=udp",
      credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
      username: "28224511:1379330808",
    },
    {
      urls: "turn:192.158.29.39:3478?transport=tcp",
      credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
      username: "28224511:1379330808",
    },
  ],
};

export let connections: WebRTCConnection[] = [];

export const startCall = async (userEmails: string[], callerEmail: string) => {
  localStream = await setUpLocalStream();
  for (let userEmail of userEmails) {
    if (userEmail !== callerEmail) {
      let connection = new WebRTCConnection({
        from: callerEmail,
        to: userEmail,
        sendOffer: true,
      });
      connections.push(connection);
    }
  }
  sendWebRTCCall(userEmails);
};

export const joinCall = async (userEmails: string[], selfEmail: string) => {
  localStream = await setUpLocalStream();
  const connectedEmails = connections.map((connection) => connection.to);
  const newEmails = userEmails.filter(
    (userEmail) => !connectedEmails.includes(userEmail)
  );
  for (let userEmail of newEmails) {
    let connection = new WebRTCConnection({
      from: selfEmail,
      to: userEmail,
    });
    connections.push(connection);
  }
  // for (let userEmail of userEmails) {
  //   connections.forEach((connection)=> {

  //   })
  //   let connection = new WebRTCConnection({
  //     from: selfEmail,
  //     to: userEmail,
  //   });

  //   connections.push(connection);
  // }
};

// async function createPeerConnection(userEmail: string) {
//   peerConnection = new RTCPeerConnection(pcConfig);

//   peerConnection.addEventListener("icecandidate", (event) => {
//     handleICECandidateEvent(event, userEmail);
//   });

//   peerConnection.onconnectionstatechange = (event) => {
//     console.log("connection state changed: ", peerConnection.connectionState);
//     if (peerConnection.connectionState === "failed") {
//       peerConnection.restartIce();
//     }
//   };

//   remoteStream = new MediaStream();
//   updateRemoteVideo(remoteStream);

//   peerConnection.addEventListener("track", (event) => {
//     remoteStream.addTrack(event.track);
//   });
//   localStream = await setUpLocalStream();
//   localStream.getTracks().forEach((track) => {
//     peerConnection.addTrack(track, localStream);
//   });
// }

// async function createWebRTCOffer() {
//   const offer = await peerConnection.createOffer();

//   await peerConnection.setLocalDescription(offer);
//   return offer;
// }

// export async function handleWebRTCOffer(offer: RTCSessionDescriptionInit) {
//   await peerConnection.setRemoteDescription(offer);
//   let answer = await peerConnection.createAnswer();
//   await peerConnection.setLocalDescription(answer);
//   return answer;
// }

// export async function handleWebRTCAnswer(answer: RTCSessionDescriptionInit) {
//   await peerConnection.setRemoteDescription(answer);
// }

class WebRTCConnection {
  from: string;
  to: string;
  peerConnection: RTCPeerConnection;
  sendOffer: boolean = false;

  constructor({ to, from, sendOffer }: { to: string; from: string , sendOffer?: boolean}) {
    this.from = from;
    this.to = to;
    this.peerConnection = new RTCPeerConnection(pcConfig);
    this.peerConnection.addEventListener("icecandidate", (event) => {
      this.handleIceCandidate(event);
    });
    this.peerConnection.addEventListener("track", (event) => {
      this.handleTrackEvent(event);
    });
    this.peerConnection.onconnectionstatechange = (event) => {
      console.log(
        "connection state changed: ",
        this.peerConnection.connectionState
      );
      if (this.peerConnection.connectionState === "failed") {
        this.peerConnection.restartIce();
      }
    };

    localStream.getTracks().forEach((track) => {
      this.peerConnection.addTrack(track, localStream);
    });
    if (sendOffer) {
      this.createOffer().then((offer) => {
        sendWebRTCOffer(offer, this.from, this.to);
      });
    }
    
  }
  handleTrackEvent(event: RTCTrackEvent) {
    // remoteStreams.addTrack(event.track);
    const remoteStream = new MediaStream();
    remoteStream.addTrack(event.track);
       
    updateRemoteVideo(remoteStream);
  }
  async createOffer() {
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    return offer;
  }
  async createAnswer(offer: RTCSessionDescriptionInit) {
    await this.peerConnection.setRemoteDescription(offer);
    let answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);
    sendWebRTCOffer(answer, this.from, this.to);
  }
  async handleAnswer(answer: RTCSessionDescriptionInit) {
    if (this.peerConnection.currentRemoteDescription !== null)
      await this.peerConnection.setRemoteDescription(answer);
  }
  async handleIceCandidate(event: RTCPeerConnectionIceEvent) {
    if (event.candidate) {
      console.log("sending icecandidate: ", event.candidate);
      sendIceCandidate(event.candidate, this.to, this.from);
    }
  }
  async handleNewIceCandidateMsg(candidate: RTCIceCandidate) {
    if (candidate) {
      console.log("remote icecandidate: ", candidate);
      if (this.peerConnection.currentRemoteDescription !== null) {
        await this.peerConnection.addIceCandidate(candidate);
      }
    }
  }
}
