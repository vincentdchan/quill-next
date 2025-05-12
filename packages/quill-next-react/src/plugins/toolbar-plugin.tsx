import React, { useEffect, useState } from "react";
import {
  fromEvent,
  takeUntil,
  merge,
  filter,
} from "rxjs";
import { throttle } from "lodash-es";
import Quill, { Bounds } from "quill-next";
import { useQuill } from "../hooks/use-quill";
import { PortalRectAnchor } from "../components/rect-anchor.component";
import { useQuillFormats } from "../hooks/use-quill-formats";
import { useToolbarSignal } from "../hooks/use-toolbar-signal";
import { ToolbarSignal } from "../classes/toolbar-signal.class";
import { getBoundsFromQuill, limitBoundsInRect } from "../utils/bounds";
import { useDispose } from "../hooks/use-dispose";

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
  const dispose$ = useDispose();

  useEffect(() => {
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

    const handleScroll = throttle(() => {
      if (isMouseDown) {
        return;
      }

      const bounds = getBoundsFromQuill(quill);
      if (bounds) {
        position(bounds);
      }
    }, 30);

    merge(
      editorChange$.pipe(
        filter(([eventName]) => eventName === Quill.events.SELECTION_CHANGE),
      ),
      quillContainerMouseUp$
    )
      .pipe(takeUntil(dispose$))
      .subscribe(handleScroll);

    let currentElement: HTMLElement | null = quill.root;
    while (currentElement) {
      const style = window.getComputedStyle(currentElement);
      const overflowY = style.overflowY;
      const overflowX = style.overflowX;
      const isScrollable = overflowY === "auto" || overflowY === "scroll" || overflowX === "auto" || overflowX === "scroll";

      if (isScrollable) {
        const scroll$ = fromEvent(currentElement, "scroll");
        scroll$.pipe(takeUntil(dispose$)).subscribe(() => {
          if (isMouseDown) {
            return;
          }

          const bounds = getBoundsFromQuill(quill);
          if (bounds) {
            position(bounds);
          }
        });
      }

      if (currentElement === document.body || currentElement === document.documentElement) {
        const windowScroll$ = fromEvent(window, "scroll");
        const documentScroll$ = fromEvent(document, "scroll");
        const documentElementScroll$ = fromEvent(document.documentElement, "scroll");

        merge(
          windowScroll$,
          documentScroll$,
          documentElementScroll$,
        )
        .pipe(takeUntil(dispose$))
        .subscribe(handleScroll);
      }

      if (currentElement === document.body) {
        // Once we reach the body, we can stop traversing up for element-specific scroll,
        // as window/document listeners cover the rest.
        // However, you might still want to check document.documentElement
        // if body isn't the primary scroller.
        currentElement = document.documentElement; // Check documentElement next
        if (currentElement === document.documentElement && !isScrollable) { // if documentElement wasn't scrollable, break
            break;
        }
        continue; // Continue to ensure documentElement scroll listener is attached if needed
      }

      currentElement = currentElement.parentElement;
    }
  }, [quill, dispose$]);

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
