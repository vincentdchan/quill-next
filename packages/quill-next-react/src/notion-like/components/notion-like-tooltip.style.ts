import { css } from "@emotion/react";
import { defaultFontFamily } from "../constants/font-family";

export const notionLikeTooltip = css`
  background-color: #000;
  color: #fff;
  font-family: ${defaultFontFamily};
  font-size: 12px;
  font-weight: 500;
  line-height: 1.5;
  padding: 4px 8px;
  border-radius: 4px;
`;
