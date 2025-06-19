import type { QuillOptions } from 'quill-next'

export const defaultConfig: QuillOptions = {
	theme: 'snow',
	modules: {
		toolbar: [
			[{ header: [1, 2, false] }],
			['bold', 'italic', 'underline'],
			['link', 'image'],
			['clean'],
		],
	},
}
