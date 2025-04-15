import React from "react";
import "./notion-toolbar-button.component.css";

export interface INotionToolbarButtonProps {
  svg? : string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  children?: React.ReactNode;
}

function NotionToolbarButton(props: INotionToolbarButtonProps) {
  const { children, svg, onClick } = props;
  return (
    <div
      className="qn-notion-toolbar-button"
      onClick={onClick}
      dangerouslySetInnerHTML={svg ? {
        __html: svg,
      } : undefined}
    >
      {children}
    </div>
  )
};

export { NotionToolbarButton }
