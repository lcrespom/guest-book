import { json } from '@sveltejs/kit'
import type { RequestHandler } from '@sveltejs/kit'
import { dev } from '$app/environment'
import { Collection, MongoClient } from 'mongodb'
import { env } from '$env/dynamic/private'

let MONGODB_URI = ''

let options = {
	tls: true,
	tlsCAFile: '/app/mongodb.cert',
	useUnifiedTopology: true
}

async function initMongoDB() {
	try {
		const client = new MongoClient(MONGODB_URI, options)
		await client.connect()
		let db = client.db()
		return db.collection('messages')
	} catch (e) {
		console.error(e)
		return {} as Collection
	}
}

let rtenv = ''
if (dev) {
	MONGODB_URI = 'mongodb://localhost:27017/testdb'
	rtenv = 'Development'
} else {
	console.log('Production environment')
	MONGODB_URI = env.MONGODB_URI || 'mongodb://10.243.64.4:27017/testdb'
	rtenv = 'Production'
}
console.log(rtenv + ' environment, connecting to ' + MONGODB_URI)
let messages = await initMongoDB()

//----- POST: add a new message -----
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
		console.error(e)
		return json({ status: 'Error', detail: '' + e })
	}
}) satisfies RequestHandler

//----- GET: get most recent messages, latest first -----
export const GET = (async () => {
	try {
		let result = await messages.find().sort({ timestamp: -1 }).limit(10).toArray()
		return json({ status: 'OK', messages: result })
	} catch (e) {
		console.error(e)
		return json({ status: 'Error', detail: '' + e })
	}
}) satisfies RequestHandler
