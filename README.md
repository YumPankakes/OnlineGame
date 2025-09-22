# OnlineGame

The third version in my attempt to make a co-op platformer game using ChatGPT.

## Installation

Install the dependencies defined in `package.json`:

```bash
npm install
```

If you prefer to install each dependency individually, run the following commands instead:

```bash
npm install express@^5.1.0
npm install socket.io@^4.8.1
```

## Getting started

1. Start the development server:
   ```bash
   npm start
   ```
2. Open your browser to [http://localhost:3000](http://localhost:3000) to play the game.

The server uses [Express](https://expressjs.com/) to serve the static game files and [Socket.IO](https://socket.io/) to prepare for future multiplayer features. The client already connects to the Socket.IO server, so you can build on top of it when adding multiplayer mechanics.
