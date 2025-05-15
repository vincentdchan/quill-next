import React, { useRef } from "react";
import { resizeHandleStyle, imageResizeTool } from "./image-resize-tool.style";
import { useDispose } from "../hooks/use-dispose";
import { fromEvent, takeUntil } from "rxjs";
import Quill, { Delta } from "quill-next";
import { useQuill } from "../hooks/use-quill";

interface ResizeHandleProps {
  isLeft?: boolean;
  onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
  onMouseUp?: React.MouseEventHandler<HTMLDivElement>;
}

function ResizeHandle(props: ResizeHandleProps) {
  let style: React.CSSProperties;
  if (props.isLeft) {
    style = {
      left: "8px",
      right: undefined,
      cursor: "w-resize",
    };
  } else {
    style = {
      left: undefined,
      right: "8px",
      cursor: "e-resize",
    };
  }
  return (
    <div
      css={resizeHandleStyle}
      style={style}
      onMouseDown={props.onMouseDown}
      onMouseUp={props.onMouseUp}
    />
  );
}

ResizeHandle.displayName = "ResizeHandle";

export interface IImageResizeToolProps {
  minWidth?: number;
  setTempWidth: (width: number | undefined) => void;
  getBlotIndex: () => number;
}

function ImageResizeTool(props: IImageResizeToolProps): React.ReactElement {
  const { minWidth = 100, setTempWidth, getBlotIndex } = props;
  const dispose$ = useDispose();
  const quill = useQuill();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown =
    (isLeft: boolean) => (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();

      const mouseMove$ = fromEvent<MouseEvent>(document, "mousemove");
      const mouseUp$ = fromEvent<MouseEvent>(document, "mouseup");

      const startRect = containerRef.current?.getBoundingClientRect();
      if (!startRect) {
        return;
      }

      const startWidth = startRect.width;
      const startClientX = e.clientX;
      let newWidth = startWidth;

      mouseMove$
        .pipe(takeUntil(mouseUp$), takeUntil(dispose$))
        .subscribe((evt) => {
          evt.preventDefault();

          const clientXDiff = evt.clientX - startClientX;
          newWidth = Math.round(startWidth + clientXDiff);
          newWidth = Math.max(newWidth, minWidth);
          if (newWidth === startWidth) {
            setTempWidth(undefined);
          } else {
            setTempWidth(newWidth);
          }
        });

      mouseUp$.pipe(takeUntil(dispose$)).subscribe(() => {
        setTempWidth(undefined);

        const blotIndex = getBlotIndex();
        if (blotIndex === -1) {
          return;
        }

        const delta = new Delta().retain(blotIndex).retain(1, {
          width: newWidth,
        });

        quill.updateContents(delta);
      });
    };

  return (
    <div ref={containerRef} css={imageResizeTool}>
      <ResizeHandle
        isLeft
        onMouseDown={handleMouseDown(true)}
        onMouseUp={() => {}}
      />
      <ResizeHandle onMouseDown={handleMouseDown(false)} onMouseUp={() => {}} />
    </div>
  );
}

ImageResizeTool.displayName = "ImageResizeTool";

export { ImageResizeTool };
