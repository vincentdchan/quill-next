import { useState, useCallback, useRef, memo } from "react";
import { type IRenderOptions, useEmbedBlot } from "../hooks/use-react-blot";
import { imageContainer, imageShimmer } from "./quill-next-image.component.style";

const Shimmer = memo(() => {
  return (
    <div className="qn-image-shimmer" css={imageShimmer} />
  );
});

export function QuillNextImage(options: IRenderOptions): React.ReactElement {
  const { naturalWidth = 800, naturalHeight = 20 } = options.attributes;
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageWidth, setImageWidth] = useState(naturalWidth);
  const [imageHeight, setImageHeight] = useState(naturalHeight);
  const [isLoading, setIsLoading] = useState(true);
  const onLoad = useCallback(() => {
    setIsLoading(false)

    setImageWidth(imageRef.current?.naturalWidth || naturalWidth);
    setImageHeight(imageRef.current?.naturalHeight || naturalHeight);
  }, []);

  const aspectRatio = (imageWidth as number) / (imageHeight as number);

  return (
    <div
      className="qn-image-container"
      css={imageContainer}
      style={{
        width: imageWidth + 'px',
        aspectRatio: aspectRatio,
      }}
    >
      {isLoading ? (
        <Shimmer />
      ) : <></>}
      <img
        ref={imageRef}
        src={options.value as string}
        onLoad={onLoad}
      />
    </div>
  );
}

export function useNextImageBlot() {
  return useEmbedBlot({
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
