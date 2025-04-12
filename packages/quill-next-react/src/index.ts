import { QuillContext } from "./context/quill-context";
import { QuillEditor, type EditorChangeHandler, type IQuillEditorProps } from "./editor.component";
import { ForkedRegistry } from "./forked-registry";
import {
  useEmbedBlot,
  type BlotScope,
  type IRenderOptions,
  type IReactBlotOptions,
} from "./hooks/use-react-blot";

export {
  QuillEditor as default,
  QuillContext,
  ForkedRegistry,
  useEmbedBlot,
  type EditorChangeHandler,
  type IQuillEditorProps,
  type BlotScope,
  type IRenderOptions,
  type IReactBlotOptions,
};
