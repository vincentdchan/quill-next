import React from "react";
import { CommandPlugin, type ICommandPluginProps } from "./command-plugin";

type ISlashCommandPluginProps = Omit<ICommandPluginProps, "trigger">;

function SlashCommandPlugin(props: ISlashCommandPluginProps): React.ReactElement {
  return <CommandPlugin {...props} trigger="/" />;
}

export { SlashCommandPlugin };
