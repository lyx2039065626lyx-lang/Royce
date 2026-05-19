export interface RoundResult {
  roundNumber: number;
  topic: string;
  guess: string;
  correct: boolean;
  score: number;
  timeUsed: number;
  timestamp: number;
}

export interface GameResult {
  gameId: string;
  totalScore: number;
  rounds: RoundResult[];
  date: string;
  averageTime: number;
  accuracy: number;
}

export type GameState =
  | "idle"
  | "topicReveal"
  | "drawing"
  | "guessing"
  | "scored"
  | "gameOver";

export interface HighScoreEntry {
  score: number;
  date: string;
  gameId: string;
}

export interface Settings {
  brushSize: number;
  brushColor: string;
}

export interface TopicData {
  topic: string;
  difficulty: "easy" | "medium" | "hard";
}
