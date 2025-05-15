import { css } from "@emotion/react";

export const imageResizeTool = css({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
});

export const resizeHandleStyle = css({
  position: "absolute",
  width: "8px",
  height: "48px",
  borderRadius: "5px",
  backgroundColor: "white",
  top: "50%",
  border: "1px solid rgb(221, 221, 221)",
  boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.1)",
  transform: "translateY(-50%)",
});
