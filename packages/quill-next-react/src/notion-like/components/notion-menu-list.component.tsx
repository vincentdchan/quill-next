import React from "react";
import { notionMenuList, notionMenuItemHeader, notionMenuItem } from "./notion-menu-list.component.style";

export interface INotionMenuList {
  children?: React.ReactNode;
}

function NotionMenuList(props: INotionMenuList): React.ReactElement {
  const { children } = props;
  return <div className="qn-notion-menu-list" css={notionMenuList}>{children}</div>;
}

export interface INotionMenuItemHeader {
  children?: React.ReactNode;
  active?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

function NotionMenuItemHeader(props: INotionMenuItemHeader): React.ReactElement {
  const { children, onClick } = props;
  return (
    <div className="qn-notion-menu-item-header" css={notionMenuItemHeader} onClick={onClick}>
      {children}
    </div>
  );
}

function NotionMenuItem(props: INotionMenuItemHeader): React.ReactElement {
  const { children, active, onClick } = props;
  return (
    <div
      className={"qn-notion-menu-item" + (active ? " active" : "")}
      css={notionMenuItem}
      onClick={onClick}
    >
      <div className="qn-notion-menu-item-content">{children}</div>
    </div>
  );
}

export { NotionMenuList, NotionMenuItemHeader, NotionMenuItem };
