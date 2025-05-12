import { useEffect } from "react";
import { useQuill } from "../hooks/use-quill";
import { marked } from "marked";

export interface MarkdownPluginProps {
  value?: string;
}

function MarkdownPlugin({ value }: MarkdownPluginProps): null {
  const quill = useQuill();

  useEffect(() => {
    if (!value) {
      return;
    }

    const html = marked.parse(value) as string;
    const contents = quill.clipboard.convert({
      html,
      text: '\n',
    });

    const currentContents = quill.getContents();
    const diff = currentContents.diff(contents);
    quill.updateContents(diff);
  }, [value]);

  return null;
}

export { MarkdownPlugin };
