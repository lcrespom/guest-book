<script lang="ts">
	import type { Message } from '$lib/model/message'

	export let messages: Message[]
	// If I don't put a comment here, syntax highlighting fails
</script>

<div class="card mt-3">
	<div class="card-header fw-bold">Previous posts</div>
	<div class="m-4 mt-3">
		<table class="table">
			<thead>
				<tr>
					<th>Name</th>
					<th>Message</th>
					<th>Date</th>
					<th>Time</th>
				</tr>
			</thead>
			<tbody>
				{#each messages as message}
					<tr>
						<td>{message.name}</td>
						<td>{message.message}</td>
						<td>asdf</td>
						<td>defs</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
