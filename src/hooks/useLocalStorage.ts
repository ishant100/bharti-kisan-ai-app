import { useEffect, useState } from "react";

/** Persist React state to localStorage (JSON). */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore quota errors
    }
  }, [key, value]);

  /** remove key (and reset state) */
  const remove = () => {
    try {
      localStorage.removeItem(key);
    } finally {
      setValue(initial);
    }
  };

  return [value, setValue, remove] as const;
}
