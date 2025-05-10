import { useMemo } from "react";
import { ToolbarSignal } from "../classes/toolbar-signal.class";

export const useToolbarSignal = (): ToolbarSignal => {
  const toolbarSignalRef = useMemo(() => new ToolbarSignal(), []);

  return toolbarSignalRef;
};
