import { css } from "@emotion/react";

export const notionMenuList = css({
  borderRadius: "10px",
  background: "white",
  backdropFilter: "none",
  position: "relative",
  maxWidth: "calc(-24px + 100vw)",
  boxShadow: "rgba(0, 0, 0, 0.1) 0px 14px 28px -6px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px, rgba(84, 72, 49, 0.08) 0px 0px 0px 1px",
  overflow: "hidden",
  fontFamily: "ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI Variable Display', 'Segoe UI', Helvetica, 'Apple Color Emoji', Arial, sans-serif, 'Segoe UI Emoji', 'Segoe UI Symbol'",
  minWidth: "180px",
});

export const notionMenuItemHeader = css({
  display: "flex",
  paddingLeft: "8px",
  paddingRight: "8px",
  marginTop: "6px",
  marginBottom: "8px",
  color: "rgb(120, 119, 116)",
  fill: "rgba(55, 53, 47, 0.45)",
  fontSize: "12px",
  fontWeight: "500",
  lineHeight: "120%",
  userSelect: "none",
});

export const notionMenuItem = css({
  display: "flex",
  transition: "background 20ms ease-in",
  cursor: "pointer",
  width: "100%",
  borderRadius: "6px",
  alignItems: "center",
  gap: "8px",
  lineHeight: "120%",
  userSelect: "none",
  minHeight: "28px",
  fontSize: "14px",
  paddingLeft: "8px",
  paddingRight: "8px",

  "&:hover": {
    backgroundColor: "rgba(55, 53, 47, 0.06)",
  },

  "&.active": {
    backgroundColor: "rgba(55, 53, 47, 0.06)",
  },

  ".qn-notion-menu-item-content": {
    marginLeft: "0px",
    marginRight: "0px",
    minWidth: "0px",
    flex: "1 1 auto",
    height: "32px",
    display: "flex",
    alignItems: "center",
  },
});
