import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const timerId = setTimeout(() => setDebounced(value), delay);

    return () => clearTimeout(timerId);
  },[delay,value]);

  return debounced;
}
