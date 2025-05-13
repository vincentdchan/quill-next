<h1 align="center">
  <a href="https://quill-next.diverse.space/" title="Quill">Quill Next</a>
</h1>
<p align="center">
  <a href="https://quill-next.diverse.space/" title="Quill"><img alt="Quill Logo" src="./images/quill-next.png" width="400"></a>
</p>
<p align="center">
  <a title="Documentation" href="https://quill-next.diverse.space/docs/quickstart"><strong>Documentation</strong></a>
  &#x2022;
  <a title="Development" href="https://github.com/vincentdchan/quill-next/blob/main/.github/DEVELOPMENT.md"><strong>Development</strong></a>
  &#x2022;
  <a title="Contributing" href="https://github.com/vincentdchan/quill-next/blob/main/.github/CONTRIBUTING.md"><strong>Contributing</strong></a>
  &#x2022;
  <a title="Interactive Playground" href="https://quill-next.diverse.space/playground/"><strong>Interactive Playground</strong></a>
</p>
<p align="center">
  <a href="https://github.com/vincentdchan/quill-next/actions" title="Build Status"><img src="https://github.com/vincentdchan/quill-next/actions/workflows/main.yml/badge.svg" alt="Build Status"></a>
  <a href="https://npmjs.com/package/quill-next" title="Version"><img src="https://img.shields.io/npm/v/quill-next.svg" alt="Version"></a>
</p>

<hr/>

**Quill Next** is a modern rich text editor built on the foundation of [Quill](https://quilljs.com/). This fork is currently a personal project, aiming to keep Quill thriving and evolving.

Project Goals
-------------

1.  **Continued Maintenance**: We will actively maintain Quill Next, ensuring compatibility with modern web standards and regularly updating dependencies.

2.  **Better Integrations**: We aim to provide deeper integration with popular UI frameworks (especially React), allowing seamless embedding of React-based components within the editor.

3. **Bug Fixes**: We're dedicated to addressing known issues and community-reported bugs to make Quill Next as reliable and stable as possible.

4. **Compatibility**: Quill Next will remain fully compatible with the original Quill's API and Delta data structures.


## Key differences with Quill

- **Delta ES**: Quill Next uses [Delta ES](https://github.com/vincentdchan/delta-es) as the Delta data structure, which is a fork of [Delta](https://github.com/quilljs/delta) with ES module. _You should not aware of this, unless you are a core developer of Quill_.
  - Use `lodash-es` instead of `lodash` internally.
  - This helps to reduce the bundle size. And be friendly to tree shaking.
- **Destory method**: Quill Next adds a `destroy` method to the Quill object, which is used to destroy the editor and destroy all the modules. This helps to avoid memory leaks.

```ts
const quill = new Quill('#editor');
quill.destroy();  // the modules are also destroyed
```
- Exports built-in modules as ES modules.
  - Keyboard: `quill/modules/keyboard`
- React integration package: `quill-next-react`
  - [Plugins](https://quill-next.diverse.space/docs/plugins/plugins) and [hooks](https://quill-next.diverse.space/docs/plugins/plugins) for React.

## Quickstart

### React Quill

```bash
npm install quill-next quill-next-react
```

```tsx
import { Delta } from 'quill-next'
import QuillEditor from 'quill-next-react';

export default function App() {
  return (
    <QuillEditor
      defaultValue={new Delta().insert("Hello world")}
      config={{ theme: "next"}}
    />
  )
}
```

### Vanilla Quill

Instantiate a new Quill object with a css selector for the div that should become the editor.

```html
<!-- Include stylesheet -->
<link href="https://esm.sh/quill-next/dist/quill.snow.css" rel="stylesheet" />

<!-- Create the editor container -->
<div id="editor">
  <p>Hello World!</p>
  <p>Some initial <strong>bold</strong> text</p>
  <p><br /></p>
</div>

<!-- Initialize Quill editor -->
<script type="module">
  import Quill from 'https://esm.sh/quill-next';

  const quill = new Quill('#editor', {
    theme: 'snow'
  });
</script>
```

Take a look at the [Quill Next](https://quill-next.diverse.space/) website for more documentation, guides and [live playground](https://quill-next.diverse.space/playground/snow)!

## Download

```shell
npm install quill-next
```


## Packages

- **[Quill](./packages/quill/):** The original Quill editor with bug fixes and improvements.
- **[Quill Next React](./packages/quill-next-react/)**: The React wrapper for Quill Next.
- **[Website](./packages/website/)**: The website of Quill Next, including demo and documentation.

## License

BSD 3-clause
