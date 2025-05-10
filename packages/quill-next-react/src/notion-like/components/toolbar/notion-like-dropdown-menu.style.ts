import { css } from "@emotion/react";

export const notionLikeDropdownMenuContainer = css({
  position: "relative",
  background: "white",
  backdropFilter: "none",
  maxWidth: "calc(-24px + 100vw)",
  boxShadow: `rgba(0, 0, 0, 0.1) 0px 14px 28px -6px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px, rgba(84, 72, 49, 0.08) 0px 0px 0px 1px`,
  overflow: "hidden",
  borderRadius: "10px",
  padding: "4px",
});

export const notionLikeDropdownMenuItemContainer = css({
  userSelect: "none",
  transition: "background 20ms ease-in",
  display: "flex",
  width: "100%",
  cursor: "pointer",
  borderRadius: "6px",

  "&:hover": {
    background: "rgba(55, 53, 47, 0.06)",
  }
});

export const notionLikeDropdownMenuItem = css({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  lineHeight: "120%",
  width: "100%",
  userSelect: "none",
  minHeight: "28px",
  fontSize: "14px",
  paddingLeft: "8px",
  paddingRight: "8px",
  fontFamily: "Inter, sans-serif",

  ".checkmark": {
    marginLeft: "auto",
    minWidth: "0px",
    flexShrink: 0,
  },
});
