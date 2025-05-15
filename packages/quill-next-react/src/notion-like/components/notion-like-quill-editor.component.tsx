import React from "react";
import { QuillEditor, IQuillEditorProps } from "../../editor.component";
import { useNextLinkBlot } from "../../hooks/use-next-link-blot";
import { useNextImageBlot } from "../../components/quill-next-image";
import { NotionToolbarPlugin } from "../plugins/notion-toolbar-plugin";
import { NotionLinkToolbarPlugin } from "../plugins/notion-link-toolbar.plugin";

export interface NotionLikeQuillEditorProps extends IQuillEditorProps {}

function NotionLikeQuillEditor(
  props: NotionLikeQuillEditorProps
): React.ReactElement {
  const { blots = [], children, ...rest } = props;
  const LinkBlot = useNextLinkBlot();
  const ImageBlot = useNextImageBlot();
  return (
    <QuillEditor {...rest} blots={[...(blots || []), LinkBlot, ImageBlot]}>
      <NotionToolbarPlugin />
      <NotionLinkToolbarPlugin />
      {children}
    </QuillEditor>
  );
}

NotionLikeQuillEditor.displayName = "NotionLikeQuillEditor";

export { NotionLikeQuillEditor };
