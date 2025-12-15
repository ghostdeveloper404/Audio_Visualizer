import { useEffect, useRef } from "react";

export default function useAudioStream() {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:8080/ws/audio");

    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = e => {
        if (socketRef.current?.readyState === 1) {
          console.log("Sending audio data chunk" , e.data);
          socketRef.current.send(e.data);
        }
      };

      recorder.start(250); // low latency chunks
    });

    return () => {
      socketRef.current?.close();
    };
  }, []);
}
