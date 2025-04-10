import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { QuillEditor } from './editor.component';
import { Delta } from "quill-next";
import "quill-next/dist/quill.snow.css";
import "quill-next/dist/quill.bubble.css";

const meta = {
  title: 'QuillEditor/Basic',
  component: QuillEditor,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof QuillEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Snow: Story = {
  args: {
    defaultValue: new Delta().insert("Hello World"),
    config: {
      theme: 'snow',
    }
  }
}

export const Bubble: Story = {
  decorators: [
    (Story) => (
      <div style={{ margin: '3em' }}>
        {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
        <Story />
      </div>
    ),
  ],
  args: {
    defaultValue: new Delta().insert("Hello World"),
    config: {
      theme: 'bubble',
      modules: {
        toolbar: true,
      }
    },
  },
}