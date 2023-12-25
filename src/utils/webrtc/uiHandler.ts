export const updateRemoteVideo = (remoteStream: MediaStream) => {
  const remoteVideos = document.getElementById("remoteVideos");
  const _remoteVideo = document.createElement("video") as HTMLVideoElement;
  _remoteVideo.srcObject = remoteStream;
  _remoteVideo.autoplay = true;
  _remoteVideo.playsInline = true;
  // _remoteVideo.muted = true;
  // _remoteVideo.controls = true;

  remoteVideos?.appendChild(_remoteVideo);

  // remoteVideo.srcObject = remoteStream;

  // remoteVideo.addEventListener("loadedmetadata", () => {
  //   remoteVideo.play();
  // });
};

export const setUpLocalStream = async () => {
  const localStream = await navigator.mediaDevices.getUserMedia({
    video: true,

    audio: true,
  });

  // const localStream = await navigator.mediaDevices.getDisplayMedia({
  //   video: true,
  //   audio: false,
  // });
  const localVideo = document.getElementById("localVideo") as HTMLVideoElement;
  localVideo.srcObject = localStream;
  return localStream;
};
