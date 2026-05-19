"use client";

import { useEffect, useRef } from "react";

interface DrawingCanvasProps {
  initCanvas: (canvas: HTMLCanvasElement) => void;
  disabled: boolean;
  onPointerDown: (e: React.PointerEvent<HTMLCanvasElement>) => void;
  onPointerMove: (e: React.PointerEvent<HTMLCanvasElement>) => void;
  onPointerUp: () => void;
}

export default function DrawingCanvas({
  initCanvas,
  disabled,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: DrawingCanvasProps) {
  const containerRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      initCanvas(containerRef.current);
    }
  }, [initCanvas]);

  return (
    <div className="relative w-full max-w-[800px] mx-auto">
      <canvas
        ref={containerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        className={`w-full border border-gray-200 bg-white shadow-sm ${
          disabled ? "pointer-events-none opacity-40" : "cursor-crosshair"
        }`}
        style={{ touchAction: "none" }}
      />
    </div>
  );
}
