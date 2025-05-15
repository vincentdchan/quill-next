import { useState, useCallback, useRef, memo } from "react";
import {
  useBlockEmbedBlot,
  type IRenderOptions,
} from "../hooks/use-block-embed-blot";
import { imageContainer, imageShimmer } from "./quill-next-image.style";
import { BlotConstructor } from "parchment";
import { ImageResizeTool } from "./image-resize-tool";
import { isNumber } from "lodash-es";

const Shimmer = memo(() => {
  return <div className="qn-image-shimmer" css={imageShimmer} />;
});

export function QuillNextImage(options: IRenderOptions): React.ReactElement {
  const { getBlotIndex, attributes } = options;
  const widthValue = attributes?.width;
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageNaturalWidth, setImageNaturalWidth] = useState<number>(options.attributes.naturalWidth ? options.attributes.naturalWidth as number : 800);
  const [imageNaturalHeight, setImageNaturalHeight] = useState<number>(options.attributes.naturalHeight ? options.attributes.naturalHeight as number : 20);
  const [isLoading, setIsLoading] = useState(true);
  const [tempWidth, setTempWidth] = useState<number | undefined>(undefined);

  const onLoad = useCallback(() => {
    setIsLoading(false);
    if (imageRef.current) {
      setImageNaturalWidth(imageRef.current.naturalWidth);
      setImageNaturalHeight(imageRef.current.naturalHeight);
    }
  }, []);

  let width: number;
  if (isNumber(tempWidth)) {
    width = tempWidth;
  } else if (isNumber(widthValue)) {
    width = widthValue;
  } else {
    width = imageNaturalWidth;
  }

  const aspectRatio = imageNaturalWidth / imageNaturalHeight;

  return (
    <div
      className="qn-image-container"
      css={imageContainer}
      style={{
        width: width + "px",
        aspectRatio: aspectRatio,
      }}
    >
      {isLoading ? <Shimmer /> : <></>}
      <img ref={imageRef} src={options.value as string} onLoad={onLoad} />
      {!isLoading && <ImageResizeTool setTempWidth={setTempWidth} getBlotIndex={getBlotIndex} />}
    </div>
  );
}

export function useNextImageBlot(): BlotConstructor {
  return useBlockEmbedBlot({
    blotName: "image",
    className: "qn-image",
    onAttach: (domNode: HTMLElement) => {
      domNode.style.maxWidth = "100%";
    },
    render: (options: IRenderOptions) => {
      return <QuillNextImage {...options} />;
    },
  });
}
