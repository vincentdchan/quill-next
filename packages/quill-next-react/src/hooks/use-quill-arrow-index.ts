import { useState, useEffect, useRef, useMemo } from "react";
import { useQuill } from "./use-quill";

/**
 * Listen to the arrow key up and down events and update the selected index.
 * **Notice**: If the length is greater or equal to 0, the keyboard event will be prevented.
 * 
 * @param length 
 * @returns 
 */
export function useQuillArrowIndex(length: number): [number, (index: number) => void] {
  const quill = useQuill();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  useEffect(() => {
    if (length > 0 && selectedIndex >= length) {
      setSelectedIndex(length - 1);
    }
  }, [selectedIndex, setSelectedIndex, length]);

  const keyDownHandlerRef = useRef<(e: KeyboardEvent) => void | null>(null);
  keyDownHandlerRef.current = useMemo(() => {
    return (e: KeyboardEvent): void => {
      if (length < 0) {
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prevIndex) => {
          if (prevIndex === 0) {
            return length - 1;
          }
          return prevIndex - 1;
        });
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prevIndex) => {
          if (prevIndex === length - 1) {
            return 0;
          }
          return prevIndex + 1;
        });
      }
    }
  }, [length]);

  useEffect(() => {
    const keydownHandler = (e: KeyboardEvent): void => {
      keyDownHandlerRef.current?.(e);
    }
    quill.root.addEventListener("keydown", keydownHandler, { capture: true });

    return (): void => {
      quill.root.removeEventListener("keydown", keydownHandler, { capture: true });
    };
  }, [quill, keyDownHandlerRef]);

  return [selectedIndex, setSelectedIndex];
}
