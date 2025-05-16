import React, { useRef } from "react";
import { PortalRectAnchor } from "../../../components/rect-anchor.component";
import { notionToolbarButton } from "./notion-toolbar-button.style";
import { NotionLikeTooltip } from "../notion-like-tooltip";
import { useTooltipUtils } from "../../hooks/use-tooltip-utils";

export interface INotionToolbarButtonProps {
  active?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  children?: React.ReactNode;
  tooltip?: string;
}

function NotionToolbarButton(props: INotionToolbarButtonProps): React.ReactElement {
  const { children, onClick, active, tooltip } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const { isHover, rect, handleMouseEnter, handleMouseLeave } = useTooltipUtils({ containerRef });

  return (
    <>
      <div
        ref={containerRef}
        role="button"
        tabIndex={0}
        className={"qn-notion-toolbar-button" + (active ? " active" : "")}
        css={notionToolbarButton}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
      {isHover && rect && tooltip && (
        <PortalRectAnchor
          placement="top"
          bounds={rect}
          verticalPadding={8}
          render={() => (
            <NotionLikeTooltip>
              {tooltip}
            </NotionLikeTooltip>
          )}
        />
      )}
    </>
  )
}

NotionToolbarButton.displayName = "NotionToolbarButton";

export { NotionToolbarButton }
