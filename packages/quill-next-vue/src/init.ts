import Quill, { type QuillOptions } from 'quill-next'
import { NextTheme } from './next-theme'
import { BlotConstructor } from 'parchment'

function makeQuillWithBlots(
	container: HTMLElement,
	options: QuillOptions,
	blots?: BlotConstructor[]
): Quill {
	const originalImports = Quill.imports
	const newImports = {
		...originalImports,
	}

	let quill: Quill
	try {
		Quill.imports = newImports

		Quill.register('themes/next', NextTheme)

		blots?.forEach((blot) => {
			Quill.register(blot, true)
		})
		quill = new Quill(container, options)
	} finally {
		Quill.imports = originalImports
	}

	return quill
}

async function loadTheme(theme: string): Promise<void> {
	const insertTheme = (theme: string, content: string): void => {
		let styleElement: HTMLStyleElement | null = null
		const existingStyleElement = document.head.querySelectorAll(
			`style[data-quill-theme="${theme}"]`
		)
		if (existingStyleElement.length > 0) {
			// remove all existing style elements
			existingStyleElement.forEach((styleElement) => {
				document.head.removeChild(styleElement)
			})
		}

		styleElement = document.createElement('style')
		styleElement.setAttribute('data-quill-theme', theme)
		styleElement.setAttribute('type', 'text/css')
		styleElement.innerHTML = content
		document.head.appendChild(styleElement)
	}

	if (theme === 'next' || theme === 'snow') {
		const { default: css } = await import(`quill-next/dist/quill.snow.css?raw`)
		insertTheme(theme, css)
	} else if (theme === 'bubble') {
		const { default: css } = await import(
			`quill-next/dist/quill.bubble.css?raw`
		)
		insertTheme(theme, css)
	}
}

export { makeQuillWithBlots, loadTheme }
