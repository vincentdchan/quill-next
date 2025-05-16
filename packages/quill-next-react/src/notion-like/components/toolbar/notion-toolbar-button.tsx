import React, { useRef, useCallback, useState, useMemo, useEffect } from "react";
import { Subject, timer, takeUntil } from "rxjs";
import { PortalRectAnchor } from "../../../components/rect-anchor.component";
import { notionToolbarButton } from "./notion-toolbar-button.style";
import { NotionLikeTooltip } from "../notion-like-tooltip";

export interface INotionToolbarButtonProps {
  active?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  children?: React.ReactNode;
  tooltip?: string;
}

function NotionToolbarButton(props: INotionToolbarButtonProps): React.ReactElement {
  const { children, onClick, active, tooltip } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHover, setIsHover] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const cancel$ = useMemo(() => new Subject<void>(), []);
  useEffect(() => {
    return (): void => {
      cancel$.next();
      cancel$.complete();
    }
  }, [cancel$]);

  const handleMouseEnter = useCallback(() => {
    cancel$.next();

    timer(200)
      .pipe(takeUntil(cancel$))
      .subscribe(() => {
        setIsHover(true);
        setRect(containerRef.current?.getBoundingClientRect());
      });
  }, [cancel$]);

  const handleMouseLeave = useCallback(() => {
    setIsHover(false);
    setRect(null);
    cancel$.next();
  }, [cancel$]);

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
