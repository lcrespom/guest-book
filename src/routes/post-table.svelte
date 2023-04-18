<script lang="ts">
	import type { Message } from '$lib/model/message'

	export let messages: Message[]

	function unformatTimestamp(iso: string): [string, string] {
		let [date, time] = iso.split('T')
		return [date, time.split('.')[0]]
	}
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
					{@const [date, time] = unformatTimestamp(message.timestamp)}
					<tr>
						<td>{message.name}</td>
						<td>{message.message}</td>
						<td>{date}</td>
						<td>{time}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
