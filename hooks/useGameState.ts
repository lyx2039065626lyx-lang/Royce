"use client";

import { useState, useCallback } from "react";
import type { GameState, RoundResult } from "@/lib/types";
import { ROUNDS_PER_GAME } from "@/lib/constants";

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [currentRound, setCurrentRound] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [roundResults, setRoundResults] = useState<RoundResult[]>([]);

  const startGame = useCallback(() => {
    setGameState("topicReveal");
    setCurrentRound(0);
    setTotalScore(0);
    setRoundResults([]);
  }, []);

  const startDrawing = useCallback(() => {
    setGameState("drawing");
  }, []);

  const startGuessing = useCallback(() => {
    setGameState("guessing");
  }, []);

  const finishRound = useCallback(
    (result: RoundResult) => {
      setRoundResults((prev) => [...prev, result]);
      setTotalScore((prev) => prev + result.score);
      setGameState("scored");
      return currentRound + 1 >= ROUNDS_PER_GAME;
    },
    [currentRound]
  );

  const nextRound = useCallback(() => {
    const next = currentRound + 1;
    if (next >= ROUNDS_PER_GAME) {
      setGameState("gameOver");
    } else {
      setCurrentRound(next);
      setGameState("topicReveal");
    }
  }, [currentRound]);

  const endGame = useCallback(() => {
    setGameState("gameOver");
  }, []);

  const playAgain = useCallback(() => {
    setGameState("idle");
    setCurrentRound(0);
    setTotalScore(0);
    setRoundResults([]);
  }, []);

  return {
    gameState,
    currentRound,
    totalScore,
    roundResults,
    setGameState,
    startGame,
    startDrawing,
    startGuessing,
    finishRound,
    nextRound,
    endGame,
    playAgain,
  } as const;
}
