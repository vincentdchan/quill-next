import React, { useEffect, useState } from "react";
import {
  Subject,
  fromEvent,
  takeUntil,
  merge,
  debounceTime,
  filter,
} from "rxjs";
import Quill, { Bounds } from "quill-next";
import { useQuill } from "../hooks/use-quill";
import { PortalRectAnchor } from "../components/rect-anchor.component";
import { useQuillFormats } from "../hooks/use-quill-formats";
import { useToolbarSignal } from "../hooks/use-toolbar-signal";
import { ToolbarSignal } from "../classes/toolbar-signal.class";
import { getBoundsFromQuill, limitBoundsInRect } from "../utils/bounds";

export interface IToolbarRenderProps {
  toolbarSignal: ToolbarSignal;
  bounds: Bounds;
  formats: Record<string, unknown>;
}

export interface IToolbarPluginProps {
  parentSelector?: string;
  verticalPadding?: number;
  render: (props: IToolbarRenderProps) => React.ReactNode;
}

function ToolbarPlugin(props: IToolbarPluginProps): React.ReactElement {
  const { parentSelector, verticalPadding } = props;
  const quill = useQuill();
  const toolbarSignal = useToolbarSignal();
  const formats = useQuillFormats();
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

    const editorChange$ = fromEvent(quill, Quill.events.EDITOR_CHANGE);

    const position = (reference: Bounds): void => {
      const containerRect = quill.container.getBoundingClientRect();

      const limitedBounds = limitBoundsInRect(reference, containerRect);
      setBounds(limitedBounds);
    };

    editorChange$
      .pipe(
        filter(([eventName, range]) => {
          if (eventName !== Quill.events.SELECTION_CHANGE) {
            return false;
          }

          return !range || range.length === 0;
        }),
        takeUntil(dispose$)
      )
      .subscribe(() => {
        if (toolbarSignal.isKeepingOpen) {
          return;
        }
        setBounds(null);
      });

    const scroll$ = fromEvent(quill.root, "scroll");

    merge(
      scroll$,
      editorChange$.pipe(
        filter(([eventName]) => eventName === Quill.events.SELECTION_CHANGE),
        debounceTime(100),
      ),
      quillContainerMouseUp$
    )
      .pipe(takeUntil(dispose$))
      .subscribe(() => {
        if (isMouseDown) {
          return;
        }

        const bounds = getBoundsFromQuill(quill);
        if (bounds) {
          position(bounds);
        }
      });

    return (): void => {
      dispose$.next();
      dispose$.complete();
    };
  }, [quill]);

  return (
    <PortalRectAnchor
      parentElement={parentSelector}
      bounds={bounds}
      className="qn-toolbar-container"
      verticalPadding={verticalPadding}
      render={() => props.render({ bounds, formats, toolbarSignal })}
    />
  );
}

ToolbarPlugin.displayName = "ToolbarPlugin";

export { ToolbarPlugin };
