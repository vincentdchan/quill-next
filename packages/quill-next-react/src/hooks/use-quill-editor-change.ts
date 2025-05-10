import Quill from "quill-next";
import { useQuill } from "./use-quill";
import { EditorChangeHandler } from "../types/editor-change-handler.type";
import { useQuillEvent } from "./use-quill-event";

export function useQuillEditorChange(callback: EditorChangeHandler): void {
  const quill = useQuill();
  return useQuillEvent(quill, Quill.events.EDITOR_CHANGE, callback);
}
