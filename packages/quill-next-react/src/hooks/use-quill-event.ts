import { useRef, useEffect, useMemo } from "react";
import type Quill from "quill-next";

export function useQuillEvent(quill: Quill | null, eventName: string, callback?: any): void {
  const callbackRef = useRef(callback);
  callbackRef.current = useMemo(() => callback, [callback]);

  useEffect(() => {
    if (!quill) {
      return;
    }

    const handler = (...args: any[]): void => {
      callbackRef.current?.(...args);
    }

    quill.on(eventName, handler);

    return (): void => {
      quill.off(eventName, handler);
    }
  }, [quill, eventName]);
}
