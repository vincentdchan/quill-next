/// <reference types="vite-plugin-svgr/client" />

declare module '*.svg?raw' {
  const content: string;
  export default content;
}

declare module '*.css?raw' {
  const content: string;
  export default content;
}
