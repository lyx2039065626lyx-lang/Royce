"use client";

import { useEffect, useCallback, useRef } from "react";
import { useGameState } from "@/hooks/useGameState";
import { useCanvas } from "@/hooks/useCanvas";
import { useTimer } from "@/hooks/useTimer";
import { useTopics } from "@/hooks/useTopics";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { calculateScore } from "@/lib/scoring";
import { saveGameResult, updateHighScores, loadHighScores } from "@/lib/storage";
import { ROUND_TIME_SECONDS, TOPIC_REVEAL_DELAY_MS, ROUNDS_PER_GAME, SCORED_DISPLAY_MS } from "@/lib/constants";
import type { RoundResult, GameResult, HighScoreEntry } from "@/lib/types";

import Timer from "./Timer";
import ScoreDisplay from "./ScoreDisplay";
import TopicPrompt from "./TopicPrompt";
import GuessResult from "./GuessResult";
import Toolbar from "./Toolbar";
import DrawingCanvas from "./DrawingCanvas";
import StartScreen from "./StartScreen";
import GameOverScreen from "./GameOverScreen";
import HistoryPanel from "./HistoryPanel";

export default function GameBoard() {
  const {
    gameState,
    currentRound,
    totalScore,
    roundResults,
    startGame,
    startDrawing,
    startGuessing,
    finishRound,
    nextRound,
    playAgain,
  } = useGameState();

  const canvas = useCanvas();
  const { topic, fetchNewTopic } = useTopics();
  const { timeRemaining, progress, start: startTimer, reset: resetTimer } = useTimer(
    ROUND_TIME_SECONDS,
    () => handleSubmitGuess()
  );

  const [highScores, setHighScores] = useLocalStorage<HighScoreEntry[]>(
    "pictionary_highScores",
    []
  );

  const [showHistory, setShowHistory] = useLocalStorage("pictionary_showHistory", false);
  const lastGuessRef = useRef<{ guess: string; correct: boolean; score: number } | null>(null);
  const gameResultRef = useRef<GameResult | null>(null);

  useEffect(() => {
    setHighScores(loadHighScores());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (gameState === "topicReveal" && topic) {
      const t = setTimeout(() => {
        startDrawing();
        startTimer();
      }, TOPIC_REVEAL_DELAY_MS);
      return () => clearTimeout(t);
    }
  }, [gameState, topic, startDrawing, startTimer]);

  useEffect(() => {
    if (gameState === "scored") {
      const t = setTimeout(() => {
        nextRound();
      }, SCORED_DISPLAY_MS);
      return () => clearTimeout(t);
    }
  }, [gameState, nextRound]);

  useEffect(() => {
    if (gameState === "topicReveal") {
      fetchNewTopic();
      resetTimer();
    }
  }, [gameState, fetchNewTopic, resetTimer]);

  useEffect(() => {
    if (gameState === "gameOver" && roundResults.length > 0) {
      const gameId = Date.now().toString(36);
      const avgTime =
        roundResults.reduce((s, r) => s + r.timeUsed, 0) / roundResults.length;
      const correct = roundResults.filter((r) => r.correct).length;
      const gameResult: GameResult = {
        gameId,
        totalScore,
        rounds: roundResults,
        date: new Date().toISOString(),
        averageTime: avgTime,
        accuracy: correct / roundResults.length,
      };
      gameResultRef.current = gameResult;
      saveGameResult(gameResult);
      updateHighScores(totalScore, gameId);
      setHighScores(loadHighScores());
    }
  }, [gameState, roundResults, totalScore, setHighScores]);

  const handleSubmitGuess = useCallback(async () => {
    if (gameState !== "drawing") return;
    startGuessing();
    resetTimer();

    const imageData = canvas.getImageData();
    const timeUsed = ROUND_TIME_SECONDS - timeRemaining;

    try {
      const response = await fetch("/api/guess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData, topic }),
      });

      const data = (await response.json()) as {
        guess: string;
        correct: boolean;
      };

      const correct = data.correct;
      const score = calculateScore(correct, timeRemaining);

      const result: RoundResult = {
        roundNumber: currentRound,
        topic: topic ?? "",
        guess: data.guess ?? "Error",
        correct,
        score,
        timeUsed,
        timestamp: Date.now(),
      };

      lastGuessRef.current = { guess: data.guess, correct, score };
      finishRound(result);
    } catch {
      const result: RoundResult = {
        roundNumber: currentRound,
        topic: topic ?? "",
        guess: "Network error",
        correct: false,
        score: 0,
        timeUsed,
        timestamp: Date.now(),
      };
      lastGuessRef.current = {
        guess: "Network error",
        correct: false,
        score: 0,
      };
      finishRound(result);
    }
  }, [
    gameState,
    canvas,
    topic,
    timeRemaining,
    currentRound,
    startGuessing,
    resetTimer,
    finishRound,
  ]);

  const handleStartGame = useCallback(() => {
    lastGuessRef.current = null;
    gameResultRef.current = null;
    startGame();
  }, [startGame]);

  const handlePlayAgain = useCallback(() => {
    lastGuessRef.current = null;
    gameResultRef.current = null;
    playAgain();
  }, [playAgain]);

  const timerCompleteRef = useRef(false);
  useEffect(() => {
    if (
      progress <= 0 &&
      gameState === "drawing" &&
      !timerCompleteRef.current
    ) {
      timerCompleteRef.current = true;
    }
    if (gameState !== "drawing") {
      timerCompleteRef.current = false;
    }
  }, [progress, gameState]);

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 px-8 py-5 flex items-center justify-between">
        <h1 className="text-xl font-black tracking-tight text-black">
          AI PICTIONARY
        </h1>
        <div className="flex items-center gap-6">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-sm font-medium text-gray-400 hover:text-black transition-colors"
          >
            History
          </button>
          {gameState !== "idle" && gameState !== "gameOver" && (
            <button
              onClick={handlePlayAgain}
              className="text-sm font-medium text-gray-400 hover:text-black transition-colors"
            >
              Quit
            </button>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col lg:flex-row gap-8 p-8 lg:p-12 max-w-7xl mx-auto w-full">
        {/* Canvas area */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex items-center gap-8">
            <div className="flex-1">
              <ScoreDisplay
                score={totalScore}
                round={currentRound}
                totalRounds={ROUNDS_PER_GAME}
              />
            </div>
            <div className="w-56">
              <Timer timeRemaining={timeRemaining} />
            </div>
          </div>

          <TopicPrompt
            topic={topic}
            visible={gameState === "topicReveal" || gameState === "drawing"}
          />

          <div className="relative">
            <DrawingCanvas
              initCanvas={canvas.initCanvas}
              disabled={gameState !== "drawing"}
              onPointerDown={canvas.handlePointerDown}
              onPointerMove={canvas.handlePointerMove}
              onPointerUp={canvas.handlePointerUp}
            />

            {gameState === "scored" && lastGuessRef.current && (
              <div className="absolute bottom-6 left-6 right-6">
                <GuessResult
                  guess={lastGuessRef.current.guess}
                  topic={topic ?? ""}
                  correct={lastGuessRef.current.correct}
                  score={lastGuessRef.current.score}
                />
              </div>
            )}

            {gameState === "guessing" && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-500 font-medium text-sm tracking-widest uppercase">
                    AI is guessing...
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Toolbar sidebar */}
        <div className="lg:w-52 flex-shrink-0">
          <Toolbar
            brushColor={canvas.brushColor}
            brushSize={canvas.brushSize}
            isEraser={canvas.isEraser}
            undoLength={canvas.undoLength}
            disabled={gameState !== "drawing"}
            onColorChange={canvas.setBrushColor}
            onSizeChange={canvas.setBrushSize}
            onEraserToggle={() =>
              canvas.setIsEraser(!canvas.isEraser)
            }
            onUndo={canvas.undo}
            onClear={canvas.clearCanvas}
            onGuess={handleSubmitGuess}
          />
        </div>
      </main>

      {/* Overlays */}
      {gameState === "idle" && (
        <StartScreen onStart={handleStartGame} highScores={highScores} />
      )}

      {gameState === "gameOver" && gameResultRef.current && (
        <GameOverScreen
          gameResult={gameResultRef.current}
          onPlayAgain={handlePlayAgain}
        />
      )}

      <HistoryPanel
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
      />
    </div>
  );
}
