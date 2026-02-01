import { useState, useEffect, useRef } from "react";
import "./App.css";
import { io } from "socket.io-client";
const BASE_URL = "http://localhost:3000";
function App() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [socket] = useState(io(BASE_URL));
  useEffect(() => {
    async function loadStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          console.log("video stream connected successfully");
        }
      } catch (error) {
        console.error("Error getting media", error);
      }
    }
    socket.on("connect", () => {
      console.log("connecting to socket server with id", socket.id);
      console.log(socket);
      loadStream();
    });
  }, [socket]);
  return (
    <div className="h-screen w-ful">
      <video ref={videoRef} autoPlay playsInline />
    </div>
  );
}

export default App;
