import React from "react";
import { resizeHandleStyle, imageResizeTool } from "./image-resize-tool.style";

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

function ImageResizeTool(): React.ReactElement {
  return (
    <div css={imageResizeTool}>
      <ResizeHandle isLeft onMouseDown={() => {}} onMouseUp={() => {}} />
      <ResizeHandle onMouseDown={() => {}} onMouseUp={() => {}} />
    </div>
  );
}

ImageResizeTool.displayName = "ImageResizeTool";

export { ImageResizeTool };
