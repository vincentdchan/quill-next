<template>
	<QuillEditor v-model="value" />
	<hr />
	<pre>
		{{ { value } }}
	</pre
	>
	<button @click="onAdd('popa')">Add popa</button>
</template>

<script setup lang="ts">
import QuillEditor from '../src/components/quill-editor.vue'
import { ref } from 'vue'
import { Delta } from 'quill-next'

const value = ref<Delta>(new Delta().insert('Hello, Quill!'))

function onAdd(text: string) {
	value.value = value.value.insert(text)
}
</script>

<style scoped></style>
