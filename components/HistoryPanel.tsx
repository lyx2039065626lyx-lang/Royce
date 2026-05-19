"use client";

import { useState } from "react";
import type { GameResult } from "@/lib/types";
import { loadGameHistory, clearAllData } from "@/lib/storage";

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HistoryPanel({ isOpen, onClose }: HistoryPanelProps) {
  const [history, setHistory] = useState<GameResult[]>(() => loadGameHistory());
  const [expanded, setExpanded] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const handleClear = () => {
    if (confirmClear) {
      clearAllData();
      setHistory([]);
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 bottom-0 z-40 w-full max-w-sm bg-white shadow-2xl overflow-y-auto animate-slide-in-right">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-lg font-black text-black">History</h2>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-black text-xl leading-none transition-colors"
          >
            &#10005;
          </button>
        </div>

        <div className="p-6">
          {history.length === 0 ? (
            <p className="text-gray-300 text-center py-12 text-sm">
              No games played yet
            </p>
          ) : (
            <div className="space-y-2">
              {history.map((game) => (
                <div
                  key={game.gameId}
                  className="border border-gray-100 overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setExpanded(
                        expanded === game.gameId ? null : game.gameId
                      )
                    }
                    className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <div className="text-black font-bold text-sm tabular-nums">
                        {game.totalScore.toLocaleString()} pts
                      </div>
                      <div className="text-gray-400 text-xs mt-0.5">
                        {new Date(game.date).toLocaleDateString()} &middot;{" "}
                        {Math.round(game.accuracy * 100)}%
                      </div>
                    </div>
                    <span className="text-gray-300 text-xs">
                      {expanded === game.gameId ? "▲" : "▼"}
                    </span>
                  </button>

                  {expanded === game.gameId && (
                    <div className="px-4 pb-3">
                      {game.rounds.map((r) => (
                        <div
                          key={r.roundNumber}
                          className="flex items-center justify-between text-xs py-2 border-t border-gray-50"
                        >
                          <span className="text-gray-500">
                            #{r.roundNumber + 1} {r.topic}
                          </span>
                          <span
                            className={`font-bold ${
                              r.correct ? "text-green-600" : "text-gray-300"
                            }`}
                          >
                            {r.correct ? `+${r.score}` : r.guess}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {history.length > 0 && (
            <div className="mt-6">
              <button
                onClick={handleClear}
                className={`w-full py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                  confirmClear
                    ? "bg-red-600 text-white"
                    : "text-gray-300 hover:text-red-500 border border-gray-100 hover:border-red-200"
                }`}
              >
                {confirmClear ? "Confirm Clear All" : "Clear History"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
