import type { Meta, StoryObj } from "@storybook/react";
import { NotionLikeQuillEditor } from "./notion-like-quill-editor.component";
import { Delta } from "quill-next";

const meta = {
  title: "QuillEditor/NotionLike",
  component: NotionLikeQuillEditor,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
} satisfies Meta<typeof NotionLikeQuillEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    defaultValue: new Delta().insert("Hello World! Select some text to see the toolbar."),
  },
};
