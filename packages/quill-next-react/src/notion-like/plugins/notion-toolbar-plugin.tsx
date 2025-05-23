import React from "react";
import { IToolbarPluginProps, ToolbarPlugin } from "../../plugins/toolbar-plugin";
import { NotionToolbar } from "../components/toolbar/notion-toolbar";

export type INotionToolbarPluginProps = Omit<IToolbarPluginProps, 'render'>;

function NotionToolbarPlugin(props: INotionToolbarPluginProps): React.ReactElement {
  return <ToolbarPlugin {...props}
    render={({ formats, toolbarSignal }) => (
      <NotionToolbar formats={formats} toolbarSignal={toolbarSignal} />
    )}
  />;
}

export { NotionToolbarPlugin };
