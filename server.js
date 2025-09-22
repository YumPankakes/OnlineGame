const path = require('path');
const express = require('express');
const http = require('http');
const { randomUUID } = require('crypto');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const MAX_LEADERBOARD_ENTRIES = 20;
const leaderboard = [];

function sanitizeName(name) {
  const value = typeof name === 'string' ? name : '';
  const trimmed = value.trim().slice(0, 16);
  return trimmed || 'Player';
}

function normaliseScore(value) {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) {
    return null;
  }
  return Math.round(num);
}

function leaderboardPayload() {
  return leaderboard.map(entry => ({
    id: entry.id,
    name: entry.name,
    ms: entry.ms
  }));
}

function broadcastLeaderboard() {
  io.emit('leaderboard', { scores: leaderboardPayload() });
}

app.get('/api/scores', (req, res) => {
  res.json({ scores: leaderboardPayload() });
});

app.post('/api/scores', (req, res) => {
  const { name, ms } = req.body || {};
  const sanitisedName = sanitizeName(name);
  const normalisedMs = normaliseScore(ms);

  if (normalisedMs == null) {
    return res.status(400).json({ error: 'Invalid score payload.' });
  }

  const entry = {
    id: randomUUID(),
    name: sanitisedName,
    ms: normalisedMs,
    createdAt: Date.now()
  };

  leaderboard.push(entry);
  leaderboard.sort((a, b) => a.ms - b.ms);

  let accepted = true;
  if (leaderboard.length > MAX_LEADERBOARD_ENTRIES) {
    const removed = leaderboard.splice(MAX_LEADERBOARD_ENTRIES);
    if (removed.some(item => item.id === entry.id)) {
      accepted = false;
    }
  }

  broadcastLeaderboard();

  return res.status(201).json({
    accepted,
    entry: accepted ? { id: entry.id, name: entry.name, ms: entry.ms } : null,
    scores: leaderboardPayload()
  });
});

io.on('connection', socket => {
  console.log(`Client connected: ${socket.id}`);

  socket.emit('leaderboard', { scores: leaderboardPayload() });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
