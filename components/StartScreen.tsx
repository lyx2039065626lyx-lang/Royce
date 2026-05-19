"use client";

import type { HighScoreEntry } from "@/lib/types";

interface StartScreenProps {
  onStart: () => void;
  highScores: HighScoreEntry[];
}

export default function StartScreen({ onStart, highScores }: StartScreenProps) {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/95 backdrop-blur-sm">
      <div className="max-w-lg w-full mx-8 text-center">
        <h1 className="text-7xl font-black tracking-tighter text-black mb-4">
          AI Pictionary
        </h1>
        <p className="text-xl text-gray-400 font-light mb-12 tracking-wide">
          Draw. Guess. Score.
        </p>

        <div className="inline-flex flex-col items-start gap-3 mb-12">
          {[
            "Get a random topic to draw",
            "Sketch it on the canvas in 90 seconds",
            "AI tries to guess your drawing",
            "Faster + more accurate = more points",
          ].map((rule, i) => (
            <div key={i} className="flex items-center gap-3 text-gray-500 text-sm">
              <span className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center flex-shrink-0 text-xs font-bold text-gray-400">
                {i + 1}
              </span>
              {rule}
            </div>
          ))}
        </div>

        <button
          onClick={onStart}
          className="block mx-auto px-12 py-4 bg-black text-white font-bold text-lg hover:bg-gray-800 transition-colors active:scale-95"
        >
          Start Game
        </button>

        {highScores.length > 0 && (
          <div className="mt-16">
            <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-4">
              High Scores
            </h3>
            <div className="space-y-0.5 max-w-xs mx-auto">
              {highScores.slice(0, 5).map((entry, i) => (
                <div
                  key={entry.gameId}
                  className="flex items-center justify-between text-sm py-2 px-3 border-b border-gray-100"
                >
                  <span className="text-gray-400 font-medium">#{i + 1}</span>
                  <span className="text-black font-bold tabular-nums">
                    {entry.score.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
