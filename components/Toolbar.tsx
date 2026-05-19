"use client";

import { COLORS } from "@/lib/constants";

interface ToolbarProps {
  brushColor: string;
  brushSize: number;
  isEraser: boolean;
  undoLength: number;
  disabled: boolean;
  onColorChange: (color: string) => void;
  onSizeChange: (size: number) => void;
  onEraserToggle: () => void;
  onUndo: () => void;
  onClear: () => void;
  onGuess: () => void;
}

export default function Toolbar({
  brushColor,
  brushSize,
  isEraser,
  undoLength,
  disabled,
  onColorChange,
  onSizeChange,
  onEraserToggle,
  onUndo,
  onClear,
  onGuess,
}: ToolbarProps) {
  return (
    <div className="bg-gray-50 p-5 flex flex-col gap-6">
      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
          Colors
        </label>
        <div className="grid grid-cols-6 gap-2">
          {COLORS.map((color) => (
            <button
              key={color}
              disabled={disabled}
              className={`w-8 h-8 transition-transform hover:scale-115 active:scale-95 border-2 ${
                brushColor === color && !isEraser
                  ? "border-black scale-110"
                  : "border-gray-200 hover:border-gray-400"
              }`}
              style={{ backgroundColor: color }}
              onClick={() => onColorChange(color)}
              aria-label={`Color ${color}`}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
          Size &mdash; {brushSize}px
        </label>
        <input
          type="range"
          min="1"
          max="20"
          value={brushSize}
          disabled={disabled}
          onChange={(e) => onSizeChange(Number(e.target.value))}
          className="w-full accent-black cursor-pointer disabled:opacity-30"
        />
      </div>

      <div className="flex gap-1.5">
        <button
          disabled={disabled}
          onClick={onEraserToggle}
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-colors active:scale-95 disabled:opacity-30 ${
            isEraser
              ? "bg-black text-white"
              : "bg-white text-gray-500 border border-gray-200 hover:border-gray-400"
          }`}
        >
          {isEraser ? "Eraser" : "Eraser"}
        </button>
        <button
          disabled={disabled || undoLength === 0}
          onClick={onUndo}
          className="flex-1 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider bg-white border border-gray-200 hover:border-gray-400 transition-colors active:scale-95 disabled:opacity-30"
        >
          Undo
        </button>
        <button
          disabled={disabled}
          onClick={onClear}
          className="flex-1 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider bg-white border border-gray-200 hover:border-red-300 hover:text-red-500 transition-colors active:scale-95 disabled:opacity-30"
        >
          Clear
        </button>
      </div>

      <button
        disabled={disabled}
        onClick={onGuess}
        className="w-full py-3 bg-black text-white font-bold text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Guess Now
      </button>
    </div>
  );
}
