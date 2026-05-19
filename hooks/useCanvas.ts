"use client";

import { useRef, useCallback, useState } from "react";
import { CANVAS_WIDTH, CANVAS_HEIGHT, MAX_UNDO_STEPS } from "@/lib/constants";

export function useCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const undoStackRef = useRef<ImageData[]>([]);
  const [undoLength, setUndoLength] = useState(0);
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(4);
  const [isEraser, setIsEraser] = useState(false);

  const getCtx = useCallback(() => {
    return canvasRef.current?.getContext("2d") ?? null;
  }, []);

  const saveState = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const canvas = canvasRef.current!;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    undoStackRef.current.push(data);
    if (undoStackRef.current.length > MAX_UNDO_STEPS) {
      undoStackRef.current.shift();
    }
    setUndoLength(undoStackRef.current.length);
  }, [getCtx]);

  const initCanvas = useCallback(
    (canvas: HTMLCanvasElement) => {
      canvasRef.current = canvas;
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      undoStackRef.current = [];
      setUndoLength(0);
    },
    []
  );

  const getCanvasCoords = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current!;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    },
    []
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const ctx = getCtx();
      if (!ctx) return;
      saveState();
      const { x, y } = getCanvasCoords(e);
      ctx.beginPath();
      ctx.moveTo(x, y);

      if (isEraser) {
        ctx.globalCompositeOperation = "destination-out";
        ctx.strokeStyle = "rgba(0,0,0,1)";
      } else {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = brushColor;
      }
      ctx.lineWidth = brushSize;
      isDrawingRef.current = true;
    },
    [getCtx, saveState, getCanvasCoords, isEraser, brushColor, brushSize]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawingRef.current) return;
      const ctx = getCtx();
      if (!ctx) return;
      const { x, y } = getCanvasCoords(e);
      ctx.lineTo(x, y);
      ctx.stroke();
    },
    [getCtx, getCanvasCoords]
  );

  const handlePointerUp = useCallback(() => {
    isDrawingRef.current = false;
    const ctx = getCtx();
    if (ctx) {
      ctx.globalCompositeOperation = "source-over";
    }
  }, [getCtx]);

  const undo = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const data = undoStackRef.current.pop();
    if (!data) return;
    const canvas = canvasRef.current!;
    ctx.putImageData(data, 0, 0);
    setUndoLength(undoStackRef.current.length);
  }, [getCtx]);

  const clearCanvas = useCallback(() => {
    const ctx = getCtx();
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    saveState();
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [getCtx, saveState]);

  const getImageData = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return "";
    return canvas.toDataURL("image/png");
  }, []);

  return {
    canvasRef,
    initCanvas,
    brushColor,
    setBrushColor,
    brushSize,
    setBrushSize,
    isEraser,
    setIsEraser,
    undoLength,
    undo,
    clearCanvas,
    getImageData,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  } as const;
}
