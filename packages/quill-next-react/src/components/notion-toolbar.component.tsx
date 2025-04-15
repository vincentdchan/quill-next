import React, { memo } from "react";
import { NotionToolbarButton } from "./notion-toolbar-button.component";
import { useQuill } from "../hooks/use-quill";
import BoldSvg from "./bold.svg?raw";
import ItalicSvg from "./italic.svg?raw";
import UnderlineSvg from "./underline.svg?raw";
import StrikeSvg from "./strike.svg?raw";
import "./notion-toolbar.component.css";

const NotionToolbar = memo(() => {
  const quill = useQuill();
  return (
    <div className="qn-notion-toolbar-container">
      <NotionToolbarButton
        onClick={() => quill.format("bold", true)}
        svg={BoldSvg}
      />
      <NotionToolbarButton
        onClick={() => quill.format("italic", true)}
        svg={ItalicSvg}
      />
      <NotionToolbarButton
        onClick={() => quill.format("underline", true)}
        svg={UnderlineSvg}
      />
      <NotionToolbarButton
        onClick={() => quill.format("strike", true)}
        svg={StrikeSvg}
      />
    </div>
  )
});

NotionToolbar.displayName = "NotionToolbar";

export { NotionToolbar }
