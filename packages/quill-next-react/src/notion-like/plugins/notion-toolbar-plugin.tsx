import React from "react";
import { IToolbarPluginProps, ToolbarPlugin } from "../../plugins/toolbar-plugin";
import { NotionToolbar } from "../components/notion-toolbar.component";

export type INotionToolbarPluginProps = Omit<IToolbarPluginProps, 'render'>;

function NotionToolbarPlugin(props: INotionToolbarPluginProps) {
  return <ToolbarPlugin {...props}
    render={({ formats }) => (
      <NotionToolbar formats={formats} />
    )}
  />;
}

export { NotionToolbarPlugin };
