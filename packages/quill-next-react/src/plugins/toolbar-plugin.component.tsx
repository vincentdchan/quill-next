import React, { useContext, useEffect, useState } from "react"
import { createPortal } from "react-dom";
import { Subject, fromEvent, takeUntil, merge, debounceTime} from "rxjs";
import { Bounds, Range } from "quill-next";
import { QuillContext } from "../context/quill-context";

function ToolbarPlugin() {
  const quill = useContext(QuillContext);
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
    }

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
          style={{
            position: "fixed",
            left: bounds.left,
            top: bounds.top,
          }}
        >
          {JSON.stringify(bounds)}
        </div>
      )}
    </div>,
    document.body,
  );
}

ToolbarPlugin.displayName = "ToolbarPlugin";

export { ToolbarPlugin }
