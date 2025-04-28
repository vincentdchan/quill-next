import { useState, useCallback } from "react";
import { useQuill } from "./use-quill";
import { useQuillTextChange } from "./use-quill-text-change";
import { useQuillSelectionChange } from "./use-quill-selection-change";
import { Delta, Bounds, Range } from "quill-next";
import { isString, isNumber, isObject } from "lodash-es";

export interface IQuillInputOptions {
  trigger: string;
}

function isInserting(delta: Delta, trigger: string): number {
  const { ops } = delta;
  if (ops.length === 1 && isString(ops[0].insert) && ops[0].insert === trigger) {
    return 0;
  } else if (ops.length > 1 && isNumber(ops[0].retain) && isString(ops[1].insert) && ops[1].insert === trigger) {
    return ops[0].retain;
  }
  return -1;
}

function getInsertedOffset(delta: Delta): number {
  const { ops } = delta;
  if (ops.length === 1 && isString(ops[0].insert)) {
    return ops[0].insert.length;
  } else if (ops.length > 1 && isNumber(ops[0].retain) && isString(ops[1].insert)) {
    return ops[0].retain + ops[1].insert.length;
  }
  return -1;
}

function getDeletedOffset(delta: Delta): number {
  const { ops } = delta;
  if (ops.length === 1 && isNumber(ops[0].delete)) {
    return ops[0].delete;
  } else if (ops.length > 1 && isNumber(ops[0].retain) && isNumber(ops[1].delete)) {
    return ops[0].retain;
  }
  return -1;
}

const placeholder = "\u00A0";
function lineDeltaToString(delta: Delta): string {
  const { ops } = delta;
  let result = "";
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i];
    if (isString(op.insert)) {
      result += op.insert;
    } else if (isObject(op.insert)) {
      result += placeholder;
    }
  }
  return result;
}

export interface IUseQuillInputResult {
  startPos: number;
  length: number;
  bounds: Bounds;
  content: string;
}

export function useQuillInput(options: IQuillInputOptions): [IUseQuillInputResult, () => void] | null {
  const { trigger } = options;
  const quill = useQuill();
  const [result, setResult] = useState<IUseQuillInputResult | null>(null);

  useQuillTextChange((delta: Delta) => {
    const setInputResult = (index: number, length: number): void => {
      if (length <= 0) {
        setResult(null);
        return;
      }
      const bounds = quill.selection.getBounds(index, length);
      const content = quill.getContents(index, length);
      const strContent = lineDeltaToString(content);
      setResult({
        startPos: index,
        length,
        bounds,
        content: strContent,
      });
    }

    if (result) {  // already has result
      const offset = getInsertedOffset(delta);
      if (offset < 0) {
        const deletedOffset = getDeletedOffset(delta);
        if (deletedOffset >= 0) {
          const length = deletedOffset - result.startPos;
          setInputResult(result.startPos, length);
          return;
        }
        setResult(null);
        return;
      }
      if (result && offset <= result.startPos) {
        setResult(null);
      }
      const startPos = result.startPos;
      const length = offset - result.startPos;
      setInputResult(startPos, length);
      return;
    }

    const isInsertingOffset = isInserting(delta, trigger);
    if (isInsertingOffset < 0) {
      setResult(null);
      return;
    }
    const startPos = isInsertingOffset;
    const length = trigger.length;
    setInputResult(startPos, length);
  });

  useQuillSelectionChange((range: Range) => {
    if (result && !range) {
      setResult(null);
      return;
    }

    if (result && (range.index <= result.startPos || range.index > result.startPos + result.length)) {
      setResult(null);
    }
  });

  const clearFn = useCallback(() => {
    setResult(null);
  }, [setResult]);

  return [
    result,
    clearFn,
  ];
}
