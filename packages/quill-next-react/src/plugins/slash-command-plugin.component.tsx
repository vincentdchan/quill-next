import { useQuillInput } from "../hooks/use-quill-input";

export function SlashCommandPlugin() {
  useQuillInput({
    trigger: '/',
    match: /\/([^\/])+/,
  });

  return null;
}
