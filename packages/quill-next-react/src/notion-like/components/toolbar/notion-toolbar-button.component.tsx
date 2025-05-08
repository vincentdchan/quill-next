import React from "react";
import { notionToolbarButton } from "./notion-toolbar-button.component.style";

export interface INotionToolbarButtonProps {
  active?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  children?: React.ReactNode;
}

function NotionToolbarButton(props: INotionToolbarButtonProps) {
  const { children, onClick, active } = props;
  return (
    <div
      className={"qn-notion-toolbar-button" + (active ? " active" : "")}
      css={notionToolbarButton}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export { NotionToolbarButton }
