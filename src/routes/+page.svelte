<script lang="ts">
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
	}
</script>

<article class="mx-auto">
	<h1 class="text-center">Guest Book</h1>
	<EntryForm on:submit={submitEntry} />
	<PostTable />
</article>

<style>
	article {
		max-width: 50em;
	}
</style>
