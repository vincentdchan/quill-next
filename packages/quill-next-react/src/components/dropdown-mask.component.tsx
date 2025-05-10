import React from "react";
import { dropdownMaskContainer } from "./dropdown-mask.component.style";

export interface IDropdownMaskProps {
  className?: string;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

function DropdownMask(props: IDropdownMaskProps): React.ReactElement {
  const { children, className, onClick } = props;

  return (
    <div
      css={dropdownMaskContainer}
      className={className}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

DropdownMask.displayName = "DropdownMask";

export { DropdownMask };
