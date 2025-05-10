import { css } from "@emotion/react";

export const notionLinkContentContainer = css({
  borderRadius: "10px",
  background: "white",
  backdropFilter: "none",
  position: "relative",
  maxWidth: "calc(-24px + 100vw)",
  boxShadow: "rgba(0, 0, 0, 0.1) 0px 14px 28px -6px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px, rgba(84, 72, 49, 0.08) 0px 0px 0px 1px",
  overflow: "hidden",
  width: "330px",

  "&.error": {
    background: "rgb(255, 235, 238)",
  }
});

export const notionLinkInputContainer = css({
  gap: "1px",
  position: "relative",
  display: "flex",
  flexDirection: "column",
});

export const notionLinkInputInnerContainer = css({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  lineHeight: "120%",
  width: "100%",
  userSelect: "none",
  minHeight: "28px",
  fontSize: "12px",
  padding: "4px 8px",

  "input": {
    border: "none",
    outline: "none",
    width: "100%",
    paddingLeft: "8px",
    paddingRight: "8px",
    background: "transparent",
    color: "#222",
  }
});
