<script lang="ts">
	import { onMount } from 'svelte'
	import EntryForm from './entry-form.svelte'
	import PostTable from './post-table.svelte'

	async function submitEntry(evt: CustomEvent) {
		let response = await fetch('/api/messages', {
			method: 'POST',
			body: JSON.stringify(evt.detail),
			headers: {
				'content-type': 'application/json'
			}
		})
		let result = await response.json()
		console.dir(result)
		getMessages()
	}

	async function getMessages() {
		let response = await fetch('/api/messages')
		let result = await response.json()
		if (result.status == 'OK') {
			messages = result.messages
			console.dir(messages)
		} else {
			console.error('Error:')
			console.error(result)
		}
	}

	onMount(getMessages)

	let messages: any[] = []
</script>

<article class="mx-auto">
	<h1 class="text-center">Guest Book</h1>
	<EntryForm on:submit={submitEntry} />
	<PostTable {messages} />
</article>

<style>
	article {
		max-width: 50em;
	}
</style>
