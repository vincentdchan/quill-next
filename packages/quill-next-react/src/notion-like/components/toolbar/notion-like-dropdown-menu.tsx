import React from "react";
import {
  notionLikeDropdownMenuContainer,
  notionLikeDropdownMenuItemContainer,
  notionLikeDropdownMenuItem,
} from "./notion-like-dropdown-menu.style";
import CheckMarkSvg from "./checkmark.svg?react";

export interface NotionLikeDropdownMenuProps {
  children?: React.ReactNode;
}

function NotionLikeDropdownMenu(props: NotionLikeDropdownMenuProps): React.ReactElement {
  const { children } = props;
  return (
    <div css={notionLikeDropdownMenuContainer}>
      {children}
    </div>
  )
}

NotionLikeDropdownMenu.displayName = "NotionLikeDropdownMenu";

export interface NotionLikeDropdownMenuItemProps {
  active?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  children?: React.ReactNode;
}

function NotionLikeDropdownMenuItem(props: NotionLikeDropdownMenuItemProps): React.ReactElement {
  const { active, children, onClick } = props;
  return (
    <div
      css={notionLikeDropdownMenuItemContainer}
      onClick={onClick}
    >
      <div css={notionLikeDropdownMenuItem}>
        {children}
        {active && <div className="checkmark"><CheckMarkSvg /></div>}
      </div>
    </div>
  )
}

NotionLikeDropdownMenuItem.displayName = "NotionLikeDropdownMenuItem";

export {
  NotionLikeDropdownMenu,
  NotionLikeDropdownMenuItem,
};
