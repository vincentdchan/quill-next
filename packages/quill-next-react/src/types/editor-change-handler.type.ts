import { type Delta, type EmitterSource } from "quill-next";

export type EditorChangeHandler = (
  ...args:
    | [
        'text-change',
        Delta,
        Delta,
        EmitterSource,
      ]
    | [
        'selection-change',
        Range,
        Range,
        EmitterSource,
      ]
) => void;
