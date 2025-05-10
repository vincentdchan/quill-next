import React from "react";
import { NotionLinkToolbar } from "../components/notion-link-toolbar.component";
import { LinkToolbarPlugin } from "../../plugins/link-toolbar-plugin";

function NotionLinkToolbarPlugin(): React.ReactElement {
  return <LinkToolbarPlugin render={(props) => <NotionLinkToolbar {...props} />} />;
}

NotionLinkToolbarPlugin.displayName = "NotionLinkToolbarPlugin";

export { NotionLinkToolbarPlugin };
