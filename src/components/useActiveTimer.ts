"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Milliseconds elapsed since mount (or reset), excluding time the tab was hidden.
 * Stepping away to make tea doesn't count as hesitation.
 */
export function useActiveTimer() {
  const start = useRef(0);
  const hiddenSince = useRef<number | null>(null);
  const hiddenTotal = useRef(0);

  const reset = useCallback(() => {
    start.current = performance.now();
    hiddenTotal.current = 0;
    hiddenSince.current = document.visibilityState === "hidden" ? performance.now() : null;
  }, []);

  useEffect(() => {
    reset();
    const onVisibility = () => {
      const now = performance.now();
      if (document.visibilityState === "hidden") {
        hiddenSince.current ??= now;
      } else if (hiddenSince.current !== null) {
        hiddenTotal.current += now - hiddenSince.current;
        hiddenSince.current = null;
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [reset]);

  const elapsed = useCallback(() => {
    const now = performance.now();
    const hiddenNow = hiddenSince.current !== null ? now - hiddenSince.current : 0;
    return Math.round(now - start.current - hiddenTotal.current - hiddenNow);
  }, []);

  return { elapsed, reset };
}
