# Guestbook

A simple guestbook Sveltekit app, using MongoDB for persistence

## Starting up MongoDB

You can start a local MongoDB server with Docker:

```bash
docker run --name my-mongodb -p 27017:27017 --rm -it mongo
```

## Starting Sveltekit in development mode

Once you have installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

Check the sveltekit documentation for more details.
