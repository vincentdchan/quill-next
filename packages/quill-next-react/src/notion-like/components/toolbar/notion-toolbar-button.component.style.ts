import { css } from "@emotion/react";

export const notionToolbarButton = css({
  userSelect: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fill: "rgb(50, 48, 44)",
  borderRadius: "6px",
  height: "28px",
  // width: "28px",
  padding: "6px",
  boxSizing: "border-box",
  isolation: "isolate",

  "&.active": {
    fill: "rgb(35, 131, 226)",
  },

  "&:hover": {
    backgroundColor: "rgba(55, 53, 47, 0.06)",
  },
});
