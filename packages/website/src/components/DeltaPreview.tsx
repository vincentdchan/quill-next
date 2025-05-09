import { Delta } from "quill-next";
import { useCallback, useRef, useState } from "react";
import Quill from "quill-next";
import NotionLikeQuillEditor from "quill-next-react/notion-like";
import { Highlight, themes } from 'prism-react-renderer';
import styles from "./DeltaPreview.module.scss";

const defaultDelta = new Delta([
  {
    insert: "Hello, world!",
  },
]);

function DeltaPreview() {
  const quillRef = useRef<Quill | null>(null);
  const [content, setContent] = useState<string>("");
  const handleTextChange = useCallback(() => {
    const quill = quillRef.current;
    if (!quill) {
      return;
    }
    const fullContent = quill.getContents();
    setContent(JSON.stringify(fullContent, null, 2));
  }, []);
  return (
    <div className={styles.deltaPreviewContainer}>
      <NotionLikeQuillEditor
        onReady={(quill) => {
          quillRef.current = quill;
          handleTextChange();
        }}
        defaultValue={defaultDelta}
        onTextChange={handleTextChange}
        config={{
          placeholder: "Type something...",
        }}
      >
      </NotionLikeQuillEditor>
      <Highlight
        code={content}
        language="json"
        theme={{
          ...themes.vsDark,
        }}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} style={style}>
            <code>
              {tokens.map((line, i) =>
                i === tokens.length - 1 &&
                line[0].empty &&
                line.length === 1 ? null : (
                  <div key={i} {...getLineProps({ line, key: i })}>
                    {line.map((token, key) => {
                      const { myKey, ...rest } = getTokenProps({ token, key });
                      return (
                        <span key={key} {...rest} />
                      );
                    })}
                  </div>
                ),
              )}
            </code>
          </pre>
        )}
      </Highlight>
    </div>
  );
}

export default DeltaPreview;
