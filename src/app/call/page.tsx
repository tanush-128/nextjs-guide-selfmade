"use client";
import { startCall } from "@/utils/webrtc/mainHandler";
import { useSession } from "next-auth/react";

export default function Page() {
  const { data, status } = useSession();
  return (
    <div className="w-full">
      <div className="flex justify-center" id="remoteVideos">
        {/* <video id="remoteVideo" className="" autoPlay playsInline></video> */}
      </div>

      <video
        id="localVideo"
        autoPlay
        playsInline
        className="aspect-auto w-1/3  absolute  top-4 left-4 rounded-xl shadow-inner shadow-slate-500"
      ></video>
      <button
        onClick={() => {
          startCall(
            [
              "tanush.agarwal.ecelliitkgp@gmail.com",
              "tanuedu128@gmail.com",
              "agarwalom128@gmail.com",
            ],
            data?.user?.email as string
          );
        }}
      >
        Send Offer
      </button>
    </div>
  );
}
