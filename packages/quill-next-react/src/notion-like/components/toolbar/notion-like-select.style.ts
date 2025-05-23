import { css } from "@emotion/react";
import { defaultFontFamily } from "../../constants/font-family";

export const notionLikeSelect = css({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "6px",
  userSelect: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontFamily: defaultFontFamily,

  "&:hover": {
    backgroundColor: "rgba(55, 53, 47, 0.06)",
  },
});
