import { useState, useEffect, useRef } from "react";
import "./App.css";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:3000";
const ICE_SERVERS: RTCConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

function App() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const [socket] = useState(() => io(BASE_URL));

  useEffect(() => {
    const initializeMedia = async () => {
      try {
        // 1. Get user media
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        streamRef.current = stream;

        // 2. Display local video
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // 3. Create peer connection
        const pc = new RTCPeerConnection(ICE_SERVERS);
        peerConnectionRef.current = pc;

        // 4. Add tracks to peer connection
        stream.getTracks().forEach((track) => {
          pc.addTrack(track, stream);
          console.log(`Added ${track.kind} track to peer connection`);
        });

        if(!socket.connected){
          console.log("not connected to server")
          return;
        }

        if (pc.signalingState !== "stable") {
          console.warn(
            "cannot create state.Signaling state:",
            pc.signalingState
          );
          return;
        }
        const offer= await pc.createOffer();
        await pc.setLocalDescription(offer);
        console.log("offer sdp to server")
        console.log({offer})
        socket.emit("offer", {offer});
      } catch (error) {
        console.error("Failed to initialize media:", error);
      }
    };

    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
      initializeMedia();
    });

    // Cleanup on unmount
    return () => {
      socket.off("connect");
      streamRef.current?.getTracks().forEach((track) => track.stop());
      peerConnectionRef.current?.close();
    };
  }, [socket]);

  return (
    <div className="h-screen w-full">
      <video ref={videoRef} autoPlay playsInline muted />
    </div>
  );
}

export default App;
