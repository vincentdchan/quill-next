import { useRef, useState } from "react";
import { useQuill } from "./use-quill";
import { useQuillEditorChange } from "./use-quill-editor-change";
import { Delta } from "quill-next";
import { isString, isNumber, isObject } from "lodash-es";

export interface IQuillInputOptions {
  trigger: string;
  match: RegExp;
}

const placeholder = "\u00A0";

function isInserting(delta: Delta): number {
  const { ops } = delta;
  if (ops.length === 1 && isString(ops[0].insert)) {
    return 0;
  } else if (ops.length > 1 && isNumber(ops[0].retain) && isString(ops[1].insert)) {
    return ops[0].retain;
  }
  return -1;
}

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
}

export function useQuillInput(options: IQuillInputOptions): IUseQuillInputResult | null {
  const { match } = options;
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
      startPos.current = range.index;
      clear();
    } else if (args[0] === "text-change") {
      window.requestAnimationFrame(() => {
        const isInsertingOffset = isInserting(args[1]);
        if (isInsertingOffset >= 0) {
          const [line, offset] = quill.getLine(isInsertingOffset);
          const delta = line.delta();

          const deltaContent = lineDeltaToString(delta);

          const r = new RegExp(match, "g");

          const execArr: RegExpExecArray[] = [];

          let index = 0;
          let regexResult = r.exec(deltaContent);
          while (regexResult && index++ <= 10) {
            execArr.push(regexResult);
            regexResult = r.exec(deltaContent);
          }

          if (execArr.length === 0) {
            return;
          }

          const last = execArr[execArr.length - 1];
          const range = quill.getSelection();
          if (range.length > 0) {
            return;
          }

          console.log("!!!!!!", last.index, last[1]?.length ?? 0, range.index);

          setResult({
            startPos: isInsertingOffset,
            length: delta.length(),
          })
        }
      });
    }
  }, [quill, result, match]);

  return result;
}
