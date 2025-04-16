import React from "react";
import { createPortal } from "react-dom";
import { useQuillInput } from "../hooks/use-quill-input";

export interface ISlashCommandPluginProps {
  render?: () => React.ReactNode;
}

export function SlashCommandPlugin(props: ISlashCommandPluginProps) {
  const [inputResult] = useQuillInput({
    trigger: '/',
  });

  if (!inputResult) {
    return null;
  }
  return createPortal((
    <div className="qn-slash-command-container">
      {props.render?.()}
    </div>
  ), document.body);
}
