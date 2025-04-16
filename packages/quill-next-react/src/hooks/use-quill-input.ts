import { useRef, useState } from "react";
import { useQuill } from "./use-quill";
import { useQuillEditorChange } from "./use-quill-editor-change";
import { Delta } from "quill-next";
import { isString, isNumber } from "lodash-es";

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

// const placeholder = "\u00A0";
// function lineDeltaToString(delta: Delta): string {
//   const { ops } = delta;
//   let result = "";
//   for (let i = 0; i < ops.length; i++) {
//     const op = ops[i];
//     if (isString(op.insert)) {
//       result += op.insert;
//     } else if (isObject(op.insert)) {
//       result += placeholder;
//     }
//   }
//   return result;
// }

export interface IUseQuillInputResult {
  startPos: number;
  length: number;
}

export function useQuillInput(options: IQuillInputOptions): [IUseQuillInputResult, () => void] | null {
  const { trigger } = options;
  const quill = useQuill();
  const startPos = useRef<number | null>(null);
  const [result, setResult] = useState<IUseQuillInputResult | null>(null);
  useQuillEditorChange((...args) => {
    const clear = () => {
      startPos.current = null;
    }

    if (args[0] === "selection-change") {
      if (args[3] === "silent") {
        return;
      }
      const range = args[1];

      if (result && (range.index < result.startPos || range.index > result.startPos + result.length)) {
        setResult(null);
      }

      clear();
    } else if (args[0] === "text-change") {
      if (result) {
        const offset = getInsertedOffset(args[1]);
        if (offset < 0) {
          return;
        }
        if (result && offset <= result.startPos) {
          setResult(null);
        }
        setResult({
          startPos: result.startPos,
          length: offset - result.startPos,
        })
        return;
      }
      const isInsertingOffset = isInserting(args[1], trigger);
      if (isInsertingOffset < 0) {
        return;
      }
      setResult({
        startPos: isInsertingOffset,
        length: trigger.length,
      })
    }
  }, [quill, result]);

  return [
    result,
    () => setResult(null),
  ];
}
