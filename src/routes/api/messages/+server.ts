import { json } from '@sveltejs/kit'
import type { RequestHandler } from '@sveltejs/kit'
import { MongoClient } from 'mongodb'

async function initMongoDB() {
	const uri = 'mongodb://localhost:27017/testdb'
	const client = new MongoClient(uri)
	await client.connect()
	let db = client.db()
	return db.collection('messages')
}

// function closeMongo() {
// 	client.close()
// }

let messages = await initMongoDB()

export const POST = (async ({ request }) => {
	try {
		let { name, message } = await request.json()
		let timestamp = new Date().toISOString()
		let result = await messages.insertOne({ name, message, timestamp })
		if (result.acknowledged) {
			return json({ status: 'OK', messageId: result.insertedId })
		} else {
			return json({ status: 'NotAcknowledged' })
		}
	} catch (e) {
		return json({ status: 'Error', detail: '' + e })
	}
}) satisfies RequestHandler
