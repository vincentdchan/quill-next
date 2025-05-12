import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from "vite-plugin-svgr";
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
      babel: {
        plugins: [
          "@emotion/babel-plugin",
        ],
      },
    }),
    svgr(),
  ],
  build: {
    lib: {
      entry: {
        "notion-like": resolve(__dirname, "src/notion-like/index.ts"),
        "markdown": resolve(__dirname, "src/markdown/index.ts"),
        index: resolve(__dirname, "src/index.ts"),
      },
      formats: ["es"],
      fileName: (format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: [
        "@emotion/react",
        "react",
        "react/jsx-runtime",
        "react-dom",
        "quill-next",
        "parchment",
        "rxjs",
        "lodash-es",
        "marked",
      ],
    },
  },
  test: {
    environment: "jsdom",
  },
});
