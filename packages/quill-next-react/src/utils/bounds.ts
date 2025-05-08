import Quill, { Bounds } from "quill-next";

export function limitBoundsInRect(bounds: Bounds, rect: Bounds): Bounds | null {
  const top = Math.max(bounds.top, rect.top);

  if (top > rect.bottom) {
    return null;
  }

  if (bounds.bottom < rect.top) {
    return null;
  }

  return {
    left: Math.max(bounds.left, rect.left),
    right: Math.min(bounds.right, rect.right),
    top,
    bottom: Math.min(bounds.bottom, rect.bottom),
    width: Math.min(bounds.width, rect.width),
    height: Math.min(bounds.height, rect.height),
  };
}

export function getBoundsFromQuill(quill: Quill): Bounds | null {
  const range = quill.getSelection(false);
  if (!range || range.length === 0) {
    return null;
  }

  const lines = quill.getLines(range.index, range.length);
  if (lines.length === 1) {
    const bounds = quill.selection.getBounds(range.index, range.length);
    if (bounds != null) {
      return bounds;
    }
  } else {
    const lastLine = lines[lines.length - 1];
    const index = quill.getIndex(lastLine);
    const length = Math.min(
      lastLine.length() - 1,
      range.index + range.length - index
    );
    const indexBounds = quill.selection.getBounds(index, length);
    if (indexBounds != null) {
      return indexBounds;
    }
  }

  return null;
}
