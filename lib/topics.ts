import { MOCK_TOPICS } from "./constants";
import type { TopicData } from "./types";

export function getRandomTopic(): TopicData {
  const difficulties = ["easy", "medium", "hard"] as const;
  const weights = [0.5, 0.35, 0.15];
  const rand = Math.random();
  let cumulative = 0;

  for (let i = 0; i < difficulties.length; i++) {
    cumulative += weights[i];
    if (rand < cumulative) {
      const difficulty = difficulties[i];
      const topics = MOCK_TOPICS[difficulty];
      const topic = topics[Math.floor(Math.random() * topics.length)];
      return { topic, difficulty };
    }
  }

  const last = difficulties[difficulties.length - 1];
  const lastTopics = MOCK_TOPICS[last];
  return {
    topic: lastTopics[Math.floor(Math.random() * lastTopics.length)],
    difficulty: last,
  };
}

export function getFilteredTopics(difficulty?: "easy" | "medium" | "hard"): TopicData[] {
  if (difficulty) {
    return MOCK_TOPICS[difficulty].map((t) => ({ topic: t, difficulty }));
  }
  return Object.entries(MOCK_TOPICS).flatMap(([diff, topics]) =>
    topics.map((topic) => ({ topic, difficulty: diff as TopicData["difficulty"] }))
  );
}
