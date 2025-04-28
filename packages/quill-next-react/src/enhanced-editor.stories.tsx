import type { Meta, StoryObj } from "@storybook/react";
import { QuillEditor, IQuillEditorProps } from "./editor.component";
import { Delta } from "quill-next";
import { useNextImageBlot } from "./components/quill-next-image.component";
import { SlashCommandPlugin } from "./plugins/slash-command-plugin";
import { CommandPlugin } from "./plugins/command-plugin";
import { useNextLinkBlot } from "./hooks/use-next-link-blot";
import {
  NotionToolbarPlugin,
  NotionMenuList,
  NotionMenuItemHeader,
  NotionMenuItem,
  NotionLinkToolbarPlugin,
} from "./notion-like";

interface CommandItem {
  key: string;
  content: string;
}

const atCommands: CommandItem[] = [
  { key: "Vincent Chan", content: "Vincent Chan" },
  { key: "John Doe", content: "John Doe" },
];

function WrappedQuillEditor(props: IQuillEditorProps) {
  const slashCommands: CommandItem[] = [
    { key: "image", content: "Image" },
    { key: "canvas", content: "Canvas" },
  ];
  const { blots = [] } = props;
  const ImageBlot = useNextImageBlot();
  const LinkBlot = useNextLinkBlot();
  return (
    <QuillEditor {...props} blots={[...blots, ImageBlot, LinkBlot]}>
      <NotionToolbarPlugin />
      <SlashCommandPlugin
        length={slashCommands.length}
        render={({ selectedIndex, content, apply }) => (
          <NotionMenuList>
            <NotionMenuItemHeader>Input: {content}</NotionMenuItemHeader>
            {slashCommands.map((item, index) => (
              <NotionMenuItem
                key={item.key}
                active={index === selectedIndex}
                onClick={apply}
              >
                {item.content}
              </NotionMenuItem>
            ))}
          </NotionMenuList>
        )}
      />
      <CommandPlugin
        trigger="@"
        length={atCommands.length}
        render={({ selectedIndex, content, apply }) => (
          <NotionMenuList>
            <NotionMenuItemHeader>Input: {content}</NotionMenuItemHeader>
            {atCommands.map((item, index) => (
              <NotionMenuItem
                key={item.key}
                active={index === selectedIndex}
                onClick={apply}
              >
                {item.content}
              </NotionMenuItem>
            ))}
          </NotionMenuList>
        )}
      />
      <NotionLinkToolbarPlugin />
    </QuillEditor>
  );
}

const meta = {
  title: "QuillEditor/Enhanced",
  component: WrappedQuillEditor,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
} satisfies Meta<typeof QuillEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    defaultValue: new Delta().insert("Hello World\n")
      .insert("link", {
        link: "https://github.com/vincentdchan/quill-next",
      })
      .insert(
        {
          image:
            "https://github.com/vincentdchan/quill-next/raw/main/images/quill-next.png",
        },
        {
          naturalWidth: 800,
          naturalHeight: 197,
        }
      ),
    config: {
      theme: 'next',
    },
  },
};
