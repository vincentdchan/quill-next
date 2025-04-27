
import Quill, { type Range, type EmitterSource } from "quill-next";
import { useQuill } from "./use-quill";
import { useQuillEvent } from "./use-quill-event";

export type SelectionChangeHandler = (range: Range, oldRange: Range, source: EmitterSource) => void

export function useQuillSelectionChange(callback: SelectionChangeHandler) {
  const quill = useQuill();
  return useQuillEvent(quill, Quill.events.SELECTION_CHANGE, callback);
}
