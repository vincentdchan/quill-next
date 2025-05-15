import { css } from "@emotion/react";

export const imageResizeTool = css({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  transition: "opacity 200ms ease-in-out",
});

export const resizeHandleStyle = css({
  position: "absolute",
  width: "6px",
  height: "48px",
  borderRadius: "5px",
  backgroundColor: "rgba(15, 15, 15, 0.6)",
  top: "50%",
  border: "1px solid rgba(255, 255, 255, 0.9)",
  boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.1)",
  transform: "translateY(-50%)",
  cursor: "col-resize",
});
