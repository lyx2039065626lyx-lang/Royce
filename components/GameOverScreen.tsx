"use client";

import type { GameResult } from "@/lib/types";

interface GameOverScreenProps {
  gameResult: GameResult;
  onPlayAgain: () => void;
}

export default function GameOverScreen({
  gameResult,
  onPlayAgain,
}: GameOverScreenProps) {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/95 backdrop-blur-sm">
      <div className="max-w-lg w-full mx-8 text-center max-h-[90vh] overflow-y-auto animate-fade-in">
        <h2 className="text-sm font-bold text-gray-300 uppercase tracking-widest mb-2">
          Game Over
        </h2>
        <div className="text-8xl font-black text-black tabular-nums mb-4">
          {gameResult.totalScore.toLocaleString()}
        </div>
        <p className="text-gray-400 text-sm mb-10">
          {Math.round(gameResult.accuracy * 100)}% accuracy &middot;{" "}
          {gameResult.averageTime.toFixed(1)}s avg time
        </p>

        <div className="mb-10">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-gray-200 text-gray-400 text-xs uppercase tracking-wider">
                <th className="px-4 py-2 font-medium">#</th>
                <th className="px-4 py-2 font-medium">Topic</th>
                <th className="px-4 py-2 font-medium">AI Guess</th>
                <th className="px-4 py-2 text-right font-medium">Score</th>
              </tr>
            </thead>
            <tbody>
              {gameResult.rounds.map((r) => (
                <tr
                  key={r.roundNumber}
                  className="border-b border-gray-100"
                >
                  <td className="px-4 py-3 text-gray-400">{r.roundNumber + 1}</td>
                  <td className="px-4 py-3 font-bold text-gray-900">{r.topic}</td>
                  <td className="px-4 py-3 text-gray-500">{r.guess}</td>
                  <td
                    className={`px-4 py-3 text-right font-bold tabular-nums ${
                      r.correct ? "text-green-600" : "text-gray-300"
                    }`}
                  >
                    {r.correct ? `+${r.score}` : "0"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={onPlayAgain}
          className="px-12 py-4 bg-black text-white font-bold text-lg hover:bg-gray-800 transition-colors active:scale-95"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
