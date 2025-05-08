import { QuillContext } from "./context/quill-context";
import { QuillEditor, type IQuillEditorProps } from "./editor.component";
import { type EditorChangeHandler } from "./types/editor-change-handler.type";
import { ForkedRegistry } from "./forked-registry";
import {
  useEmbedBlot,
  type BlotScope,
  type IRenderOptions,
  type IReactBlotOptions,
} from "./hooks/use-react-blot";
import { useQuill } from "./hooks/use-quill";
import { useQuillFormats } from "./hooks/use-quill-formats";
import { useQuillInput } from "./hooks/use-quill-input";
import { useQuillEditorChange } from "./hooks/use-quill-editor-change";
import { useQuillTextChange, type TextChangeHandler } from "./hooks/use-quill-text-change";
import { useQuillSelectionChange, type SelectionChangeHandler } from "./hooks/use-quill-selection-change";
import { useQuillArrowIndex } from "./hooks/use-quill-arrow-index";
import { useNextLinkBlot } from "./hooks/use-next-link-blot";
import { useQuillKeyboardBinding } from "./hooks/use-quill-keyboard-binding";
import { QuillNextImage, useNextImageBlot } from "./components/quill-next-image.component";
import { IToolbarPluginProps, ToolbarPlugin } from "./plugins/toolbar-plugin";
import { LinkToolbarPlugin } from "./plugins/link-toolbar-plugin";
import { RectAnchor, RectAnchorProps } from "./components/rect-anchor.component";

export {
  QuillEditor,
  QuillContext,
  ForkedRegistry,
  useEmbedBlot,
  useQuill,
  useQuillFormats,
  useQuillInput,
  useQuillEditorChange,
  useQuillTextChange,
  type TextChangeHandler,
  useQuillSelectionChange,
  type SelectionChangeHandler,
  useQuillArrowIndex,
  useQuillKeyboardBinding,
  useNextImageBlot,
  useNextLinkBlot,
  QuillNextImage,

  type IToolbarPluginProps,
  ToolbarPlugin,
  LinkToolbarPlugin,
  RectAnchor,
  type RectAnchorProps,

  type EditorChangeHandler,
  type IQuillEditorProps,
  type BlotScope,
  type IRenderOptions,
  type IReactBlotOptions,
};
