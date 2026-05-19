"use client";

import { ROUNDS_PER_GAME } from "@/lib/constants";

interface ScoreDisplayProps {
  score: number;
  round: number;
  totalRounds?: number;
}

export default function ScoreDisplay({
  score,
  round,
  totalRounds = ROUNDS_PER_GAME,
}: ScoreDisplayProps) {
  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2">
        {Array.from({ length: totalRounds }, (_, i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 transition-colors ${
              i < round
                ? "bg-black"
                : i === round
                ? "bg-white border-2 border-black"
                : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      <span className="text-sm text-gray-400 font-medium">
        Round {round + 1}/{totalRounds}
      </span>
      <div className="ml-auto text-right">
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
          Score
        </div>
        <div className="text-2xl font-black text-black tabular-nums">
          {score.toLocaleString()}
        </div>
      </div>
    </div>
  );
}
