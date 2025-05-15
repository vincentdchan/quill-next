import { css } from "@emotion/react";

export const imageContainer = css({
  position: "relative",
  maxWidth: "100%",
  cursor: "default",

  img: {
    width: "100%",
    height: "100%",
  },
});

export const imageShimmer = css({
  position: "absolute",
  width: "100%",
  height: "100%",
  background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.5s infinite linear",
});
