import { useRef, useState, useCallback } from "react";
import { notionLikeSelect } from "./notion-like-select.component.style";
import ChevronDownSvg from "./chevron-down.svg?react";
import { NotionLikeDropdownMenu } from "./notion-like-dropdown-menu";
import { createPortal } from "react-dom";

export interface INotionLikeSelectOption {
  label: string;
  value: string;
}

export interface INotionLikeSelectProps {
  options: INotionLikeSelectOption[];
  value: INotionLikeSelectOption;
  onChange?: (value: string) => void;
}

function NotionLikeSelect(props: INotionLikeSelectProps) {
  const { value } = props;
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(() => {
    setShowDropdown(!showDropdown);
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
      {showDropdown && createPortal(<NotionLikeDropdownMenu />, document.body)}
    </>
  )
}

NotionLikeSelect.displayName = "NotionLikeSelect";

export { NotionLikeSelect };
