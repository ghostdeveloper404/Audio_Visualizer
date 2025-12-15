import { useEffect, useRef } from "react";
import { useAudioAnalyzer } from "./useAudioAnalyzer";
import useAudioStream from "./useAudioStream";

export default function CircularVisualizer() {
  const canvasRef = useRef();
  const { analyserRef, dataArrayRef } = useAudioAnalyzer();
  useAudioStream();
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);
    ctx.lineCap = "round";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#390380ff";

    
    const draw = () => {
      requestAnimationFrame(draw);
      if (!analyserRef.current) return;

      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);

      const bars = dataArrayRef.current.length;
      const radius = 120;

      for (let i = 0; i < bars; i++) {
        const value = dataArrayRef.current[i];
        const angle = (i / bars) * Math.PI * 2;

        const barHeight = value * 0.6;

        ctx.beginPath();
        ctx.moveTo(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius
        );
        ctx.lineTo(
          Math.cos(angle) * (radius + barHeight),
          Math.sin(angle) * (radius + barHeight)
        );
        ctx.strokeStyle = `hsl(${i * 4}, 100%, 50%)`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      ctx.restore();
    };

    draw();
  }, []);

  return <canvas ref={canvasRef} />;
}
