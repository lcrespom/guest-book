<script lang="ts">
	import { createEventDispatcher } from 'svelte'

	const dispatch = createEventDispatcher()
</script>

<div class="card mt-4">
	<div class="card-header fw-bold">Write your message</div>
	<div class="p-4">
		<div class="row mb-3">
			<label for="input-name" class="col-sm-2 col-form-label text-end">Name</label>
			<div class="col-sm-10">
				<input type="text" class="form-control" id="input-name" required />
			</div>
		</div>
		<div class="row mb-3">
			<label for="input-msg" class="col-sm-2 col-form-label text-end">Message</label>
			<div class="col-sm-10">
				<textarea class="form-control" id="input-msg" required />
			</div>
		</div>
		<div class="text-center">
			<button class="btn btn-primary">Post Message</button>
		</div>
	</div>
</div>
