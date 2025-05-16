import React from "react";
import { notionLikeTooltip } from "./notion-like-tooltip.style";

export interface INotionLikeTooltipProps {
  children?: React.ReactNode;
}

function NotionLikeTooltip(props: INotionLikeTooltipProps): React.ReactElement {
  const { children } = props;
  return (
    <div css={notionLikeTooltip}>
      {children}
    </div>
  )
}

NotionLikeTooltip.displayName = "NotionLikeTooltip";

export { NotionLikeTooltip }
