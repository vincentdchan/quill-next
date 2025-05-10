import { useMemo, useState, useCallback } from "react";
import { NotionToolbarButton } from "./notion-toolbar-button.component";
import { useQuill } from "../../../hooks/use-quill";
import BoldSvg from "./bold.svg?react";
import ItalicSvg from "./italic.svg?react";
import UnderlineSvg from "./underline.svg?react";
import StrikeSvg from "./strike.svg?react";
import LinkSvg from "./link.svg?react";
import ChevronDownSvg from "./chevron-down.svg?react";
import { notionToolbarContainer, notionLinkButton } from "./notion-toolbar.component.style";
import { NotionLikeLinkInput } from "../notion-like-link-input.component";
import { NotionLikeSelect, INotionLikeSelectOption } from "./notion-like-select.component";
import { ToolbarSignal } from "../../../classes/toolbar-signal.class";

export interface INotionToolbarProps {
  formats: Record<string, unknown>;
  toolbarSignal: ToolbarSignal;
}

const DISABLE_FORMATS: string[] = [
  "code-block",
];

const PARAGRAPH_OPTIONS: INotionLikeSelectOption[] = [
  { label: "Text", key: "text", value: { header: false } },
  { label: "Heading 1", key: "heading-1", value: { header: 1 } },
  { label: "Heading 2", key: "heading-2", value: { header: 2 } },
  { label: "Heading 3", key: "heading-3", value: { header: 3 } },
];

function NotionToolbar(props: INotionToolbarProps): React.ReactElement {
  const quill = useQuill();
  const { formats, toolbarSignal } = props;

  const disableSet = useMemo(() => {
    return new Set(DISABLE_FORMATS);
  }, [DISABLE_FORMATS]);

  const [showLinkInput, setShowLinkInput] = useState(false);

  const handleLinkButtonClick = useCallback(() => {
    setShowLinkInput(!showLinkInput);
  }, [showLinkInput]);

  const selectedType = useMemo(() => {
    return PARAGRAPH_OPTIONS.find((option) => option.value.header === formats.header) ?? PARAGRAPH_OPTIONS[0];
  }, [formats]);

  const handleSelectType = useCallback((option: INotionLikeSelectOption) => {
    const { value } = option;

    Object.entries(value).forEach(([key, value]) => {
      quill.format(key, value);
    });
  }, [quill]);

  const isDisabled = Object.keys(formats).some((format) => disableSet.has(format));
  if (isDisabled) {
    return null;
  }

  return (
    <>
      <div className="qn-notion-toolbar-container" css={notionToolbarContainer}>
        <NotionLikeSelect
          options={PARAGRAPH_OPTIONS}
          value={selectedType}
          onSelect={handleSelectType}
        />
        <NotionToolbarButton
          onClick={() => quill.format("bold", !formats["bold"])}
          active={!!formats["bold"]}
        >
          <BoldSvg />
        </NotionToolbarButton>
        <NotionToolbarButton
          onClick={() => quill.format("italic", !formats["italic"])}
          active={!!formats["italic"]}
        >
          <ItalicSvg />
        </NotionToolbarButton>
        <NotionToolbarButton
          onClick={() => quill.format("underline", !formats["underline"])}
          active={!!formats["underline"]}
        >
          <UnderlineSvg />
        </NotionToolbarButton>
        <NotionToolbarButton
          onClick={() => quill.format("strike", !formats["strike"])}
          active={!!formats["strike"]}
        >
          <StrikeSvg />
        </NotionToolbarButton>
        <NotionToolbarButton onClick={handleLinkButtonClick}>
          <div css={notionLinkButton}>
            <LinkSvg />
            <ChevronDownSvg />
          </div>
        </NotionToolbarButton>
      </div>
      {showLinkInput && (
        <NotionLikeLinkInput
          toolbarSignal={toolbarSignal}
          onCancel={() => setShowLinkInput(false)}
        />
      )}
    </>
  )
}

NotionToolbar.displayName = "NotionToolbar";

export { NotionToolbar }
