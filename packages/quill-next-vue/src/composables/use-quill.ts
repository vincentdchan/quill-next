import { onMounted, shallowRef, useTemplateRef, type ShallowRef } from 'vue'
import { defaultConfig } from '../default-config'
import { merge } from 'lodash-es'
import Quill, { QuillOptions } from 'quill-next'
import { makeQuillWithBlots } from '../init'
import { type BlotConstructor } from 'parchment'

type UseQuillReturn = {
	quill: Readonly<ShallowRef<Quill | null>>
}

function useQuill(
	templateRef: ReturnType<typeof useTemplateRef<HTMLDivElement>>,
	config: QuillOptions = {},
	blots?: BlotConstructor[]
): UseQuillReturn {
	const quill = shallowRef<Quill | null>(null)

	onMounted(() => {
		quill.value = makeQuillWithBlots(
			templateRef.value,
			merge({}, defaultConfig, config),
			blots
		)
	})

	return {
		quill,
	}
}

export { useQuill, type UseQuillReturn }
