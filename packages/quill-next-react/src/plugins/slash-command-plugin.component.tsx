import { useQuillInput } from "../hooks/use-quill-input";

export function SlashCommandPlugin() {
  useQuillInput({
    match: /\/([^\/])+/,
  });

  return null;
}
