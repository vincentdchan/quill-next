import { useEffect } from 'react';
import Quill from 'quill-next';

function BubbleContainer() {
  return (
    <div id="bubble-container">
      <Editor
        config={{
          bounds: '#bubble-container .ql-container',
          modules: {
            syntax: true,
          },
          theme: 'bubble',
        }}
        onLoad={handleEditorLoad(0)}
      >
        <Content />
      </Editor>
    </div>
  );
}

export default BubbleContainer;