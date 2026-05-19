"use client";

import { ROUND_TIME_SECONDS } from "@/lib/constants";

interface TimerProps {
  timeRemaining: number;
}

export default function Timer({ timeRemaining }: TimerProps) {
  const progress = timeRemaining / ROUND_TIME_SECONDS;
  const seconds = Math.ceil(timeRemaining);
  const isLow = seconds <= 10;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Time
        </span>
        <span
          className={`text-sm font-bold tabular-nums ${
            isLow ? "text-red-500" : "text-gray-400"
          }`}
        >
          0:{seconds.toString().padStart(2, "0")}
        </span>
      </div>
      <div className="w-full h-1 bg-gray-100 overflow-hidden">
        <div
          className="h-full bg-black transition-all duration-300"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
