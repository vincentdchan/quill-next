import { IToolbarPluginProps, ToolbarPlugin } from "../../plugins/toolbar-plugin";
import { NotionToolbar } from "../components/toolbar/notion-toolbar.component";

export type INotionToolbarPluginProps = Omit<IToolbarPluginProps, 'render'>;

function NotionToolbarPlugin(props: INotionToolbarPluginProps) {
  return <ToolbarPlugin {...props}
    render={({ formats, toolbarSignal }) => (
      <NotionToolbar formats={formats} toolbarSignal={toolbarSignal} />
    )}
  />;
}

export { NotionToolbarPlugin };
