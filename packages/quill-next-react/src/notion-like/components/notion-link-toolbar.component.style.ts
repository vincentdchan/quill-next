import { css } from "@emotion/react";

export const notionLinkToolbarContainer = css({
  fontFamily: "Helvetica, Arial, sans-serif",
  borderRadius: "10px",
  background: "white",
  backdropFilter: "none",
  position: "relative",
  maxWidth: "calc(-24px + 100vw)",
  boxShadow: "rgba(0, 0, 0, 0.08) 0px 4px 12px -2px, rgba(84, 72, 49, 0.08) 0px 0px 0px 1px",
  overflow: "hidden",
  height: "32px",
  padding: "4px 0px 4px 6px",
});

export const notionLinkToolbar = css({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "12px",
  color: "rgb(120, 119, 116)",
  fontWeight: "400",
  fill: "rgba(55, 53, 47, 0.45)",
  height: "100%",

  input: {
    border: "none",
    outline: "none",
    fontSize: "12px",
    flex: "1",
    background: "transparent",
    color: "#222",
  },

  ".qn-notion-link-toolbar-button": {
    marginLeft: "6px",
    userSelect: "none",
    transition: "background 20ms ease-in",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "2px 6px",
    whiteSpace: "nowrap",
    marginRight: "2px",
    borderRadius: "4px",
    color: "rgb(50, 48, 44)",
    background: "transparent",
    border: "none",
    outline: "none",
    fontSize: "12px",

    "&:hover": {
      background: "rgba(55, 53, 47, 0.06)",
    },
  },
});
