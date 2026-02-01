const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { handlePeerConnection } = require('./utils');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 3000;
const clients = {};
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

io.on('connection', socket => {
  console.log('new client connected', socket.id);
  clients[socket.id] = {
    socket,
    peerConnections: null,
    isRenegotiating: false,
    localStream: null,
  };
  socket.on('offer', async data => {
    try {
      const {peerConnection} = await handlePeerConnection(socket.id, data.offer);
      clients[socket.id].peerConnections = peerConnection;
    } catch (error) {
      console.error('Error handling offer', error);
    }
  });
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
