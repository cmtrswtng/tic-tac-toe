import { useEffect, useState } from "react";

export function useThrottle<T>(value: T, limit: number): T {
    const [throttledValue, setThrottledValue] = useState<T>(value);
    const [lastRan, setLastRan] = useState<number>(Date.now());
  
    useEffect(() => {
      const handler = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          setThrottledValue(value);
          setLastRan(Date.now());
        }
      }, limit - (Date.now() - lastRan));
  
      return () => {
        clearTimeout(handler);
      };
    }, [value, limit, lastRan]);
  
    return throttledValue;
}