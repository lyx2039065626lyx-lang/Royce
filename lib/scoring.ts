import { BASE_SCORE, MAX_TIME_BONUS, ROUND_TIME_SECONDS } from "./constants";

export function calculateScore(correct: boolean, timeRemaining: number): number {
  if (!correct) return 0;
  const timeBonus = Math.floor((timeRemaining / ROUND_TIME_SECONDS) * MAX_TIME_BONUS);
  return BASE_SCORE + timeBonus;
}

export function normalizeGuess(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[.!,?;:]+$/, "")
    .trim();
}

const ARTICLES = new Set(["a", "an", "the"]);

export function checkGuess(guess: string, topic: string): boolean {
  const rawGuess = normalizeGuess(guess);
  const rawTopic = normalizeGuess(topic);

  if (rawGuess === rawTopic) return true;

  const guessWords = rawGuess.split(/\s+/).filter((w) => !ARTICLES.has(w));
  const topicWords = rawTopic.split(/\s+/).filter((w) => !ARTICLES.has(w));

  // Exact match after removing articles
  if (guessWords.join(" ") === topicWords.join(" ")) return true;

  // Contains match
  if (rawGuess.includes(rawTopic) || rawTopic.includes(rawGuess)) return true;

  // Multi-word topic: all significant words appear in guess
  if (topicWords.length > 1) {
    const guessSet = new Set(guessWords);
    if (topicWords.every((w) => guessSet.has(w))) return true;
  }

  return false;
}
