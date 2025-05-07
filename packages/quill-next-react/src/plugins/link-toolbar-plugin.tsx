import React, { useState, useCallback, useRef, useEffect } from "react";
import { takeUntil, timer } from "rxjs";
import { Link } from "quill-next";
import { useQuill } from "../hooks/use-quill";
import { useQuillEvent } from "../hooks/use-quill-event";
import { RectAnchor } from "../components/rect-anchor.component";
import { messages } from "../messages";
import { useDispose } from "../hooks/use-dispose";
import { useQuillEditorChange } from "../hooks/use-quill-editor-change";
import { debounce } from "lodash-es";

export interface ILinkToolbarRenderProps {
  link: string;
  index: number;
  length: number;
}

export interface ILinkToolbarPluginProps {
  parentSelector?: string;
  verticalPadding?: number;
  render?: (value: ILinkToolbarRenderProps) => React.ReactNode;
}

const DEFAULT_VERTICAL_PADDING = 8;
const MOUSE_HANDLE_DELAY_TIME = 400;

function LinkToolbarPlugin(props: ILinkToolbarPluginProps) {
  const { parentSelector, verticalPadding = DEFAULT_VERTICAL_PADDING, render } = props;
  const quill = useQuill();
  const [linkRect, setLinkRect] = useState<DOMRect | null>(null);
  const [value, setValue] = useState<ILinkToolbarRenderProps | null>(null);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const dispose$ = useDispose();

  const checkHoveringAndCloseRef = useRef(() => {});

  useEffect(() => {
    checkHoveringAndCloseRef.current = () => {
      if (!isHovering) {
        setLinkRect(null);
        setValue(null);
      }
    };
  }, [isHovering]);

  useQuillEditorChange((...args) => {
    if (args[0] !== 'text-change') {
      return;
    }

    if (!value) {
      return;
    }

    const formats = quill.getFormat(value.index, value.length);
    if (formats.link !== value.link) {
      setValue({
        link: formats.link as string,
        index: value.index,
        length: value.length,
      });
    }
  });

  const isMouseEnterRef = useRef(false);

  const debouncedHandleNextLinkMouseEnter = useCallback(debounce((link: Link) => {
    if (!isMouseEnterRef.current) {
      return;
    }
    const rect = link.domNode?.getBoundingClientRect();
    if (!rect) {
      return;
    }
    setLinkRect(rect);
    const index = quill.getIndex(link);
    const length = link.length();

    setValue({
      link: link.domNode?.getAttribute('href') || "",
      index,
      length,
    });
  }, MOUSE_HANDLE_DELAY_TIME), [quill]);

  const handleNextLinkMouseEnter = useCallback((link: Link) => {
    isMouseEnterRef.current = true;
    debouncedHandleNextLinkMouseEnter(link);
  }, [debouncedHandleNextLinkMouseEnter]);

  const handleNextLinkMouseLeave = useCallback(() => {
    isMouseEnterRef.current = false;
    timer(MOUSE_HANDLE_DELAY_TIME).pipe(takeUntil(dispose$)).subscribe(() => {
      checkHoveringAndCloseRef.current();
    });
  }, [dispose$]);

  useQuillEvent(quill, messages.NextLinkMouseEnter, handleNextLinkMouseEnter);
  useQuillEvent(quill, messages.NextLinkMouseLeave, handleNextLinkMouseLeave);

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    timer(MOUSE_HANDLE_DELAY_TIME).pipe(takeUntil(dispose$)).subscribe(() => {
      checkHoveringAndCloseRef.current();
    });
  }, []);

  return (
    <RectAnchor
      parentElement={parentSelector}
      verticalPadding={verticalPadding}
      bounds={linkRect}
      placement="bottom"
      render={() => render?.(value)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
}

export { LinkToolbarPlugin };
