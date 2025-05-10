import { notionLikeSelect } from "./notion-like-select.component.style";
import ChevronDownSvg from "./chevron-down.svg?react";

function NotionLikeSelect() {
  return (
    <div role="button" tabIndex={0} css={notionLikeSelect}>
      Text
      <ChevronDownSvg />
    </div>
  )
}

export { NotionLikeSelect };
