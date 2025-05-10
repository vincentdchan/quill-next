import { useRef, useState, useCallback } from "react";
import { notionLikeSelect } from "./notion-like-select.component.style";
import ChevronDownSvg from "./chevron-down.svg?react";
import { NotionLikeDropdownMenu, NotionLikeDropdownMenuItem } from "./notion-like-dropdown-menu";
import { DropdownMask } from "../../../components/dropdown-mask.component";
import { InlineRectAnchor } from "../../../components/rect-anchor.component";
import { createPortal } from "react-dom";

export interface INotionLikeSelectOption {
  label: string;
  key: string;
  value: Record<string, unknown>;
}

export interface INotionLikeSelectProps {
  options: INotionLikeSelectOption[];
  value: INotionLikeSelectOption;
  onSelect?: (value: INotionLikeSelectOption) => void;
}

function NotionLikeSelect(props: INotionLikeSelectProps) {
  const { value, options, onSelect } = props;
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

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        css={notionLikeSelect}
        ref={containerRef}
        onClick={handleClick}
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
    </>
  )
}

NotionLikeSelect.displayName = "NotionLikeSelect";

export { NotionLikeSelect };
