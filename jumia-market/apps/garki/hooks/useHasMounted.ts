import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

/**
 * Returns false during server rendering and the first client render,
 * then true after hydration — used to safely read client-only state
 * (like a persisted zustand store) without a hydration mismatch,
 * without calling setState inside an effect.
 */
export function useHasMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
