import { useEffect, useState } from 'react';

/**
 * Trails `value` by `delay` ms. Used to keep a search field feeling live
 * without firing one request per keystroke, which matters on mobile data.
 */
export function useDebouncedValue<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
