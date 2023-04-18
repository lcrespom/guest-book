<script lang="ts">
	import EntryForm from './entry-form.svelte'
	import PostTable from './post-table.svelte'

	function submitEntry(evt: CustomEvent) {
		console.dir(evt.detail)
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
