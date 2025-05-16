import type { Meta, StoryObj } from "@storybook/react";
import { NotionLikeQuillEditor } from "./notion-like-quill-editor";
import { Delta } from "quill-next";
import React from 'react';

const meta: Meta<typeof NotionLikeQuillEditor> = {
  title: "QuillEditor/NotionLike",
  component: NotionLikeQuillEditor,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    defaultValue: new Delta()
      .insert("Heading 1\n", { header: 1 })
      .insert("Heading 2\n", { header: 2 })
      .insert("Heading 3\n", { header: 3 })
      .insert({
        image:
          "https://github.com/vincentdchan/quill-next/raw/main/images/quill-next.png",
        attributes: {
          naturalWidth: 800,
          naturalHeight: 197,
        },
      })
      .insert("\n")
      .insert("Hello World! Select some text to see the toolbar.\n")
      .insert("Code", { code: true })
      .insert("\n")
      .insert("Hello World! Select some text to see the toolbar."),
  },
};

export const DarkMode: Story = {
  decorators: [
    (Story): any => {
      React.useEffect(() => {
        document.documentElement.setAttribute('data-theme', 'dark');
      }, []);
      return <Story />;
    },
  ],
  args: {
    defaultValue: new Delta()
      .insert("Heading 1\n", { header: 1 })
      .insert("Heading 2\n", { header: 2 })
      .insert("Heading 3\n", { header: 3 })
      .insert({
        image:
          "https://github.com/vincentdchan/quill-next/raw/main/images/quill-next.png",
        attributes: {
          naturalWidth: 800,
          naturalHeight: 197,
        },
      })
      .insert("\n")
      .insert("Code", { code: true })
      .insert("\n")
      .insert("Hello World! Select some text to see the toolbar."),
  },
};
