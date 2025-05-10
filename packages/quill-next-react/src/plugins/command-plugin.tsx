import React, { useEffect, useRef, useCallback } from "react";
import { useQuillInput, type IUseQuillInputResult } from "../hooks/use-quill-input";
import { PortalRectAnchor } from "../components/rect-anchor.component";
import { Subject, fromEvent, takeUntil } from "rxjs";
import { useQuill } from "../hooks/use-quill";
import { useQuillArrowIndex } from "../hooks/use-quill-arrow-index";
import { Delta } from "quill-next";

export interface ICommandRenderOptions {
  selectedIndex: number;
  content: string;
  apply: () => void;
}

export interface ICommandPluginProps {
  trigger: string;
  length: number;
  onEnter?: (index: number) => void;
  render?: (options: ICommandRenderOptions) => React.ReactNode;
}

function CommandPlugin(props: ICommandPluginProps): React.ReactElement {
  const { trigger, length, render, onEnter } = props;
  const quill = useQuill();
  const inputResultRef = useRef<IUseQuillInputResult | null>(null);
  const [inputResult, clearInput] = useQuillInput({
    trigger,
  });

  const [selectedIndex, setSelectedIndex] = useQuillArrowIndex(inputResult ? length : -1);

  useEffect(() => {
    inputResultRef.current = inputResult;
    if (!inputResult) {
      setSelectedIndex(0);
    }
  }, [inputResult, setSelectedIndex]);

  const apply = useCallback(() => {
    const inputResult = inputResultRef.current;
    if (!inputResult) {
      return;
    }
    quill.updateContents(new Delta().retain(inputResult.startPos).delete(inputResult.length));
    clearInput();
  }, [clearInput]);

  useEffect(() => {
    const dispose$ = new Subject<void>();
    const keydown$ = fromEvent(quill.root, "keydown", { capture: true });

    keydown$.pipe(takeUntil(dispose$)).subscribe((e: KeyboardEvent) => {
      const inputResult = inputResultRef.current;
      if (!inputResult) {
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        clearInput();
      } else if (e.key === "Enter") {
        e.preventDefault();
        apply();
        window.requestAnimationFrame(() => {
          onEnter?.(selectedIndex);
        });
      }
    });

    return (): void => {
      dispose$.next();
      dispose$.complete();
    };
  }, [quill, clearInput, apply, length]);

  if (!inputResult) {
    return null;
  }

  return (
    <PortalRectAnchor
      className="qn-command-container"
      bounds={inputResult.bounds}
      placement="bottom"
      render={() =>
        render?.({
          selectedIndex,
          content: inputResult.content,
          apply,
        })
      }
    />
  );
}

CommandPlugin.displayName = "CommandPlugin";

export { CommandPlugin };
