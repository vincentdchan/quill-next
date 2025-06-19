import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
	root: path.resolve(__dirname, 'dev'),
	plugins: [vue()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
		},
	},
	build: {
		lib: {
			entry: {
				index: path.resolve(__dirname, 'src/index.ts'),
			},
			formats: ['es'],
			fileName: (format, entryName) => `${entryName}.js`,
		},
	},
	test: {
		environment: 'jsdom',
	},
})
