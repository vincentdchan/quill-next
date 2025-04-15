import React, { useContext, useEffect, useState, useRef } from "react"
import { createPortal } from "react-dom";
import {
  Subject,
  fromEvent,
  takeUntil,
  merge,
  debounceTime,
  filter,
  timer,
} from "rxjs";
import { Bounds, Range } from "quill-next";
import { QuillContext } from "../context/quill-context";

export interface IToolbarPluginProps {
  render: (bounds: Bounds) => React.ReactNode;
}

function ToolbarPlugin(props: IToolbarPluginProps) {
  const quill = useContext(QuillContext);
  const toolbarContainerRef = useRef<HTMLDivElement | null>(null);
  const [toolbarRect, setToolbarRect] = useState<DOMRect | null>(null);
  const [isPrerendering, setIsPrerendering] = useState(false);
  const [bounds, setBounds] = useState<Bounds | null>(null);

  useEffect(() => {
    const dispose$ = new Subject<void>();

    let isMouseDown = false;
    const quillContainerMouseDown$ = fromEvent(quill.container, "mousedown");
    const quillContainerMouseUp$ = fromEvent(quill.container, "mouseup");

    quillContainerMouseDown$.pipe(takeUntil(dispose$)).subscribe(() => {
      isMouseDown = true;
    });

    quillContainerMouseUp$.pipe(takeUntil(dispose$)).subscribe(() => {
      isMouseDown = false;
    });

    const selectionChange$ = fromEvent(quill, "selection-change");

    const position = (reference: Bounds) => {
      setBounds(reference);
      setIsPrerendering(true);
      timer(0)
        .pipe(takeUntil(dispose$))
        .subscribe(() => {
          const rect = toolbarContainerRef.current?.getBoundingClientRect();
          setToolbarRect(rect);
          setIsPrerendering(false);
        })
    }

    selectionChange$
      .pipe(
        filter(([range]) => !range || range.length === 0),
        takeUntil(dispose$),
      )
      .subscribe(() => {
        setBounds(null);
      });

    merge(selectionChange$, quillContainerMouseUp$)
      .pipe(
        debounceTime(200),
        takeUntil(dispose$),
      )
      .subscribe(() => {
        if (isMouseDown) {
          return;
        }
        const range = quill.getSelection();
        if (!range || range.length === 0) {
          return;
        }

        const lines = quill.getLines(range.index, range.length);
        if (lines.length === 1) {
          const bounds = quill.getBounds(range);
          if (bounds != null) {
            position(bounds);
          }
        } else {
          const lastLine = lines[lines.length - 1];
          const index = quill.getIndex(lastLine);
          const length = Math.min(
            lastLine.length() - 1,
            range.index + range.length - index,
          );
          const indexBounds = quill.getBounds(new Range(index, length));
          if (indexBounds != null) {
            position(indexBounds);
          }
        }
      });

    return () => {
      dispose$.next();
      dispose$.complete();
    }
  }, [quill]);

  return createPortal(
    <div className="qn-toolbar-container">
      {bounds && (
        <div
          ref={toolbarContainerRef}
          style={isPrerendering ? {
            position: "fixed",
            left: -1000,
            top: -1000,
          } : {
            position: "fixed",
            top: bounds.top + bounds.height + 12,
            left: bounds.left + bounds.width / 2 - (toolbarRect?.width ?? 0) / 2,
          }}
        >
          {props.render(bounds)}
        </div>
      )}
    </div>,
    document.body,
  );
}

ToolbarPlugin.displayName = "ToolbarPlugin";

export { ToolbarPlugin }
