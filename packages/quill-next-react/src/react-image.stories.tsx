import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { QuillEditor, IQuillEditorProps } from './editor.component';
import Quill, { Delta } from "quill-next";
import { IRenderOptions, useEmbedBlot } from "./hooks/use-react-blot";
import ReactImage from "./react-image";
import "quill-next/dist/quill.snow.css";
import "quill-next/dist/quill.bubble.css";

function WrappedQuillEditor(props: IQuillEditorProps) {
  const ImageBlot = useEmbedBlot({
    blotName: "image",
    render: (options: IRenderOptions) => {
      return <ReactImage {...options} />
    }
  })
  return (
    <QuillEditor
      {...props}
      blots={[ImageBlot]}
    />
  )
}

const meta = {
  title: 'QuillEditor/Image',
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

export const Basic: Story = {
  args: {
    defaultValue: new Delta().insert("Hello World\n").insert({
      image: "https://github.com/vincentdchan/quill-next/raw/main/images/quill-next.png",
    }),
    config: {
      theme: 'bubble',
      modules: {
        toolbar: true,
      }
    },
  },
};
