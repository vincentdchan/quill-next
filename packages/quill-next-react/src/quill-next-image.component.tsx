import React, { useState, useCallback } from "react";
import { type IRenderOptions, useEmbedBlot } from "./hooks/use-react-blot";

export function QuillNextImage(options: IRenderOptions) {
  const [isLoading, setIsLoading] = useState(true);
  const onLoad = useCallback(() => setIsLoading(false), []);
  return (
    <div>
      {isLoading && <div>Loading...</div>}
      <img
        src={options.value as string}
        onLoad={onLoad}
      />
    </div>
  );
}

export function useQuillNextImage() {
  return useEmbedBlot({
    blotName: "image",
    render: (options: IRenderOptions) => {
      return <QuillNextImage {...options} />;
    },
  });
}
