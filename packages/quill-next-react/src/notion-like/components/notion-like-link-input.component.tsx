import React, { useRef, useEffect, useState, useCallback } from "react";
import { Bounds } from "quill-next";
import { timer, takeUntil } from "rxjs";
import { createPortal } from "react-dom";
import {
  notionLinkContentContainer,
  notionLinkInputContainer,
  notionLinkInputInnerContainer,
} from "./notion-like-link-input.component.style";
import { useQuill } from "../../hooks/use-quill";
import { ToolbarSignal } from "../../classes/toolbar-signal.class";
import { getBoundsFromQuill } from "../../utils/bounds";
import { validateAndNormalizeUrlWithHttps } from "../../utils/url";
import { InlineRectAnchor } from "../../components/rect-anchor.component";
import { useDispose } from "../../hooks/use-dispose";
import { DropdownMask } from "../../components/dropdown-mask.component";

interface NotionLikeLinkInputContentProps {
  onSubmit?: (value: string) => void;
}

function NotionLikeLinkInputContent(props: NotionLikeLinkInputContentProps): React.ReactElement {
  const { onSubmit } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const dispose$ = useDispose();
  const [value, setValue] = useState("");
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleContainerClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();

      const result = validateAndNormalizeUrlWithHttps(value);
      if (result.isValid) {
        setHasError(false);
        onSubmit?.(result.finalUrl);
      } else {
        setHasError(true);
        timer(2000).pipe(
          takeUntil(dispose$)
        ).subscribe(() => {
          setHasError(false);
        });
      }
    }
  }, [value, onSubmit]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);

  return (
    <div
      css={notionLinkContentContainer}
      onClick={handleContainerClick}
      className={hasError ? "error" : ""}
    >
      <div css={notionLinkInputContainer}>
        <div css={notionLinkInputInnerContainer}>
          <input
            onKeyDown={handleKeyDown}
            placeholder="Paste link here"
            type="text"
            ref={inputRef}
            value={value}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  )
}

NotionLikeLinkInputContent.displayName = "NotionLikeLinkInputContent";

export interface INotionLikeLinkInputProps {
  toolbarSignal: ToolbarSignal;
  maskClassName?: string;
  onCancel?: () => void;
}

function NotionLikeLinkInput(props: INotionLikeLinkInputProps): React.ReactElement {
  const { toolbarSignal, onCancel, maskClassName } = props;
  const quill = useQuill();
  const [bounds, setBounds] = useState<Bounds | null>(null);

  useEffect(() => {
    const bounds = getBoundsFromQuill(quill);
    if (bounds) {
      setBounds(bounds);
    }

    const selection = quill.getSelection(false);
    toolbarSignal.setIsKeepingOpen(true);

    return (): void => {
      toolbarSignal.setIsKeepingOpen(false);
      window.requestAnimationFrame(() => {
        quill.setSelection(selection);
      });
    };
  }, [quill]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === "Escape") {
        onCancel?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return (): void => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onCancel]);

  const handleSubmit = useCallback((value: string) => {
    quill.format("link", value);
    onCancel?.();
  }, [quill, onCancel]);

  return (
    createPortal(
      <DropdownMask
        className={maskClassName}
        onClick={onCancel}
      >
        {bounds && (
          <InlineRectAnchor
            bounds={bounds}
            placement="bottom"
            render={() => (
              <NotionLikeLinkInputContent onSubmit={handleSubmit} />
            )}
          />
        )}
      </DropdownMask>,
      document.body,
    )
  );
}

NotionLikeLinkInput.displayName = "NotionLikeLinkInput";

export { NotionLikeLinkInput }
