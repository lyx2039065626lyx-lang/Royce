import type { GameResult, HighScoreEntry, Settings } from "./types";
import { MAX_GAME_HISTORY, MAX_HIGH_SCORES, DEFAULT_BRUSH_SIZE, DEFAULT_BRUSH_COLOR } from "./constants";

const GAME_HISTORY_KEY = "pictionary_gameHistory";
const HIGH_SCORES_KEY = "pictionary_highScores";
const SETTINGS_KEY = "pictionary_settings";

function safeGetItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeSetItem(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage full or unavailable — silently fail
  }
}

export function saveGameResult(result: GameResult): void {
  const history = safeGetItem<GameResult[]>(GAME_HISTORY_KEY, []);
  history.unshift(result);
  if (history.length > MAX_GAME_HISTORY) history.length = MAX_GAME_HISTORY;
  safeSetItem(GAME_HISTORY_KEY, history);
}

export function loadGameHistory(): GameResult[] {
  return safeGetItem<GameResult[]>(GAME_HISTORY_KEY, []);
}

export function loadHighScores(): HighScoreEntry[] {
  return safeGetItem<HighScoreEntry[]>(HIGH_SCORES_KEY, []);
}

export function updateHighScores(score: number, gameId: string): void {
  const scores = safeGetItem<HighScoreEntry[]>(HIGH_SCORES_KEY, []);
  scores.push({ score, date: new Date().toISOString(), gameId });
  scores.sort((a, b) => b.score - a.score);
  if (scores.length > MAX_HIGH_SCORES) scores.length = MAX_HIGH_SCORES;
  safeSetItem(HIGH_SCORES_KEY, scores);
}

export function loadSettings(): Settings {
  return safeGetItem<Settings>(SETTINGS_KEY, {
    brushSize: DEFAULT_BRUSH_SIZE,
    brushColor: DEFAULT_BRUSH_COLOR,
  });
}

export function saveSettings(settings: Settings): void {
  safeSetItem(SETTINGS_KEY, settings);
}

export function clearAllData(): void {
  try {
    localStorage.removeItem(GAME_HISTORY_KEY);
    localStorage.removeItem(HIGH_SCORES_KEY);
    localStorage.removeItem(SETTINGS_KEY);
  } catch {
    // ignore
  }
}
