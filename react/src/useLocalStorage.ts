import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [internalValue, setInternalValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = useCallback<Dispatch<SetStateAction<T>>>(
    (value) => {
      try {
        const valueToStore = value instanceof Function ? value(internalValue) : value;
        setInternalValue(valueToStore ?? initialValue);
        localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.log(error);
      }
    },
    [key, setInternalValue, internalValue, initialValue]
  );

  useEffect(() => {
    function handleStorageChange() {
      try {
        const latestValue = localStorage.getItem(key);
        if (latestValue) {
          setValue(JSON.parse(latestValue));
        }
      } catch (error) {
        console.error(error);
      }
    }

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return [internalValue, setValue];
}