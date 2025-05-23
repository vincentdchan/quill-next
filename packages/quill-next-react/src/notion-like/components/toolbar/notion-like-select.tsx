import { useRef, useState, useCallback } from "react";
import { notionLikeSelect } from "./notion-like-select.style";
import ChevronDownSvg from "./chevron-down.svg?react";
import { NotionLikeDropdownMenu, NotionLikeDropdownMenuItem } from "./notion-like-dropdown-menu";
import { DropdownMask } from "../../../components/dropdown-mask.component";
import { InlineRectAnchor, PortalRectAnchor } from "../../../components/rect-anchor.component";
import { createPortal } from "react-dom";
import { useTooltipUtils } from "../../hooks/use-tooltip-utils";
import { NotionLikeTooltip } from "../notion-like-tooltip";

export interface INotionLikeSelectOption {
  label: string;
  key: string;
  value: Record<string, unknown>;
}

export interface INotionLikeSelectProps {
  options: INotionLikeSelectOption[];
  value: INotionLikeSelectOption;
  onSelect?: (value: INotionLikeSelectOption) => void;
  tooltip?: string;
}

function NotionLikeSelect(props: INotionLikeSelectProps): React.ReactElement {
  const { value, options, onSelect, tooltip } = props;
  const [showDropdown, setShowDropdown] = useState(false);
  const [bounds, setBounds] = useState<DOMRect | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(() => {
    setShowDropdown(!showDropdown);

    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setBounds(rect);
    }
  }, [showDropdown]);

  const { isHover, rect, handleMouseEnter, handleMouseLeave } = useTooltipUtils({ containerRef });

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        css={notionLikeSelect}
        ref={containerRef}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {value.label}
        <ChevronDownSvg />
      </div>
      {showDropdown && createPortal(
        <DropdownMask>
          {bounds && (
            <InlineRectAnchor
              bounds={bounds}
              placement="bottom"
              verticalPadding={4}
              render={() => (
                <NotionLikeDropdownMenu>
                  {options.map((option) => (
                    <NotionLikeDropdownMenuItem
                      key={option.key}
                      active={option.key === value.key}
                      onClick={() => {
                        onSelect?.(option);
                        setShowDropdown(false);
                      }}
                    >
                      {option.label}
                    </NotionLikeDropdownMenuItem>
                  ))}
                </NotionLikeDropdownMenu>
              )}
            />
          )}
        </DropdownMask>,
        document.body)}
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

NotionLikeSelect.displayName = "NotionLikeSelect";

export { NotionLikeSelect };
