import React, { useRef, useEffect, useState } from 'react';
import Quill, { type Delta, type EmitterSource } from "quill-next";
import { useQuillEvent } from "./hooks/use-quill-event";

export type EditorChangeHandler = (
  ...args:
    | [
        'text-change',
        Delta,
        Delta,
        EmitterSource,
      ]
    | [
        'selection-change',
        Range,
        Range,
        EmitterSource,
      ]
) => void;

export interface IQuillEditorProps {
  defaultValue?: Delta;
  theme?: string;
  children?: React.ReactNode;
  onTextChange?: (delta: Delta, oldContent: Delta, source: EmitterSource) => void;
  onSelectionChange?: (range: Range, oldRange: Range, source: EmitterSource) => void;
  onEditorChange?: EditorChangeHandler;
}

const QuillEditor = (props: IQuillEditorProps) => {
  const {
    theme,
    children,
    defaultValue,
    onTextChange,
    onSelectionChange,
    onEditorChange,
  } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const [quill, setQuill] = useState<Quill | null>(null);

  useEffect(() => {
    const quill = new Quill(containerRef.current!, {
      theme: theme ?? 'snow',
    });

    if (defaultValue) {
      quill.setContents(defaultValue);
    }

    setQuill(quill);

    return () => {
      quill.destroy();
    }
  }, [theme]);

  useQuillEvent(quill, Quill.events.TEXT_CHANGE, onTextChange);
  useQuillEvent(quill, Quill.events.SELECTION_CHANGE, onSelectionChange);
  useQuillEvent(quill, Quill.events.EDITOR_CHANGE, onEditorChange);

  return (
    <>
      <div ref={containerRef}></div>
      {quill && children}
    </>
  );
};

QuillEditor.displayName = 'QuillEditor';

export { QuillEditor }
