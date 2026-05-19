"use client";

import { useState, useCallback } from "react";
import type { TopicData } from "@/lib/types";
import { getRandomTopic as getLocalTopic } from "@/lib/topics";

export function useTopics() {
  const [topicData, setTopicData] = useState<TopicData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNewTopic = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/topics");
      if (!response.ok) throw new Error("Network error");
      const data = (await response.json()) as TopicData;
      setTopicData(data);
    } catch {
      // Fallback to local list
      const local = getLocalTopic();
      setTopicData(local);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    topicData,
    topic: topicData?.topic ?? null,
    difficulty: topicData?.difficulty ?? "easy",
    fetchNewTopic,
    loading,
    error,
  };
}
