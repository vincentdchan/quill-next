import { useState, useEffect } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { QuillEditor, IQuillEditorProps } from './editor.component';
import { MarkdownPlugin } from './markdown/markdown-plugin';

const longMarkdownExample = `
# Hello World

This is a long markdown example.

## Subheading

This is a subheading.

### Subsubheading

This is a subsubheading. Bold text is **bold**. Italic text is *italic*.
`;

function WrappedQuillEditor(props: IQuillEditorProps): React.ReactElement {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const interval = setInterval((): void => {
      if (value < longMarkdownExample.length) {
        setValue(value + 1);
      } else {
        clearInterval(interval);
      }
    }, 50);
    return (): void => clearInterval(interval);
  }, [value]);

  return (
    <QuillEditor {...props}>
      <MarkdownPlugin value={longMarkdownExample.slice(0, value)} />
    </QuillEditor>
  );
}

const meta = {
  title: 'QuillEditor/Markdown',
  component: WrappedQuillEditor,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof QuillEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Markdown: Story = {
  args: {
    readOnly: true,
  },
};
