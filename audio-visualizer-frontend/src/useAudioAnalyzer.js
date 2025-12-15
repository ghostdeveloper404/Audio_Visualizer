import { useEffect, useRef } from "react";

export const useAudioAnalyzer = () => {
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioCtx = new AudioContext();

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;

      source.connect(analyser);

      analyserRef.current = analyser;
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
    };

    init();
  }, []);

  return { analyserRef, dataArrayRef };
};
