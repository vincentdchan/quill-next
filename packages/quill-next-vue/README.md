# Quill Next Vue

A simple and flexible Vue component wrapper for the Quill Next.

I plan to release a new version every 2 weeks with new features and improvements, so stay tuned!

## Requirements

This package requires Vue 3.4+ and Quill Next as peer dependencies. It is designed to work with the latest versions of both libraries.

## Installation

```bash
npm install quill-next-vue
# or
yarn add quill-next-vue
#or
pnpm add quill-next-vue
```

You can install the package using npm or yarn:

```bash
npm install quill-next-vue
# or
yarn add quill-next-vue
#or
pnpm add quill-next-vue
```

**Note**: This package assumes that `quill-next` and `vue` (3.4+) are already installed. It also requires Quill as a peer dependency. You might need to install it separately if you haven't already:

```bash
npm install quill-next
# or
yarn add quill-next
#or
pnpm add quill-next
```

## Notice

It is only the first version of the package, so it may not be fully functional and may contain bugs and instabilities. If you encounter any issues, please open an issue on the GitHub repository.

It also suports only a subset of Quill Next features, so some advanced features may not work as expected or may not be implemented yet.

But since I personally use it in my projects, I will try to fix bugs and add new features as soon as possible.

As of version 1.0.0, it is only a wrapper and nothing more. Vue-specific optimizations and features will be added in future versions.

## Usage

Import the QuillEditor component and use it in your Vue application.

```vue
<template>
	<quill-editor
		v-model="editorContent"
		@text-change="onTextChange"
		@ready="onReady"
		:config="editorConfig"
	/>
</template>

<script>
import { ref } from 'vue'
import { Delta } from 'quill-next'
import QuillEditor from 'quill-next-vue'

export default {
	components: {
		QuillEditor,
	},
	setup() {
		const editorContent = ref(new Delta().insert('Hello World!'))
		const editorConfig = {
			theme: 'snow',
			modules: {
				toolbar: [
					[{ header: [1, 2, false] }],
					['bold', 'italic', 'underline'],
					['image', 'code-block'],
				],
			},
		}

		const onTextChange = () => {
			// Handle text change
		}

		const onReady = () => {
			// Handle editor ready
		}

		return {
			editorContent,
			editorConfig,
			onTextChange,
			onReady,
		}
	},
}
</script>
```

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.
