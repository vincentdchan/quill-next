import { notionLikeSelect } from "./notion-like-select.component.style";
import ChevronDownSvg from "./chevron-down.svg?react";

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
  return (
    <div role="button" tabIndex={0} css={notionLikeSelect}>
      {value.label}
      <ChevronDownSvg />
    </div>
  )
}

NotionLikeSelect.displayName = "NotionLikeSelect";

export { NotionLikeSelect };
