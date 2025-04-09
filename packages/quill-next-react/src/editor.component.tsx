import React, { useRef, useEffect, useState } from 'react';
import Quill, { type Delta, type EmitterSource, type QuillOptions } from "quill-next";
import { useQuillEvent } from "./hooks/use-quill-event";
import { QuillContext } from './context/quill-context';

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
  children?: React.ReactNode;
  readOnly?: boolean;
  config?: QuillOptions;
  onReady?: (quill: Quill) => void;
  onTextChange?: (delta: Delta, oldContent: Delta, source: EmitterSource) => void;
  onSelectionChange?: (range: Range, oldRange: Range, source: EmitterSource) => void;
  onEditorChange?: EditorChangeHandler;
}

const QuillEditor = (props: IQuillEditorProps) => {
  const {
    config,
    children,
    defaultValue,
    readOnly,
    onReady,
    onTextChange,
    onSelectionChange,
    onEditorChange,
  } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const [quill, setQuill] = useState<Quill | null>(null);

  useEffect(() => {
    const quill = new Quill(containerRef.current!, {
      ...config,
    });

    if (defaultValue) {
      quill.setContents(defaultValue);
    }

    setQuill(quill);

    if (onReady) {
      try {
        onReady(quill);
      } catch (err) {
        console.error('Error in onReady callback:', err);
      }
    }

    return () => {
      quill.destroy();
    }
  }, []);

  useEffect(() => {
    quill?.enable(!readOnly);
  }, [quill, readOnly]);

  useQuillEvent(quill, Quill.events.TEXT_CHANGE, onTextChange);
  useQuillEvent(quill, Quill.events.SELECTION_CHANGE, onSelectionChange);
  useQuillEvent(quill, Quill.events.EDITOR_CHANGE, onEditorChange);

  return (
    <QuillContext.Provider value={quill}>
      <div ref={containerRef}></div>
      {quill && children}
    </QuillContext.Provider>
  );
};

QuillEditor.displayName = 'QuillEditor';

export { QuillEditor }
