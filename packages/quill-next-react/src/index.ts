import { QuillContext } from "./context/quill-context";
import { QuillEditor, type EditorChangeHandler, type IQuillEditorProps } from "./editor.component";
import { ForkedRegistry } from "./forked-registry";
import {
  useEmbedBlot,
  type BlotScope,
  type IRenderOptions,
  type IReactBlotOptions,
} from "./hooks/use-react-blot";
import { useQuill } from "./hooks/use-quill";
import { useQuillFormat } from "./hooks/use-quill-format";
import { QuillNextImage, useQuillNextImage } from "./quill-next-image.component";
import { IToolbarPluginProps, ToolbarPlugin } from "./plugins/toolbar-plugin.component";

export {
  QuillEditor as default,
  QuillContext,
  ForkedRegistry,
  useEmbedBlot,
  useQuill,
  useQuillFormat,
  QuillNextImage,
  useQuillNextImage,
  type IToolbarPluginProps,
  ToolbarPlugin,
  type EditorChangeHandler,
  type IQuillEditorProps,
  type BlotScope,
  type IRenderOptions,
  type IReactBlotOptions,
};
