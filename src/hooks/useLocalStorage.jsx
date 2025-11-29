import { useState, useEffect } from 'react';

// Simple reusable hook to sync state with localStorage.
// Keeps JSON (de)serialization centralized and safe-guards against SSR.
export default function useLocalStorage(key, initialValue = null) {
  const [state, setState] = useState(() => {
    try {
      if (typeof window === 'undefined') return initialValue;
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch (err) {
      console.warn('useLocalStorage read failed', err);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      if (state === null || state === undefined) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(state));
      }
    } catch (err) {
      console.warn('useLocalStorage write failed', err);
    }
  }, [key, state]);

  return [state, setState];
}
