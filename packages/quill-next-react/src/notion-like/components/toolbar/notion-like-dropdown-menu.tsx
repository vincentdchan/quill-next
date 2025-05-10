import React from "react";
import {
  notionLikeDropdownMenuContainer,
  notionLikeDropdownMenuItemContainer,
  notionLikeDropdownMenuItem,
} from "./notion-like-dropdown-menu.style";

export interface NotionLikeDropdownMenuProps {
  children?: React.ReactNode;
}

function NotionLikeDropdownMenu(props: NotionLikeDropdownMenuProps) {
  const { children } = props;
  return (
    <div css={notionLikeDropdownMenuContainer}>
      {children}
    </div>
  )
}

NotionLikeDropdownMenu.displayName = "NotionLikeDropdownMenu";

export interface NotionLikeDropdownMenuItemProps {
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  children?: React.ReactNode;
}

function NotionLikeDropdownMenuItem(props: NotionLikeDropdownMenuItemProps) {
  const { children, onClick } = props;
  return (
    <div
      css={notionLikeDropdownMenuItemContainer}
      onClick={onClick}
    >
      <div css={notionLikeDropdownMenuItem}>
        {children}
      </div>
    </div>
  )
}

NotionLikeDropdownMenuItem.displayName = "NotionLikeDropdownMenuItem";

export {
  NotionLikeDropdownMenu,
  NotionLikeDropdownMenuItem,
};
