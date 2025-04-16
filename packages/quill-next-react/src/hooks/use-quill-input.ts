import { useRef, useState } from "react";
import { useQuill } from "./use-quill";
import { useQuillEditorChange } from "./use-quill-editor-change";
import { Delta } from "quill-next";

export interface IQuillInputOptions {
  match: RegExp;
}

const placeholder = "\u00A0";

function isInserting(delta: Delta): number {
  const { ops } = delta;
  if (ops.length === 1 && typeof ops[0].insert === "string") {
    return 0;
  } else if (ops.length > 1 && typeof ops[0].retain === "number" && typeof ops[1].insert === "string") {
    return ops[0].retain;
  }
  return -1;
}

function lineDeltaToString(delta: Delta): string {
  const { ops } = delta;
  let result = "";
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i];
    if (typeof op.insert === "string") {
      result += op.insert;
    } else if (typeof op.insert === "object") {
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
      clear();
    } else if (args[0] === "text-change") {
      window.requestAnimationFrame(() => {
        const isInsertingOffset = isInserting(args[1]);
        if (isInsertingOffset >= 0) {
          const [line, offset] = quill.getLine(isInsertingOffset);
          const delta = line.delta();

          const deltaContent = lineDeltaToString(delta);

          console.log("isInserting", isInsertingOffset, line, line.length(), 'offset', offset);
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

          if (last.index + (last[1]?.length ?? 0) === range.index) {
            console.log("!!!!!!", last.index, last[1]?.length ?? 0, range.index);
          }

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
