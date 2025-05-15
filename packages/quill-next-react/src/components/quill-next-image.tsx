import { useState, useCallback, useRef, memo } from "react";
import {
  useBlockEmbedBlot,
  type IRenderOptions,
} from "../hooks/use-block-embed-blot";
import { imageContainer, imageShimmer } from "./quill-next-image.style";
import { BlotConstructor } from "parchment";
import { ImageResizeTool } from "./image-resize-tool";

const Shimmer = memo(() => {
  return <div className="qn-image-shimmer" css={imageShimmer} />;
});

export function QuillNextImage(options: IRenderOptions): React.ReactElement {
  const { naturalWidth = 800, naturalHeight = 20 } = options.attributes;
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageWidth, setImageWidth] = useState(naturalWidth);
  const [imageHeight, setImageHeight] = useState(naturalHeight);
  const [isLoading, setIsLoading] = useState(true);
  const [isHover, setIsHover] = useState(false);
  const [tempWidth, setTempWidth] = useState<number | undefined>(undefined);

  const handleMouseEnter = useCallback(() => {
    setIsHover(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHover(false);
  }, []);

  const onLoad = useCallback(() => {
    setIsLoading(false);

    setImageWidth(imageRef.current?.naturalWidth || naturalWidth);
    setImageHeight(imageRef.current?.naturalHeight || naturalHeight);
  }, []);

  const aspectRatio = (imageWidth as number) / (imageHeight as number);

  const width = tempWidth || imageWidth;

  return (
    <div
      className="qn-image-container"
      css={imageContainer}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        width: width + "px",
        aspectRatio: aspectRatio,
      }}
    >
      {isLoading ? <Shimmer /> : <></>}
      <img ref={imageRef} src={options.value as string} onLoad={onLoad} />
      {isHover && <ImageResizeTool setTempWidth={setTempWidth} />}
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
