import { useEffect, useRef, useMemo } from "react";
import { NormalizedBinding, Binding } from "quill-next";
import { NextKeyboard } from "../modules/next-keyboard";
import { useQuill } from "./use-quill";
import { isEqual } from "lodash-es";

export interface Context {
  collapsed: boolean;
  empty: boolean;
  offset: number;
  prefix: string;
  suffix: string;
  format: Record<string, unknown>;
  event: KeyboardEvent;
  line: any;
}

export type QuillKeyboardHandler = (range: Range, context: Context, binding: NormalizedBinding) => boolean | void;

export function useQuillKeyboardBinding(
  binding: Binding,
  context: Partial<Context>,
  handler: QuillKeyboardHandler,
): void {
  const quill = useQuill();
  const bindingRef = useRef<Binding | null>(null);
  const contextRef = useRef<Partial<Context> | null>(null);
  const handlerRef = useRef<QuillKeyboardHandler>(handler);

  let hasChanges = false;

  if (!isEqual(bindingRef.current, binding)) {
    hasChanges = true;
  }
  bindingRef.current = binding;

  if (!isEqual(contextRef.current, context)) {
    hasChanges = true;
  }
  contextRef.current = context;

  handlerRef.current = useMemo(() => {
    return handler;
  }, [handler]);

  useEffect(() => {
    if (!hasChanges) {
      return;
    }
    const keyboard = quill.getModule("keyboard") as NextKeyboard;
    if (!(keyboard instanceof NextKeyboard)) {
      console.warn("keyboard is not a NextKeyboard");
      return;
    }
    return keyboard.addBinding(binding, context, (range, context, binding) => {
      return handlerRef.current(range, context, binding);
    });
  }, [quill, hasChanges]);
}
