import React, { useRef, useEffect, useState } from 'react';
import Quill, { type Delta, type EmitterSource, type QuillOptions } from "quill-next";
import { useQuillEvent } from "./hooks/use-quill-event";
import { QuillContext } from "./context/quill-context";
import { BlotConstructor } from "parchment";
import { ForkedRegistry } from "./forked-registry";
import { EditorChangeHandler } from './types/editor-change-handler.type';
import { NextTheme } from './next-theme';
import { NextKeyboard } from "./modules/next-keyboard";

export interface IQuillEditorProps {
  defaultValue?: Delta;
  children?: React.ReactNode;
  readOnly?: boolean;
  config?: QuillOptions;
  onReady?: (quill: Quill) => void;
  onTextChange?: (delta: Delta, oldContent: Delta, source: EmitterSource) => void;
  onSelectionChange?: (range: Range, oldRange: Range, source: EmitterSource) => void;
  onEditorChange?: EditorChangeHandler;
  loadingFallback?: () => React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  dangerouslySetInnerHTML?: {
    // Should be InnerHTML['innerHTML'].
    // But unfortunately we're mixing renderer-specific type declarations.
    __html: string | TrustedHTML;
  } | undefined;
  blots?: BlotConstructor[];
}

function makeQuillWithBlots(container: HTMLElement, options: QuillOptions, blots?: BlotConstructor[]) {
  const originalImports = Quill.imports;
  const newImports = {
    ...originalImports,
  }

  let quill: Quill;
  try {
    Quill.imports = newImports;

    Quill.register("themes/next", NextTheme);
    Quill.register("modules/keyboard", NextKeyboard, true);

    blots?.forEach((blot) => {
      Quill.register(blot, true);
    });
    quill = new Quill(container, options);
  } finally {
    Quill.imports = originalImports;
  }

  return quill;
}

async function loadTheme(theme: string): Promise<void> {
  const insertTheme = (theme: string, content: string) => {
    let styleElement: HTMLStyleElement | null = null;
    const existingStyleElement = document.head.querySelectorAll(`style[data-quill-theme="${theme}"]`);
    if (existingStyleElement.length > 0) {
      // remove all existing style elements
      existingStyleElement.forEach((styleElement) => {
        document.head.removeChild(styleElement);
      });
    }

    styleElement = document.createElement('style');
    styleElement.setAttribute("data-quill-theme", theme);
    styleElement.setAttribute("type", "text/css");
    styleElement.innerHTML = content;
    document.head.appendChild(styleElement);
  }

  if (theme === 'next' || theme === 'snow') {
    const { default: css } = await import(`quill-next/dist/quill.snow.css?raw`)
    insertTheme(theme, css);
  } else if (theme === 'bubble') {
    const { default: css } = await import(`quill-next/dist/quill.bubble.css?raw`)
    insertTheme(theme, css);
  }
}

const QuillEditor = (props: IQuillEditorProps): React.ReactNode => {
  const {
    config,
    children,
    defaultValue,
    readOnly,
    onReady,
    onTextChange,
    onSelectionChange,
    onEditorChange,
    loadingFallback,
    className,
    style,
    dangerouslySetInnerHTML,
    blots,
  } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const [quill, setQuill] = useState<Quill | null>(null);
  const [themeLoaded, setThemeLoaded] = useState(false);

  useEffect(() => {
    let theme = config?.theme;

    if (!theme) {
      theme = 'next';
    }

    let cancel = false;
    loadTheme(theme)
      .then(() => {
        if (cancel) {
          return;
        }

        setThemeLoaded(true);
      })
      .catch((err) => {
        console.error('Error loading theme:', err);
      });

    return () => {
      cancel = true;
    }
  }, [config?.theme]);

  useEffect(() => {
    if (!themeLoaded) {
      return;
    }

    const forkedRegistry = new ForkedRegistry(Quill.DEFAULTS.registry);

    const quillOptions: QuillOptions = {
      ...config,
      registry: forkedRegistry,
    };

    if (!quillOptions.theme) {
      quillOptions.theme = 'next';
    }

    const quill = makeQuillWithBlots(
      containerRef.current!,
      quillOptions,
      blots,
    );

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
  }, [themeLoaded]);

  useEffect(() => {
    quill?.enable(!readOnly);
  }, [quill, readOnly]);

  useEffect(() => {
    if (dangerouslySetInnerHTML && quill) {
      const contents = quill.clipboard.convert({
        html: `${dangerouslySetInnerHTML.__html}<p><br></p>`,
        text: '\n',
      });
      quill.setContents(contents);
    }
  }, [quill]);

  useEffect(() => {
    // we must set the contents after the quill is initialized
    // so we can listen to the NextLinkAttached event
    if (defaultValue && quill) {
      quill.setContents(defaultValue);
    }
  }, [defaultValue, quill]);

  useQuillEvent(quill, Quill.events.TEXT_CHANGE, onTextChange);
  useQuillEvent(quill, Quill.events.SELECTION_CHANGE, onSelectionChange);
  useQuillEvent(quill, Quill.events.EDITOR_CHANGE, onEditorChange);

  if (!themeLoaded) {
    return loadingFallback ? loadingFallback() : null;
  }

  return (
    <QuillContext.Provider value={quill}>
      <div
        ref={containerRef}
        className={className}
        style={style}
      />
      {quill && children}
    </QuillContext.Provider>
  );
};

QuillEditor.displayName = 'QuillEditor';

export { QuillEditor }
