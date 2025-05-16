import { css } from "@emotion/react";
import { defaultFontFamily, monoFontFamily } from "../constants/font-family";

export const notionLikeQuillEditor = css({
  ".ql-editor": {
    fontFamily: defaultFontFamily,
    fontSize: "16px",
    lineHeight: 1.5,

    "code": {
      lineHeight: 1.5,
      color: "#EB5757",
      fontFamily: monoFontFamily,
      background: "rgba(135, 131, 120, .15)",
      borderRadius: "4px",
      fontSize: "85%",
      padding: "0.2em 0.4em",
    },

    "ol": {
      paddingLeft: "0px",
    }
  },
});
