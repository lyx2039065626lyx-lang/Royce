"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export function useTimer(duration: number, onComplete: () => void) {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [running, setRunning] = useState(false);
  const startTimeRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const stopTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setRunning(false);
  }, []);

  const tick = useCallback(() => {
    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    const remaining = Math.max(0, duration - elapsed);
    setTimeRemaining(remaining);

    if (remaining <= 0) {
      stopTimer();
      onCompleteRef.current();
    }
  }, [duration, stopTimer]);

  const start = useCallback(() => {
    stopTimer();
    startTimeRef.current = Date.now();
    setTimeRemaining(duration);
    setRunning(true);
    intervalRef.current = setInterval(tick, 100);
  }, [duration, tick, stopTimer]);

  const reset = useCallback(() => {
    stopTimer();
    setTimeRemaining(duration);
  }, [duration, stopTimer]);

  useEffect(() => {
    return stopTimer;
  }, [stopTimer]);

  const progress = timeRemaining / duration;

  return { timeRemaining, running, progress, start, reset };
}
