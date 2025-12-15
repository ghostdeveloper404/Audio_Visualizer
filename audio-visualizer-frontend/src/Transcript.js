import { useEffect, useState } from "react";

export default function Transcript() {
  const [text, setText] = useState("");

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080/ws/audio");
    console.log("Transcript WebSocket opened" , socket);

    socket.onmessage = e => {
      setText(prev => prev + " " + e.data);
      console.log("Received transcript chunk" , e.data);
    };

    return () => socket.close();
  }, []);

  return (
    <div
       className="transcript"
 
    >
      {text || "Speak to see live transcription..."}
    </div>
  );
}
